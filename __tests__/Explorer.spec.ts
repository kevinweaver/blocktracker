import Explorer, { Address, Addresses, Transaction } from "../src/Explorer";
import { seedTransactions, clearSeeds } from "../script/seedTransactions";

// Mock web3 and replace with ganache
jest.mock("../src/web3Provider", () => {
  function provider() {
    return require("ganache-cli").provider();
  }
  return { provider };
});

let addresses = [];
let alice = "";
let bob = "";

beforeAll(async () => {
  // Alice -> Bob 5 ETH
  addresses = await seedTransactions();
  alice = addresses[0];
  bob = addresses[1];
});

afterAll(() => {
  clearSeeds();
});

describe("Explorer", () => {
  describe("run()", () => {
    describe("given only a start value", () => {
      test("it searches the correct number of blocks", async () => {});
    });

    describe("given a range of blocks", () => {
      test("it searches the correct number of blocks", async () => {});
    });

    describe("processes transaction data", () => {
      test("it returns a hash of Addresses", async () => {
        let explorer = new Explorer(0, 1);
        console.log("alice", alice);
        console.log("bob", bob);

        let expectedOutput: Addresses = {};
        expectedOutput[alice] = { received: 0, sent: 0, isContract: false };
        expectedOutput[bob] = { received: 0, sent: 0, isContract: false };

        expect(await explorer.run()).toEqual(expectedOutput);
      });
    });
    //test("it throws an error given a number > the current block number")

    //test("it throws an error given a number < 0")

    //
  });
});
