import Auto, { SEMVER } from '@auto-it/core';
import mockFs from "mock-fs";
import fs from "fs";
import BazelPlugin from '../src';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import { dummyLog } from "@auto-it/core/dist/utils/logger";

// Mocks
const execPromise = jest.fn();
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => execPromise(...args)
);
jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "main",
}));

beforeEach(() => {
  execPromise.mockClear();
});
afterEach(() => {
  mockFs.restore();
})

describe('Version File Read Operations', () => {
  test("It should return the value in the default file", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({});
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto);

    expect(await hooks.getPreviousVersion.promise()).toBe("1.0.0");
  });

  test("It should return the value in the specified file", async () => {
    mockFs({
      "VERSIONFILE": `1.0.0`,
    });
    const plugin = new BazelPlugin({versionFile: "VERSIONFILE"});
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto);

    expect(await hooks.getPreviousVersion.promise()).toBe("1.0.0");
  });
});

describe("Version File Write Operations", () => {
  test("It should version the file properly for major releases", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({});
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto);

    await hooks.version.promise({bump: SEMVER.major})
    expect(fs.readFileSync("VERSION", "utf-8")).toStrictEqual("2.0.0")
    // check that the proper git operations were performed
    expect(execPromise).toHaveBeenNthCalledWith(1, "git", ["commit", "-am", "\"Bump version to: v2.0.0 [skip ci]\""]);
    expect(execPromise).toHaveBeenNthCalledWith(2, "git", ["tag", "v2.0.0"]);
  });

  test("It should version the file properly for minor releases", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({});
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto);

    await hooks.version.promise({bump: SEMVER.minor})
    expect(fs.readFileSync("VERSION", "utf-8")).toStrictEqual("1.1.0");
    // check that the proper git operations were performed
    expect(execPromise).toHaveBeenNthCalledWith(1, "git", ["commit", "-am", "\"Bump version to: v1.1.0 [skip ci]\""]);
    expect(execPromise).toHaveBeenNthCalledWith(2, "git", ["tag", "v1.1.0"]);
  });

  test("It should version the file properly for patch releases", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({});
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto);

    await hooks.version.promise({bump: SEMVER.patch})
    expect(fs.readFileSync("VERSION", "utf-8")).toStrictEqual("1.0.1");
    // check that the proper git operations were performed
    expect(execPromise).toHaveBeenNthCalledWith(1, "git", ["commit", "-am", "\"Bump version to: v1.0.1 [skip ci]\""]);
    expect(execPromise).toHaveBeenNthCalledWith(2, "git", ["tag", "v1.0.1"]);
  });
})

describe("Test Release Types", () => {
  test("Full release with no release script", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({});
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto);

    await hooks.publish.promise({bump: SEMVER.major})

    // check release script was not called but check changes would be pushed
    expect(execPromise).toHaveBeenNthCalledWith(1, "git", ["push", "origin", "main", "--tags"]);
  });

  test("Full release with release script", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({publishScript:"./tools/release.sh"});
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto);

    await hooks.publish.promise({bump: SEMVER.major})

    // check release script was called
    expect(execPromise).toHaveBeenNthCalledWith(1, "./tools/release.sh", ["release"]);

    // check changes would be pushed
    expect(execPromise).toHaveBeenNthCalledWith(2, "git", ["push", "origin", "main", "--tags"]);
  });

  test("Canary release with no release script", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({});
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      getCurrentVersion: () => "1.0.0",
      git: {
        getLatestRelease: () => "1.0.0",
        getLatestTagInBranch: () => Promise.resolve("1.0.0"),
      },
    } as unknown) as Auto);

    await hooks.canary.promise({bump: SEMVER.minor, canaryIdentifier: "canary.368.1"})

    // check release script was not called and local changes were reverted
    expect(execPromise).toHaveBeenNthCalledWith(1, "git", ["reset", "--hard", "HEAD"]);

    // Check the right version was written
    expect(fs.readFileSync("VERSION", "utf-8")).toStrictEqual("1.1.0-canary.368.1")
  });

  test("Canary release with release script", async () => {
    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({publishScript:"./tools/release.sh"});
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      getCurrentVersion: () => "1.0.0",
      git: {
        getLatestRelease: () => "1.0.0",
        getLatestTagInBranch: () => Promise.resolve("1.0.0"),
      },
    } as unknown) as Auto);

    await hooks.canary.promise({bump: SEMVER.minor, canaryIdentifier: "canary.368.1"})

    // check release script was called
    expect(execPromise).toHaveBeenNthCalledWith(1, "./tools/release.sh", ["snapshot"]);

    // check local changes were reverted
    expect(execPromise).toHaveBeenNthCalledWith(2, "git", ["reset", "--hard", "HEAD"]);

    // Check the right version was written
    expect(fs.readFileSync("VERSION", "utf-8")).toStrictEqual("1.1.0-canary.368.1")
  });

  test("Next release with no release script", async () => {

    const prefixRelease: (a: string) => string = (version: string) => {
      return `v${version}`;
    };

    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({});
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      config: { prereleaseBranches: ["next"] },
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease,
      getCurrentVersion: () => "1.0.0",
      git: {
        getLastTagNotInBaseBranch: async () => undefined,
        getLatestRelease: () => "1.0.0",
        getLatestTagInBranch: () => Promise.resolve("1.0.0"),
      },
    } as unknown) as Auto);

    await hooks.next.promise(["1.0.0"], {bump: SEMVER.major, fullReleaseNotes:"", releaseNotes:"", commits:[]})

    // check release script was not called but git ops were performed
    expect(execPromise).toHaveBeenNthCalledWith(1, "git", ["tag", "v2.0.0-next.0"]);
    expect(execPromise).toHaveBeenNthCalledWith(2, "git", ["push", "origin", "main", "--tags"]);

    // Check the right version was written
    expect(fs.readFileSync("VERSION", "utf-8")).toStrictEqual("v2.0.0-next.0")
  });

  test("Next release with release script", async () => {

    const prefixRelease: (a: string) => string = (version: string) => {
      return `v${version}`;
    };

    mockFs({
      "VERSION": `1.0.0`,
    });
    const plugin = new BazelPlugin({publishScript:"./tools/release.sh"});
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      config: { prereleaseBranches: ["next"] },
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease,
      getCurrentVersion: () => "1.0.0",
      git: {
        getLastTagNotInBaseBranch: async () => undefined,
        getLatestRelease: () => "1.0.0",
        getLatestTagInBranch: () => Promise.resolve("1.0.0"),
      },
    } as unknown) as Auto);

    await hooks.next.promise(["1.0.0"], {bump: SEMVER.major, fullReleaseNotes:"", releaseNotes:"", commits:[]})

    // check release script was called
    expect(execPromise).toHaveBeenNthCalledWith(1, "./tools/release.sh", ["snapshot"]);

    // Check git ops
    expect(execPromise).toHaveBeenNthCalledWith(2, "git", ["tag", "v2.0.0-next.0"]);
    expect(execPromise).toHaveBeenNthCalledWith(3, "git", ["push", "origin", "main", "--tags"]);

    // Check the right version was written
    expect(fs.readFileSync("VERSION", "utf-8")).toStrictEqual("v2.0.0-next.0")
  });

  test("Release type args can be provided to override default args for publish script", async () => {
    const prefixRelease: (a: string) => string = (version: string) => {
      return `v${version}`;
    };

    mockFs({
      VERSION: `1.0.0`,
    });
     const plugin = new BazelPlugin({
       publishScript: "./tools/release.sh",
       publishScriptReleaseTypeArgs: {
         publish: ["args", "for", "publish"],
         canary: ["different", "canary"],
         next: ["next"],
       },
     });
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      config: { prereleaseBranches: ["next"] },
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease,
      getCurrentVersion: () => "1.0.0",
      git: {
        getLastTagNotInBaseBranch: async () => undefined,
        getLatestRelease: () => "1.0.0",
        getLatestTagInBranch: () => Promise.resolve("1.0.0"),
      },
    } as unknown) as Auto);

    
    await hooks.publish.promise({ bump: SEMVER.major });

    expect(execPromise).toHaveBeenNthCalledWith(1, "./tools/release.sh", [
      "args", "for", "publish"
    ]);

    await hooks.canary.promise({
      bump: SEMVER.minor,
      canaryIdentifier: "canary.368.1",
    });

    expect(execPromise).toHaveBeenNthCalledWith(3, "./tools/release.sh", [
      "different",
      "canary",
    ]);

    await hooks.next.promise(["1.0.0"], {
      bump: SEMVER.major,
      fullReleaseNotes: "",
      releaseNotes: "",
      commits: [],
    });

    expect(execPromise).toHaveBeenNthCalledWith(5, "./tools/release.sh", [
      "next",
    ]);
  })
});
