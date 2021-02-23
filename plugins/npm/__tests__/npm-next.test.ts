import mockFs from "mock-fs";
import { execSync } from "child_process";
import fs from "fs";

import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import NPMPlugin from "../src";

const exec = jest.fn();
const execPromise = jest.fn();
const getLernaPackages = jest.fn();
const monorepoPackages = jest.fn();

jest.mock("child_process");
// @ts-ignore
execSync.mockImplementation(exec);
exec.mockReturnValue("");
execPromise.mockResolvedValue("");

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
jest.mock("registry-url", () => () => "https://registry.npm.org");

afterEach(() => {
  mockFs.restore();
});

describe("next", () => {
  beforeEach(() => {
    execPromise.mockClear();
  });

  test("works in single package", async () => {
    mockFs({
      "package.json": `
      {
        "name": "test",
        "version": "1.2.4-next.0"
      }
      `,
    });
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
    mockFs({
      "package.json": `
      {
        "name": "test",
        "version": "1.2.4-next.0"
      }
      `,
    });
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

    expect(
      await hooks.next.promise([], {
        bump: Auto.SEMVER.patch,
        dryRun: true,
      } as any)
    ).toStrictEqual(["1.2.4-next.0"]);
    expect(execPromise).not.toHaveBeenCalledWith("npm");
  });

  test("skips publish for private package", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "version": "1.2.4-next.0",
          "private": true
        }
      `,
    });
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
    mockFs({
      "package.json": `
      {
        "name": "test",
        "version": "1.2.4-next.0"
      }
      `,
    });
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
    mockFs({
      "package.json": `
      {
        "name": "test",
        "version": "1.2.3"
      }
      `,
      "lerna.json": `
        {
          "version": "1.2.3"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    monorepoPackages.mockReturnValueOnce([
      {
        path: "packages/a",
        name: "@packages/a",
        package: { version: "1.2.3" },
      },
      {
        path: "packages/b",
        name: "@packages/b",
        package: { version: "1.2.4-next.0" },
      },
    ]);
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
    mockFs({
      "package.json": `
      {
        "name": "test",
        "version": "1.2.3"
      }
      `,
      "lerna.json": `
        {
          "version": "1.2.3"
        }
      `,
    });
    const plugin = new NPMPlugin({ commitNextVersion: true });
    const hooks = makeHooks();

    monorepoPackages.mockReturnValueOnce([
      {
        path: "packages/a",
        name: "@packages/a",
        package: { version: "1.2.3" },
      },
      {
        path: "packages/b",
        name: "@packages/b",
        package: { version: "1.2.4-next.0" },
      },
    ]);
    // isMonorepo
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
    mockFs({
      "package.json": `
      {
        "name": "test",
        "version": "1.2.3"
      }
      `,
      "lerna.json": `
        {
          "version": "1.2.3"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
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
    // existsSync.mockReturnValueOnce(true);
    // readFileSync.mockReturnValue('{ "version": "1.2.3" }');
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
    mockFs({
      "package.json": `
      {
        "name": "@foo/foo",
        "dependencies": {
          "@foo/foo-bar": "0.50.0"
        }
      }
      `,
      "lerna.json": `
        {
          "version": "independent"
        }
      `,
      "packages/foo/package.json": `
        {
          "name": "@foo/foo",
          "version": "1.0.0-next.0",
          "dependencies": {
            "@foo/foo-bar": "0.50.0"
          }
        }
      `,
      "packages/foo-bar/package.json": "{}",
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    getLernaPackages.mockResolvedValueOnce([
      {
        name: "@foo/foo",
        path: "packages/foo",
        version: "0.45.0",
      },
      {
        name: "@foo/foo-bar",
        path: "packages/foo-bar",
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
    expect(
      JSON.parse(fs.readFileSync("packages/foo/package.json", "utf-8"))
    ).toStrictEqual({
      name: "@foo/foo",
      version: "1.0.0-next.1",
      dependencies: {
        "@foo/foo-bar": "2.0.0-next.1",
      },
    });
  });

  test("works in dry run in monorepo - independent", async () => {
    mockFs({
      "package.json": `
      {
        "name": "@foo/foo",
        "version": "1.0.0-next.0",
        "dependencies": {
          "@foo/foo-bar": "0.50.0"
        }
      }
      `,
      "lerna.json": `
        {
          "version": "independent"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
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
    mockFs({
      "package.json": `
      {
        "name": "@foo/foo",
        "version": "1.0.0-next.0",
        "private": true
      }
      `,
      "lerna.json": `
        {
          "version": "independent"
        }
      `,
      "packages/foo/package.json": `{}`,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    getLernaPackages.mockResolvedValueOnce([
      {
        name: "@foo/foo",
        path: "packages/foo",
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
