import { loadPlugin } from "../load-plugins";
import { dummyLog } from "../logger";

const logger = dummyLog();

const modules = vi.hoisted(() => ({
  "@auto-canary/baz": {
    default: class {
      name = "baz";
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
  test("should load canary plugins", () => {
    expect(loadPlugin(["baz", {}], logger)?.name).toBe("baz");
  });
});
