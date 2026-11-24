import { Auto } from "@auto-it/core";
import { runCli, execute } from "../src/run";

process.env.GH_TOKEN = "XXXX";

// The Octokit that core imports. The CLI package doesn't depend on it directly.
vi.mock("../../core/node_modules/@octokit/rest");
vi.mock("../../core/src/utils/verify-auth");

test("throws error for unknown args", async () => {
  process.exit = vi.fn() as any;
  console.log = vi.fn() as any;

  // @ts-ignore
  await execute("foo", { foo: 123 });

  expect(process.exit).toHaveBeenCalledWith(1);
});

test("throws exits for caught error", async () => {
  console.log = vi.fn() as any;
  process.exit = vi.fn() as any;

  await runCli("foo", {});

  expect(process.exit).toHaveBeenCalledWith(1);
});

test("init doesn't tear down, because it loads no config", async () => {
  const init = vi.spyOn(Auto.prototype, "init").mockResolvedValue();
  const teardown = vi.spyOn(Auto.prototype, "teardown");

  await expect(execute("init", {})).resolves.toBeUndefined();

  expect(init).toHaveBeenCalled();
  expect(teardown).not.toHaveBeenCalled();
});
