import { web3 } from "../src/web3";
import Explorer from "../src/Explorer";
import {
  Address,
  Addresses,
  Transaction,
  ExplorerOutput,
} from "../src/ExplorerInterfaces";
import { seedUsers, clearSeeds } from "../script/seedTransactions";

// Mock web3 and replace with ganache
jest.mock("../src/web3Provider", () => {
  function provider() {
    return require("ganache-cli").provider();
  }
  return { provider };
});

function eth(amount: string) {
  return web3.utils.toWei(amount, "ether");
}

let addresses = [];
let ganache = "";
let alice = "";
let bob = "";

beforeAll(async () => {
  console.log("STARTED seeding addresses beforeAll");
  // Ganache -> Alice 6 ETH
  // Alice -> Bob 5 ETH
  addresses = await seedUsers();
  ganache = addresses[0];
  alice = addresses[1];
  bob = addresses[2];
  console.log("DONE seeding addresses beforeAll", addresses);
  return addresses;
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
      beforeEach(async () => {
        await web3.eth.sendTransaction({
          to: alice,
          from: ganache,
          value: eth("3"),
        });

        await web3.eth.sendTransaction({
          to: bob,
          from: alice,
          value: eth("2"),
        });
      });

      test("it returns a hash of Addresses with transaction amounts", async () => {
        let addresses: Addresses = {};
        addresses[ganache] = {
          received: 0,
          sent: +eth("3"),
          isContract: false,
        };
        addresses[alice] = {
          received: +eth("3"),
          sent: +eth("2"),
          isContract: false,
        };
        addresses[bob] = {
          received: +eth("2"),
          sent: 0,
          isContract: false,
        };
        let expectedOutput: ExplorerOutput = {
          start: 0,
          end: 2,
          current: 2,
          addresses,
        };

        let explorer = new Explorer(0, 2);
        const receivedOutput = await explorer.run();

        expect(receivedOutput).toEqual(expectedOutput);
      });
    });
    //test("it throws an error given a number > the current block number")

    //test("it throws an error given a number < 0")

    //
  });
});
