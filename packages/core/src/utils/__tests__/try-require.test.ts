import path from "path";
import tryRequire from "../try-require";

const modules = vi.hoisted(() => ({
  test: "success",
  npm: "success",
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

describe("try require", () => {
  test("should fall back to normal require", async () => {
    expect(tryRequire("test")).toBe("success");
  });

  test("should not fall back to normal require for npm", async () => {
    expect(tryRequire("npm")).not.toBe("success");
  });

  test("should return nothing if not found", async () => {
    expect(tryRequire("foobar")).toBeUndefined();
  });

  test("should require from a directory", async () => {
    expect(
      tryRequire("./__tests__/test", path.resolve(path.join(__dirname, "..")))
    ).toBe("success");
  });
});
