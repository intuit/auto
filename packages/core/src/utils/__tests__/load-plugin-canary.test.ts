import { loadPlugin } from "../load-plugins";
import { dummyLog } from "../logger";

const logger = dummyLog();

jest.mock(
  "@auto-canary/baz",
  () => ({
    default: class {
      name = "baz";
    },
  }),
  {
    virtual: true,
  }
);

describe("loadPlugins", () => {
  test("should load canary plugins", () => {
    expect(loadPlugin(["baz", {}], logger)?.name).toBe("baz");
  });
});
