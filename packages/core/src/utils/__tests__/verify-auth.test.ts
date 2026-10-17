import verifyAuth, { resolveTimeoutSeconds } from "../verify-auth";
import childProcess from "child_process";

const spawn = childProcess.spawn as jest.Mock;
jest.mock("child_process");

const mockWarn = jest.fn();
jest.mock("../logger", () => () => ({
  log: { warn: (...args: any[]) => mockWarn(...args) },
  verbose: { info: jest.fn() },
  veryVerbose: { info: jest.fn() },
}));

describe("verify-auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

describe("resolveTimeoutSeconds", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return default 5 when value is undefined", () => {
    expect(resolveTimeoutSeconds(undefined)).toBe(5);
    expect(mockWarn).not.toHaveBeenCalled();
  });

  test("should return the value when it is a valid positive number", () => {
    expect(resolveTimeoutSeconds(10)).toBe(10);
    expect(mockWarn).not.toHaveBeenCalled();
  });

  test("should return the value when it is a valid fractional number", () => {
    expect(resolveTimeoutSeconds(0.5)).toBe(0.5);
    expect(mockWarn).not.toHaveBeenCalled();
  });

  test("should fall back to 5 and warn for a negative number", () => {
    expect(resolveTimeoutSeconds(-3)).toBe(5);
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid githubAuthTimeout (-3); expected a positive number. Falling back to 5s."
    );
  });

  test("should fall back to 5 and warn for zero", () => {
    expect(resolveTimeoutSeconds(0)).toBe(5);
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid githubAuthTimeout (0); expected a positive number. Falling back to 5s."
    );
  });

  test("should fall back to 5 and warn for NaN", () => {
    expect(resolveTimeoutSeconds(NaN)).toBe(5);
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid githubAuthTimeout (NaN); expected a positive number. Falling back to 5s."
    );
  });

  test("should fall back to 5 and warn for Infinity", () => {
    expect(resolveTimeoutSeconds(Infinity)).toBe(5);
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid githubAuthTimeout (Infinity); expected a positive number. Falling back to 5s."
    );
  });

  test("should fall back to 5 and warn for a non-number value", () => {
    expect(resolveTimeoutSeconds("fast" as unknown as number)).toBe(5);
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid githubAuthTimeout (fast); expected a positive number. Falling back to 5s."
    );
  });
});

describe("verifyAuth timeout integration", () => {
  const setTimeoutSpy = jest.spyOn(global, "setTimeout");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should use default 5s timeout when no value is provided", async () => {
    spawn.mockImplementationOnce(() => ({
      stderr: { on: () => {} },
      kill: () => {},
      on: (_: string, cb: () => void) => cb(),
    }));

    await verifyAuth("origin", "main");

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  test("should use provided valid timeout value", async () => {
    spawn.mockImplementationOnce(() => ({
      stderr: { on: () => {} },
      kill: () => {},
      on: (_: string, cb: () => void) => cb(),
    }));

    await verifyAuth("origin", "main", 10);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 10000);
  });

  test("should fall back to default 5s timeout for invalid value", async () => {
    spawn.mockImplementationOnce(() => ({
      stderr: { on: () => {} },
      kill: () => {},
      on: (_: string, cb: () => void) => cb(),
    }));

    await verifyAuth("origin", "main", -3);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });
});
