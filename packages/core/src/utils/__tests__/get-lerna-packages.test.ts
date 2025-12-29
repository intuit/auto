import endent from "endent";
import execPromise from "../exec-promise";
import getLernaPackages from "../get-lerna-packages";

const exec = jest.fn();
jest.mock("../exec-promise");
// @ts-ignore
execPromise.mockImplementation(exec);

test("it shouldn't included version-less packages", async () => {
  exec.mockReturnValue(endent`
    /dir/a:a:0.3.0--canary.32.d54a0c4.0
    /dir/b:b:MISSING:PRIVATE
  `);
  expect(await getLernaPackages()).toStrictEqual([
    {
      name: "a",
      path: "/dir/a",
      version: "0.3.0--canary.32.d54a0c4.0",
    },
  ]);
});
