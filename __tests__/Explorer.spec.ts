//TODO switch to consts
import { web3 } from "../src/web3";
import Explorer from "../src/Explorer";
import {
  Address,
  Addresses,
  Transaction,
  ExplorerData,
} from "../src/ExplorerInterfaces";
import {
  createContract,
  seedUsers,
  saveState,
  revertState,
  eth,
} from "./utils/helpers";

function provider() {
  const Ganache = require("ganache-core");
  return Ganache.provider();
}

// Mock web3 and replace with ganache
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
  // Revert to fresh blockchain
  await revertState();
});

describe("Explorer", () => {
  describe("getCurrentBlock()", () => {
    test("returns the latest block number", async () => {
      let explorer = new Explorer(0, 0);
      expect(explorer.getCurrentBlock()).resolves.toBe(0);
      await web3.eth.sendTransaction({
        to: alice,
        from: defaultAccount,
        value: eth(11),
      });
      expect(explorer.getCurrentBlock()).resolves.toBe(1);
    });
  });

  describe("isContract()", () => {
    let explorer = new Explorer(0, 0);
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
    // describe("given only a start value", () => {
    //   test("it searches the correct number of blocks", async () => {});
    // });

    // describe("given a range of blocks", () => {
    //   test("it searches the correct number of blocks", async () => {});
    // });

    describe("given transaction data", () => {
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
      });

      test("it returns correct ExplorerData", async () => {
        let addresses: Addresses = {};
        addresses[defaultAccount] = {
          received: 0,
          sent: eth(10),
          isContract: false,
        };
        addresses[alice] = {
          received: eth(10),
          sent: eth(1),
          isContract: false,
        };
        addresses[bob] = {
          received: eth(1),
          sent: 0,
          isContract: false,
        };
        let expectedOutput: ExplorerData = {
          start: 0,
          end: 2,
          current: 2,
          totalEth: 0,
          uncles: 0,
          sent: 0,
          received: 0,
          contractsCreated: 0,
          addresses,
        };

        let explorer = new Explorer(0, 2);
        const receivedOutput = await explorer.run();

        expect(receivedOutput).toEqual(expectedOutput);
      });
    });
  });
});
