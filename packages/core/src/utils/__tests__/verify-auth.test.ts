import verifyAuth from "../verify-auth";
import childProcess from "child_process";

const spawn = childProcess.spawn as jest.Mock;
jest.mock("child_process");

describe("verify-auth", () => {
  test("should handle error", async () => {
    spawn.mockImplementationOnce(() => ({
      stderr: { on: () => {} },
      kill: () => {},
      on: () => {
        throw new Error();
      },
    }));
    expect(await verifyAuth("origin", "main")).toBe(false);
  });

  test("should verify auth when we can push to remote", async () => {
    spawn.mockImplementationOnce(() => ({
      stderr: { on: () => {} },
      kill: () => {},
      on: (_: string, cb: () => void) => cb(),
    }));
    expect(await verifyAuth("origin", "main")).toBe(true);
  });

  test("should not verify auth when we can't push to remote", async () => {
    spawn.mockImplementationOnce(() => ({
      stderr: {
        on: (_: string, cb: (data: string) => void) =>
          cb("fatal: could not read Username"),
      },
      kill: () => {},
      on: (_: string, cb: () => void) => cb(),
    }));
    expect(await verifyAuth("bad", "main")).toBe(false);
  });
});
