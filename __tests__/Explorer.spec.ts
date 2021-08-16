//TODO switch to consts
import { web3 } from "../src/web3";
import Explorer from "../src/Explorer";
import { Addresses, ExplorerData } from "../src/ExplorerInterfaces";
import {
  eth,
  createContract,
  seedUsers,
  saveState,
  revertState,
  mineBlock,
} from "./utils/helpers";

function provider() {
  const Ganache = require("ganache-core");
  return Ganache.provider();
}

// Mock web3 and replace network with ganache
jest.mock("../src/web3Provider", () => {
  return { provider };
});

let addresses = [];
let defaultAccount = "";
let alice = "";
let bob = "";

beforeEach(async () => {
  await saveState();

  addresses = await seedUsers();
  defaultAccount = addresses[0];
  alice = addresses[1];
  bob = addresses[2];
  return addresses;
});

afterEach(async () => {
  await revertState();
});

describe("Explorer", () => {
  let explorer = new Explorer();

  describe("getCurrentBlock()", () => {
    test("returns the latest block number", async () => {
      expect(explorer.getCurrentBlock()).resolves.toBe(0);
      await mineBlock();
      expect(explorer.getCurrentBlock()).resolves.toBe(1);
    });
  });

  describe("isContract()", () => {
    let explorer = new Explorer();
    test("returns true when address is a contract", async () => {
      const contract = await createContract(defaultAccount);
      const response = await explorer.isContract(contract);
      expect(response).toBe(true);
    });

    test("returns false when address is not a contract", async () => {
      expect(explorer.isContract(alice)).resolves.toBe(false);
    });
  });

  describe("run()", () => {
    describe("given only a start value", () => {
      beforeEach(async () => {
        await mineBlock();
        await mineBlock();
      });

      test("it searches from the current block", async () => {
        let addresses: Addresses = {};
        let expectedOutput: ExplorerData = {
          start: 2,
          end: 2,
          current: 2,
          totalEth: 0,
          contractsCreated: 0,
          addresses,
          blockErrors: {},
          transactionErrors: {},
        };

        const receivedOutput = await explorer.run({ start: 0 });

        expect(receivedOutput).toEqual(expectedOutput);
      });
    });

    describe("given a range of blocks", () => {
      beforeEach(async () => {
        await mineBlock();
        await mineBlock();
      });

      test("it searches the correct number of blocks", async () => {
        let addresses: Addresses = {};
        let expectedOutput: ExplorerData = {
          start: 0,
          end: 1,
          current: 2,
          totalEth: 0,
          contractsCreated: 0,
          addresses,
          blockErrors: {},
          transactionErrors: {},
        };

        const receivedOutput = await explorer.run({ start: 0, end: 1 });

        expect(receivedOutput).toEqual(expectedOutput);
      });
    });

    describe("given transaction data and contract creation", () => {
      beforeEach(async () => {
        await web3.eth.sendTransaction({
          to: alice,
          from: defaultAccount,
          value: eth(10),
        });

        await web3.eth.sendTransaction({
          to: bob,
          from: alice,
          value: eth(1),
        });

        await createContract(defaultAccount);
      });

      test("returns accurate ExplorerData", async () => {
        let addresses: Addresses = {};
        addresses[defaultAccount] = {
          received: 0,
          sent: 10,
          isContract: false,
        };
        addresses[alice] = {
          received: 10,
          sent: 1,
          isContract: false,
        };
        addresses[bob] = {
          received: 1,
          sent: 0,
          isContract: false,
        };
        let expectedOutput: ExplorerData = {
          start: 0,
          end: 3,
          current: 3,
          totalEth: 11,
          contractsCreated: 1,
          addresses,
          blockErrors: {},
          transactionErrors: {},
        };

        const receivedOutput = await explorer.run({ start: 0, end: 3 });

        expect(receivedOutput).toEqual(expectedOutput);
      });
    });
  });
});
