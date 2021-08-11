//import { mocked } from "ts-jest/utils";
//import { run } from "../src/index";
//import CLI from "../src/cli";
//import Explorer from "../src/Explorer";
//
//jest.mock("../src/cli", () => {
//  return jest.fn().mockImplementation(() => {
//    return {
//      title: () => {
//        "Mocked Title";
//      },
//      askExplorerType: () =>
//        Promise.resolve({
//          explore: "X blocks from current",
//        }),
//      askBlockCount: () =>
//        Promise.resolve({
//          count: "5",
//        }),
//    };
//  });
//});
//
//jest.mock("../src/Explorer", () => {
//  return jest.fn().mockImplementation(() => {
//    return {
//      run: () => {},
//    };
//  });
//});
//
//describe("index", () => {
//  const MockedCLI = mocked(CLI, true);
//  const MockedExplorer = mocked(Explorer, true);
//
//  beforeEach(() => {
//    MockedCLI.mockClear();
//    MockedExplorer.mockClear();
//  });
//
//  describe("run()", () => {
//    test("it calls the CLI", async () => {
//      expect(MockedCLI).not.toHaveBeenCalled();
//      await run();
//      expect(MockedCLI).toHaveBeenCalled();
//    });
//
//    test("it calls the Explorer", async () => {
//      expect(MockedExplorer).not.toHaveBeenCalled();
//      await run();
//      expect(MockedExplorer).toHaveBeenCalled();
//    });
//  });
//});
//
