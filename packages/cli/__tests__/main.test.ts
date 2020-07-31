import main, { run } from "../src/run";

process.env.GH_TOKEN = "XXXX";

jest.mock("@octokit/rest");

test("throws error for unknown args", async () => {
  process.exit = jest.fn() as any;
  console.log = jest.fn() as any;

  // @ts-ignore
  await run("foo", { foo: 123 });

  expect(process.exit).toHaveBeenCalledWith(1);
});

test("throws exits for caught error", async () => {
  console.log = jest.fn() as any;
  process.exit = jest.fn() as any;

  await main("foo", {});

  expect(process.exit).toHaveBeenCalledWith(1);
});
