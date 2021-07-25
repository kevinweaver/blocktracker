import { Explorer } from "./Explorer";

describe("Explorer", () => {
  beforeEach(() => {});

  describe("getStart()", () => {
    test("it returns true", () => {
      let explorer = new Explorer({ start: 12 });
      expect(explorer.getStart()).toEqual(12);
    });
  });
});
