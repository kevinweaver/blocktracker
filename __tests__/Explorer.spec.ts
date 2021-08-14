//TODO switch to consts
import { web3 } from "../src/web3";
import Explorer from "../src/Explorer";
import {
  Address,
  Addresses,
  Transaction,
  ExplorerData,
} from "../src/ExplorerInterfaces";
import { mockWeb3, seedUsers, saveState, revertState, eth } from "./utils";

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
let snapshot_id = 0;

beforeEach(async () => {
  snapshot_id = await saveState();
  addresses = await seedUsers();
  defaultAccount = addresses[0];
  alice = addresses[1];
  bob = addresses[2];
  return addresses;
});

afterEach(async () => {
  await revertState(snapshot_id);
});

describe("Explorer", () => {
  describe("getCurrentBlock()", () => {
    //test("it returns the latest block number", async () => {});
  });

  describe("isContract()", () => {
    //test("it returns true when address is a contract", async () => {});
    test("it returns false when address is not a contract", async () => {
      let explorer = new Explorer(0, 0);
      expect(explorer.isContract(defaultAccount)).resolves.toBe(false);
    });
  });

  describe("run()", () => {
    // describe("given only a start value", () => {
    //   test("it searches the correct number of blocks", async () => {});
    // });

    // describe("given a range of blocks", () => {
    //   test("it searches the correct number of blocks", async () => {});
    // });

    describe("processes transaction data", () => {
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

      test("it returns a hash of Addresses with transaction amounts", async () => {
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
