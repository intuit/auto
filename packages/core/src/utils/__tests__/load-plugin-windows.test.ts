import { loadPlugin } from "../load-plugins";
import { dummyLog } from "../logger";

const logger = dummyLog();

const modules = vi.hoisted(() => ({
  "C:\\plugins\\filter-non-pull-request.js": {
    default: class {
      name = "foo";
    },
  },
}));

// core falls back to requireg, which the setup file maps to Node's require.
// That can't see vi.mock modules, so serve this file's modules from it.
vi.mock("requireg", async () => {
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);

  return {
    default: (id: string) =>
      id in modules ? modules[id as keyof typeof modules] : require(id),
  };
});

describe("loadPlugins", () => {
  test("should load official plugins", () => {
    expect(
      loadPlugin(["C:\\plugins\\filter-non-pull-request.js", {}], logger)?.name
    ).toBe("foo");
  });
});
