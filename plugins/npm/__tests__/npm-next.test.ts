import endent from "endent";
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
execPromise.mockResolvedValue("");

let readResult = "{}";
readFileSync.mockReturnValue("{}");

jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => execPromise(...args)
);
jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "next",
}));
jest.mock(
  "../../../packages/core/dist/utils/get-lerna-packages",
  () => (...args: any[]) => getLernaPackages(...args)
);
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
      baseBranch: "main",
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
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
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

  test("works for dry run in single package", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
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
      await hooks.next.promise([], {
        bump: Auto.SEMVER.patch,
        dryRun: true,
      } as any)
    ).toStrictEqual(["1.2.4-next.0"]);
    expect(execPromise).not.toHaveBeenCalledWith("npm");
  });

  test("skips publish for private package", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
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
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
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
      baseBranch: "main",
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
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
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
      "--_auth=abcd",
    ]);
  });

  test("works in monorepo", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "1.2.3" }');
    execPromise.mockResolvedValueOnce("");
    execPromise.mockResolvedValueOnce("1.2.4-next.0");

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["lerna", "publish", "1.2.4-next.0"])
    );
    expect(execPromise).toHaveBeenCalledWith("git", [
      "reset",
      "--hard",
      "HEAD~1",
    ]);
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
  });

  test("optionally commits version", async () => {
    const plugin = new NPMPlugin({ commitNextVersion: true });
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "1.2.3" }');
    execPromise.mockResolvedValueOnce("");
    execPromise.mockResolvedValueOnce("1.2.4-next.0");

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["lerna", "publish", "1.2.4-next.0"])
    );
    expect(execPromise).not.toHaveBeenCalledWith("git", [
      "reset",
      "--hard",
      "HEAD~1",
    ]);
  });

  test("works in dry run in monorepo", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "1.2.3" }');
    execPromise.mockResolvedValueOnce("");
    execPromise.mockResolvedValueOnce("1.2.4-next.0");

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], {
        bump: Auto.SEMVER.patch,
        dryRun: true,
      } as any)
    ).toStrictEqual(["1.2.4-next.0"]);

    expect(execPromise).not.toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["lerna", "publish", "1.2.4-next.0"])
    );
    expect(execPromise).not.toHaveBeenCalledWith("git", [
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
    execPromise.mockResolvedValueOnce("");
    execPromise.mockResolvedValueOnce("1.2.4-next.0");

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      prefixRelease: (v: string) => v,
      git: {
        getLatestRelease: () => "1.0.0",
        getLastTagNotInBaseBranch: () => "1.2.3",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
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
    getLernaPackages.mockResolvedValueOnce([
      {
        name: "@foo/foo",
        path: "/path/to/1",
        version: "0.45.0",
      },
      {
        name: "@foo/foo-bar",
        path: "/path/to/2",
        version: "0.50.0",
      },
    ]);
    execPromise.mockImplementation((command, args) => {
      if (command === "git" && args[0] === "tag") {
        return Promise.resolve(
          "@foo/foo@1.0.0-next.0\n@foo/foo-bar@2.0.0-next.0"
        );
      }

      if (command === "yarn" && args[0] === "lerna" && args[1] === "changed") {
        return Promise.resolve("@foo/foo\n@foo/foo-bar");
      }

      return Promise.resolve("");
    });

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (v: string) => `v${v}`,
      git: {
        getLatestRelease: () => "@foo/foo@0.1.0",
        getLastTagNotInBaseBranch: () => "@foo/foo@1.0.0-next.0",
      },
    } as unknown) as Auto.Auto);

    readResult = `
      {
        "name": "@foo/foo",
        "version": "1.0.0-next.0",
        "dependencies": {
          "@foo/foo-bar": "0.50.0"
        }
      }
    `;

    expect(
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
    ).toStrictEqual(["@foo/foo@1.0.0-next.0", "@foo/foo-bar@2.0.0-next.0"]);

    expect(execPromise).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["lerna", "publish", "from-git"])
    );
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
    expect(writeSpy).toHaveBeenCalledWith(
      "/path/to/1/package.json",
      endent`{
        "name": "@foo/foo",
        "version": "1.0.0-next.1",
        "dependencies": {
          "@foo/foo-bar": "2.0.0-next.1"
        }
      }`
    );
  });

  test("works in dry run in monorepo - independent", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "independent" }');
    getLernaPackages.mockResolvedValueOnce([
      {
        name: "@foo/foo",
        path: "/path/to/1",
      },
      {
        name: "@foo/foo-bar",
        path: "/path/to/2",
      },
    ]);
    execPromise.mockImplementation((command, args) => {
      if (command === "git" && args[0] === "tag") {
        return Promise.resolve(
          "@foo/foo@1.0.0-next.0\n@foo/foo-bar@2.0.0-next.0"
        );
      }

      if (command === "yarn" && args[0] === "lerna" && args[1] === "changed") {
        return Promise.resolve("@foo/foo\n@foo/foo-bar");
      }

      return Promise.resolve("");
    });

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (v: string) => `v${v}`,
      git: {
        getLatestRelease: () => "@foo/foo@0.1.0",
        getLastTagNotInBaseBranch: () => "@foo/foo@1.0.0-next.0",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], {
        bump: Auto.SEMVER.patch,
        dryRun: true,
      } as any)
    ).toStrictEqual(["@foo/foo@1.0.0-next.1", "@foo/foo-bar@2.0.0-next.1"]);

    expect(execPromise).not.toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["lerna", "publish", "from-git"])
    );
    expect(execPromise).not.toHaveBeenCalledWith("git", [
      "push",
      "origin",
      "next",
      "--tags",
    ]);
  });

  test("works in monorepo - independent - private package", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "independent" }');
    getLernaPackages.mockResolvedValueOnce([
      {
        name: "@foo/foo",
        path: "/path/to/1",
      },
    ]);
    execPromise.mockImplementation((command, args) => {
      if (command === "git" && args[0] === "tag") {
        return Promise.resolve("@foo/foo@1.0.0-next.0");
      }

      if (command === "yarn" && args[0] === "lerna" && args[1] === "changed") {
        return Promise.resolve("@foo/foo (PRIVATE)");
      }

      return Promise.resolve("");
    });

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (v: string) => `v${v}`,
      git: {
        getLatestRelease: () => "@foo/foo@0.1.0",
        getLastTagNotInBaseBranch: () => "@foo/foo@1.0.0-next.0",
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any)
    ).toStrictEqual(["@foo/foo@1.0.0-next.0"]);
  });
});
