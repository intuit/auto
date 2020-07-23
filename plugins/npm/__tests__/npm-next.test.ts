import { execSync } from "child_process";

import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import NPMPlugin from "../src";

const exec = jest.fn();
const execPromise = jest.fn();
const getLernaPackages = jest.fn();
const monorepoPackages = jest.fn();
const existsSync = jest.fn();
const readFileSync = jest.fn();
const writeSpy = jest.fn();

jest.mock("child_process");
// @ts-ignore
execSync.mockImplementation(exec);
exec.mockReturnValue("");

let readResult = "{}";
readFileSync.mockReturnValue("{}");

jest.mock("../../../packages/core/dist/utils/exec-promise", () => ({
  // @ts-ignore
  default: (...args) => execPromise(...args),
}));
jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "next",
}));
jest.mock("../../../packages/core/dist/utils/get-lerna-packages", () => ({
  // @ts-ignore
  default: (...args) => getLernaPackages(...args),
}));
jest.mock("env-ci", () => () => ({ isCi: false }));
jest.mock("get-monorepo-packages", () => () => monorepoPackages());
jest.mock("fs", () => ({
  // @ts-ignore
  existsSync: (...args) => existsSync(...args),
  // @ts-ignore
  readFile: (a, b, cb) => {
    cb(undefined, readResult);
  },
  // @ts-ignore
  readFileSync: (...args) => readFileSync(...args),
  ReadStream: function () {},
  WriteStream: function () {},
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: (file, data, cb) => {
    cb(undefined, writeSpy(file, data));
  },
}));

describe("next", () => {
  beforeEach(() => {
    execPromise.mockClear();
  });

  test("works in single package", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "master",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    readResult = `
      {
        "name": "test",
        "version": "1.2.4-next.0"
      }
    `;

    expect(
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).toHaveBeenCalledWith("npm", [
      "version",
      "1.2.4-next.0",
      "--no-git-tag-version",
    ]);
    expect(execPromise).toHaveBeenCalledWith("git", [
      "tag",
      "1.2.4-next.0",
      "-m",
      '"Update version to 1.2.4-next.0"',
    ]);
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "publish",
      "--tag",
      "next",
    ]);
  });

  test("skips publish for private package", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "master",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    readResult = `
      {
        "name": "test",
        "version": "1.2.4-next.0",
        "private": true
      }
    `;

    expect(
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
    expect(execPromise).not.toHaveBeenCalledWith("npm", [
      "publish",
      "--tag",
      "next",
    ]);
  });

  test("works with legacy auth", async () => {
    process.env.NPM_TOKEN = "abcd";
    const plugin = new NPMPlugin({ legacyAuth: true });
    const hooks = makeHooks();

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "master",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    readResult = `
      {
        "name": "test",
        "version": "1.2.4-next.0"
      }
    `;

    expect(
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).toHaveBeenCalledWith("npm", [
      "version",
      "1.2.4-next.0",
      "--no-git-tag-version",
    ]);
    expect(execPromise).toHaveBeenCalledWith("git", [
      "tag",
      "1.2.4-next.0",
      "-m",
      '"Update version to 1.2.4-next.0"',
    ]);
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "publish",
      "--tag",
      "next",
      "--_auth",
      "abcd",
    ]);
  });

  test("works in monorepo", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "1.2.3" }');
    execPromise.mockReturnValueOnce("");
    execPromise.mockReturnValueOnce("1.2.4-next.0");

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "master",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["lerna", "publish", "1.2.4-next.0"])
    );
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
  });

  test("legacy auth works in monorepo", async () => {
    process.env.NPM_TOKEN = "abcd";
    const plugin = new NPMPlugin({ legacyAuth: true });
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "1.2.3" }');
    execPromise.mockReturnValueOnce("");
    execPromise.mockReturnValueOnce("1.2.4-next.0");

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "master",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining([
        "lerna",
        "publish",
        "1.2.4-next.0",
        "--legacy-auth",
        "abcd",
      ])
    );
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
  });

  test("works in monorepo - independent", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "independent" }');
    execPromise.mockReturnValueOnce("");
    execPromise.mockReturnValueOnce("@foo/1@1.0.0-next.0\n@foo/2@2.0.0-next.0");

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "master",
      logger: dummyLog(),
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "@foo/1@0.1.0",
        getLastTagNotInBaseBranch: () => "@foo/1@1.0.0-next.0",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any)
    ).toStrictEqual(["@foo/1@1.0.0-next.0", "@foo/2@2.0.0-next.0"]);

    expect(execPromise).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["lerna", "publish", "prerelease"])
    );
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
  });
});
