import { runCli, execute } from "../src/run";

process.env.GH_TOKEN = "XXXX";

jest.mock("@octokit/rest");
jest.mock("../../core/src/utils/verify-auth");

test("throws error for unknown args", async () => {
  process.exit = jest.fn() as any;
  console.log = jest.fn() as any;

  // @ts-ignore
  await execute("foo", { foo: 123 });

  expect(process.exit).toHaveBeenCalledWith(1);
});

test("throws exits for caught error", async () => {
  console.log = jest.fn() as any;
  process.exit = jest.fn() as any;

  await runCli("foo", {});

  expect(process.exit).toHaveBeenCalledWith(1);
});
