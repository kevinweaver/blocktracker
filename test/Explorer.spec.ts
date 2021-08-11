const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { assert } = chai;

const web3 = require("../src/web3");
const { Explorer, Addresses, Transaction } = require("../src/Explorer");
const { seedUsers, clearSeeds } = require("../script/seedTransactions");

// Mock web3 and replace with ganache
//jest.mock("../src/web3Provider", () => {
//  function provider() {
//    return require("ganache-cli").provider();
//  }
//  return { provider };
//});

function eth(amount: string) {
  return web3.utils.toWei(amount, "ether");
}

let addresses = [];
let ganache = "";
let alice = "";
let bob = "";

before(async () => {
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

after(() => {
  clearSeeds();
});

describe("Explorer", () => {
  describe("run()", () => {
    describe("given only a start value", () => {
      //test("it searches the correct number of blocks", async () => {});
    });

    describe("given a range of blocks", () => {
      //test("it searches the correct number of blocks", async () => {});
    });

    describe("processes transaction data", () => {
      it("returns a hash of Addresses", async () => {
        // ganache -> alice 6 ETH
        await web3.eth.sendTransaction({
          to: alice,
          from: ganache,
          value: eth("3"),
        });

        // alice -> bob 5 ETH
        await web3.eth.sendTransaction({
          to: bob,
          from: alice,
          value: eth("2"),
        });

        console.log("ganache", ganache);
        console.log("alice", alice);
        console.log("bob", bob);

        let expectedOutput = {};
        expectedOutput[ganache] = {
          received: 0,
          sent: +eth("3"),
          isContract: false,
        };
        expectedOutput[alice] = {
          received: +eth("3"),
          sent: +eth("2"),
          isContract: false,
        };
        expectedOutput[bob] = {
          received: +eth("2"),
          sent: 0,
          isContract: false,
        };

        console.log("TEST STARTED!");
        let explorer = new Explorer(0, 2);
        const receivedOutput = await explorer.run();

        assert.equal(receivedOutput, expectedOutput);

        console.log("RECEIVED", receivedOutput);
        console.log("EXPECTED", expectedOutput);
      });
    });
    //test("it throws an error given a number > the current block number")

    //test("it throws an error given a number < 0")

    //
  });
});
