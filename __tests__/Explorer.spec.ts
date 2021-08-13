//TODO switch to consts
import { web3 } from "../src/web3";
import Explorer from "../src/Explorer";
import {
  Address,
  Addresses,
  Transaction,
  ExplorerData,
} from "../src/ExplorerInterfaces";
import { seedUsers, clearSeeds } from "../script/seedTransactions";

// Mock web3 and replace with ganache
jest.mock("../src/web3Provider", () => {
  function provider() {
    return require("ganache-cli").provider();
  }
  console.log("provider", provider);
  return { provider };
});

function eth(amount: number) {
  return +web3.utils.toWei(`${amount}`, "ether");
}

let addresses = [];
let defaultAccount = "";
let alice = "";
let bob = "";

beforeEach(async () => {
  // Ganache -> Alice 6 ETH
  // Alice -> Bob 5 ETH
  addresses = await seedUsers();
  defaultAccount = addresses[0];
  alice = addresses[1];
  bob = addresses[2];
  return addresses;
});

afterEach(() => {
  //TODO implement
  clearSeeds();
});

describe("Explorer", () => {
  describe("getCurrentBlock()", () => {
    test("it returns the latest block number", async () => {});
  });

  describe("isContract()", () => {
    test("it returns true when address is a contract", async () => {});
    test("it returns false when address is not a contract", async () => {
      let explorer = new Explorer(0, 0);
      expect(explorer.isContract(defaultAccount)).resolves.toBe(false);
    });
  });

  describe("run()", () => {
    describe("given only a start value", () => {
      test("it searches the correct number of blocks", async () => {});
    });

    describe("given a range of blocks", () => {
      test("it searches the correct number of blocks", async () => {});
    });

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

    // describe("determines number of contracts", () => {
    //   beforeEach(async () => {
    //     await web3.eth.sendTransaction({
    //       to: bob,
    //       from: alice,
    //       value: eth(2),
    //     });
    //   });

    //   test("it returns a hash of Addresses with transaction amounts", async () => {
    //     let addresses: Addresses = {};
    //     addresses[ganache] = {
    //       received: 0,
    //       sent: eth(3),
    //       isContract: true,
    //     };
    //     let expectedOutput: ExplorerData = {
    //       start: 0,
    //       end: 1,
    //       current: 1,
    //       totalEth: 0,
    //       uncles: 0,
    //       sent: 0,
    //       received: 0,
    //       contractsCreated: 0,
    //       addresses,
    //     };

    //     let explorer = new Explorer(0, 2);
    //     const receivedOutput = await explorer.run();

    //     expect(receivedOutput).toEqual(expectedOutput);
    //   });
    // });

    //test("it throws an error given a number > the current block number")

    //test("it throws an error given a number < 0")

    //
  });
});
