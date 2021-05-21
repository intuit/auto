import Auto from "@auto-it/core";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { execSync } from "child_process";

import Brew from "../src";

const exec = jest.fn();
const existsSync = jest.fn();
const mkdirSync = jest.fn();
const readFileSync = jest.fn();
const writeFileSync = jest.fn();

jest.mock("fs", () => ({
  // @ts-ignore
  read: (a, b, cb) => {
    cb(undefined);
  },
  // @ts-ignore
  existsSync: (...args) => existsSync(...args),
  // @ts-ignore
  mkdirSync: (...args) => mkdirSync(...args),
  // @ts-ignore
  readFileSync: (...args) => readFileSync(...args),
  // @ts-ignore
  writeFileSync: (...args) => writeFileSync(...args),
  // @ts-ignore
  readFile: (a, b, cb) => {
    cb(undefined, "{}");
  },
  // @ts-ignore
  writeFile: (a, b, cb) => {
    cb(undefined, "{}");
  },
  ReadStream: function () {},
  WriteStream: function () {},
  // @ts-ignore
  closeSync: () => undefined,
}));

jest.mock("child_process");

// @ts-ignore
execSync.mockImplementation(exec);

describe("Brew Plugin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should do nothing with an uninitialized auto", async () => {
    const brewPlugin = new Brew({ name: "foo", executable: "./foo" });
    const autoHooks = makeHooks();

    brewPlugin.apply({ hooks: autoHooks, logger: dummyLog() } as Auto);

    await autoHooks.afterVersion.promise({});

    expect(exec).not.toHaveBeenCalled();
  });

  test("should exit when there are errors", async () => {
    const exit = jest.fn();
    // @ts-ignore
    process.exit = exit;

    const brewPlugin = new Brew({ name: "foo", executable: "./foo" });
    const autoHooks = makeHooks();

    brewPlugin.apply(({
      hooks: autoHooks,
      logger: dummyLog(),
      git: {
        getLatestTagInBranch: () => {
          throw new Error();
        },
      },
    } as unknown) as Auto);

    await autoHooks.afterVersion.promise({});

    expect(exit).toHaveBeenCalled();
  });

  test("should validate it's configuration", async () => {
    const config = { name: "foo", execuable: "./foo" };
    // @ts-ignore
    const brewPlugin = new Brew(config);
    const autoHooks = makeHooks();

    brewPlugin.apply({ hooks: autoHooks, logger: dummyLog() } as Auto);

    expect(
      await autoHooks.validateConfig.promise("brew", config)
    ).toMatchSnapshot();
  });

  test("should not validate other's configurations", async () => {
    const config = { name: "foo", execuable: "./foo" };
    // @ts-ignore
    const brewPlugin = new Brew(config);
    const autoHooks = makeHooks();

    brewPlugin.apply({ hooks: autoHooks, logger: dummyLog() } as Auto);

    expect(
      await autoHooks.validateConfig.promise("git-tag", config)
    ).toBeUndefined();
  });

  test("should create the formula folder if it does not exist", async () => {
    const brewPlugin = new Brew({ name: "foo", executable: "./foo" });
    const autoHooks = makeHooks();

    brewPlugin.apply(({
      hooks: autoHooks,
      logger: dummyLog(),
      git: { getLatestTagInBranch: () => "v1.0.0" },
    } as unknown) as Auto);

    existsSync.mockReturnValueOnce(false);
    readFileSync.mockReturnValueOnce("");
    exec.mockReturnValueOnce("1234 1234");

    await autoHooks.afterVersion.promise({});

    expect(mkdirSync).toHaveBeenCalled();
  });

  test("should not create the formula folder if it does exist", async () => {
    const brewPlugin = new Brew({ name: "foo", executable: "./foo" });
    const autoHooks = makeHooks();

    brewPlugin.apply(({
      hooks: autoHooks,
      logger: dummyLog(),
      git: { getLatestTagInBranch: () => "v1.0.0" },
    } as unknown) as Auto);

    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValueOnce("");
    exec.mockReturnValueOnce("1234 1234");

    await autoHooks.afterVersion.promise({});

    expect(mkdirSync).not.toHaveBeenCalled();
  });

  test("should create formula", async () => {
    const brewPlugin = new Brew({ name: "foo", executable: "./foo" });
    const autoHooks = makeHooks();

    brewPlugin.apply(({
      hooks: autoHooks,
      logger: dummyLog(),
      git: { getLatestTagInBranch: () => "v1.0.0" },
    } as unknown) as Auto);

    readFileSync.mockReturnValueOnce("$VERSION $SHA");
    exec.mockReturnValueOnce("1234 1234");

    await autoHooks.afterVersion.promise({});

    expect(writeFileSync).toHaveBeenCalledWith(
      "./Formula/foo.rb",
      "v1.0.0 1234"
    );
  });

  test("should create multiple formulae", async () => {
    const brewPlugin = new Brew([
      { name: "foo", executable: "./foo" },
      { name: "bar", executable: "./bar" },
    ]);
    const autoHooks = makeHooks();

    brewPlugin.apply(({
      hooks: autoHooks,
      logger: dummyLog(),
      git: { getLatestTagInBranch: () => "v1.0.0" },
    } as unknown) as Auto);

    readFileSync.mockReturnValue("$VERSION $SHA");
    exec.mockReturnValue("1234 1234");

    await autoHooks.afterVersion.promise({});

    expect(writeFileSync).toHaveBeenCalledWith(
      "./Formula/foo.rb",
      "v1.0.0 1234"
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      "./Formula/bar.rb",
      "v1.0.0 1234"
    );
  });
});
