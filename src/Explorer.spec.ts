import Explorer from "./Explorer";

beforeAll(() => {
  // Mock web3 and replace with ganache
  jest.mock("./web3Provider", () => {
    function provider() {
      return require("ganache-cli").provider();
    }
    return { provider };
  });
});

describe("Explorer", () => {
  describe("run()", () => {
    describe("given only a start value", () => {});

    describe("given a range of blocks", () => {
      test("it returns an array", async () => {
        let explorer = new Explorer(0, 1);
        expect(await explorer.run()).toEqual([0, 1]);
      });
    });
    //test("it throws an error given a number > the current block number")

    //test("it throws an error given a number < 0")

    //
  });
});
