import { loadPlugin } from "../load-plugins";
import { dummyLog } from "../logger";

const logger = dummyLog();

jest.mock(
  "C:\\plugins\\filter-non-pull-request.js",
  () => ({
    default: class {
      name = "foo";
    },
  }),
  {
    virtual: true,
  }
);

describe("loadPlugins", () => {
  test("should load official plugins", () => {
    expect(
      loadPlugin(["C:\\plugins\\filter-non-pull-request.js", {}], logger)?.name
    ).toBe("foo");
  });
});
