import { execSync } from "child_process";
import mockFs from "mock-fs";

import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import NPMPlugin, {
  getChangedPackages,
  getMonorepoPackage,
  greaterRelease,
  INpmConfig,
} from "../src";
import { IExtendedCommit } from "@auto-it/core/dist/log-parse";

const exec = jest.fn();
const execPromise = jest.fn();
const getLernaPackages = jest.fn();
const monorepoPackages = jest.fn();

jest.mock("child_process");
// @ts-ignore
execSync.mockImplementation(exec);
exec.mockReturnValue("");

jest.mock("../src/set-npm-token.ts");
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => execPromise(...args)
);
jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "main",
}));
jest.mock(
  "../../../packages/core/dist/utils/get-lerna-packages",
  () => (...args: any[]) => getLernaPackages(...args)
);
jest.mock("env-ci", () => () => ({ isCi: false }));
jest.mock("get-monorepo-packages", () => () => monorepoPackages());

const monorepoPackagesResult = [
  { path: "packages/a", name: "@packages/a", package: { version: "0.1.1" } },
  { path: "packages/b", name: "@packages/b", package: {} },
  { path: "packages/c", name: "@packages/c", package: { version: "0.1.2" } },
  { path: "packages/d", name: "@packages/d", package: { version: "0.1.1" } },
];

const monorepoPackagesWithPrereleaseResult = [
  { path: "packages/a", name: "@packages/a", package: { version: "0.1.1" } },
  { path: "packages/b", name: "@packages/b", package: {} },
  { path: "packages/c", name: "@packages/c", package: { version: "0.1.2" } },
  { path: "packages/d", name: "@packages/d", package: { version: "0.1.1" } },
  // This can happen if a new module is published with a breaking version
  { path: "packages/e", name: "@packages/e", package: { version: "1.0.0-next.0" } },
  { path: "packages/f", name: "@packages/f", package: { version: "1.0.0-next.0" } },
];

const packageTemplate = ({
  path,
  name,
  package: pkg,
}: {
  path: string;
  name: string;
  package: Record<string, unknown>;
}) => ({
  [path]: {
    "package.json": JSON.stringify({ name, ...pkg }),
  },
});

const monorepoPackagesOnFs = monorepoPackagesResult
  .map((pkg) => packageTemplate(pkg))
  .reduce((acc, curr) => ({ ...acc, ...curr }));

afterEach(() => {
  mockFs.restore();
});

describe("getChangedPackages", () => {
  test("should return nothing without a package directory", async () => {
    exec.mockReturnValueOnce(`packages/README.md\npackage.json`);

    expect(
      await getChangedPackages({
        sha: "sha",
        packages: [],
        addVersion: false,
        logger: dummyLog(),
      })
    ).toStrictEqual([]);
  });

  test("should match files in package directory", async () => {
    exec.mockReturnValueOnce(
      `packages/foo/README.md\npackages/bar/package.json`
    );

    expect(
      await getChangedPackages({
        sha: "sha",
        packages: [
          {
            name: "foo",
            path: "packages/foo",
            version: "1.0.0",
          },
          {
            name: "bar",
            path: "packages/bar",
            version: "1.0.0",
          },
        ],
        addVersion: false,
        logger: dummyLog(),
      })
    ).toStrictEqual(["foo", "bar"]);
  });

  test("should match files in package directory with @scope/ names", async () => {
    exec.mockReturnValueOnce(
      `packages/@scope/foo/README.md\npackages/@scope/bar/package.json`
    );

    expect(
      await getChangedPackages({
        sha: "sha",
        packages: [
          {
            name: "@scope/foo",
            path: "packages/@scope/foo",
            version: "1.0.0",
          },
          {
            name: "@scope/bar",
            path: "packages/@scope/bar",
            version: "1.0.0",
          },
        ],
        addVersion: false,
        logger: dummyLog(),
      })
    ).toStrictEqual(["@scope/foo", "@scope/bar"]);
  });
});

describe("getMonorepoPackage", () => {
  test("should default to 0.0.0", () => {
    monorepoPackages.mockReturnValueOnce([]);
    expect(getMonorepoPackage()).toStrictEqual({});
  });

  test("should find greatest package version", () => {
    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    expect(getMonorepoPackage()).toStrictEqual({ version: "0.1.2" });
  });

  test("should ignore versions from preleases", () => {
    monorepoPackages.mockReturnValueOnce(monorepoPackagesWithPrereleaseResult);
    expect(getMonorepoPackage()).toStrictEqual({ version: "0.1.2" });
  });
});

const prefixRelease = (str: string) => str;

describe("greaterRelease", () => {
  test("should default to packageVersion if not published", async () => {
    execPromise.mockImplementationOnce(() => {
      throw new Error("could not find name");
    });
    expect(
      await greaterRelease(prefixRelease, "test-package-name", "1.0.0")
    ).toBe("1.0.0");
  });
  test("should default to packageVersion if greatest", async () => {
    execPromise.mockReturnValueOnce("0.5.0");
    expect(
      await greaterRelease(prefixRelease, "test-package-name", "1.0.0")
    ).toBe("1.0.0");
  });
  test("should default to publishedVersion if greatest", async () => {
    execPromise.mockReturnValueOnce("1.0.1");
    expect(
      await greaterRelease(prefixRelease, "test-package-name", "1.0.0")
    ).toBe("1.0.1");
  });
  test("should default to packageVersion if (publishedVersion is greater, but is a pre-release)", async () => {
    execPromise.mockReturnValueOnce("1.0.1-next.0");
    expect(
      await greaterRelease(prefixRelease, "test-package-name", "1.0.0")
    ).toBe("1.0.0");
  });
});

describe("getAuthor", () => {
  test("should do nothing if no author", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    expect(await hooks.getAuthor.promise()).toBeUndefined();
  });

  test("should get author object from package.json", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "author": {
            "name": "Adam",
            "email": "adam@email.com"
          }
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    expect(await hooks.getAuthor.promise()).toStrictEqual({
      name: "Adam",
      email: "adam@email.com",
    });
  });

  test("should get parse author as string from package.json", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "author": "Adam<adam@email.com>"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    expect(await hooks.getAuthor.promise()).toStrictEqual({
      name: "Adam",
      email: "adam@email.com",
    });
  });
});

describe("getRepository", () => {
  test("should get package config", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "repository": "black-panther/operation-foo",
          "author": {
            "name": "Adam",
            "email": "adam@email.com"
          }
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    expect(await hooks.getRepository.promise()).toStrictEqual({
      owner: "black-panther",
      repo: "operation-foo",
    });
  });
});

describe("getPreviousVersion", () => {
  test("should get use 0 if not version in package.json", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (str) => str,
    } as Auto.Auto);

    expect(await hooks.getPreviousVersion.promise()).toBe("0.0.0");
  });

  test("should get version from the package.json", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "version": "1.0.0"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (str) => str,
    } as Auto.Auto);

    expect(await hooks.getPreviousVersion.promise()).toBe("1.0.0");
  });

  test("should get version from the lerna.json", async () => {
    mockFs({
      "lerna.json": `
        {
          "name": "test",
          "version": "2.0.0"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    monorepoPackages.mockReturnValueOnce([]);
    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (str) => str,
    } as Auto.Auto);

    expect(await hooks.getPreviousVersion.promise()).toBe("2.0.0");
  });

  test("should get version greatest published monorepo package", async () => {
    mockFs({
      "lerna.json": `
        {
          "name": "test",
          "version": "0.0.1"
        }
      `,
      ...monorepoPackagesOnFs,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    // published version of test package
    execPromise.mockReturnValueOnce("0.1.2");

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (str) => str,
    } as Auto.Auto);

    expect(await hooks.getPreviousVersion.promise()).toBe("0.1.2");
  });

  test("should ignore greatest published monorepo package in maintenance mode", async () => {
    execPromise.mockClear()
    mockFs({
      "lerna.json": `
        {
          "name": "test",
          "version": "1.5.0"
        }
      `,
      ...monorepoPackagesOnFs,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    // published version of test package
    execPromise.mockReturnValueOnce("2.1.0");

    jest.spyOn(Auto, 'getCurrentBranch').mockReturnValueOnce('major-2')


    plugin.apply({
      config: { prereleaseBranches: ["next"], versionBranches: 'major-' },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (str) => str,
    } as Auto.Auto);


    expect(await hooks.getPreviousVersion.promise()).toBe("1.5.0");
    expect(execPromise).not.toHaveBeenCalled()
  });
});

test("should use string semver if no published package", async () => {
  const plugin = new NPMPlugin({ setRcToken: false });

  expect(plugin).toStrictEqual(
    expect.objectContaining({
      forcePublish: true,
      name: "npm",
      setRcToken: false,
    })
  );
});

describe("modifyConfig", () => {
  beforeEach(() => {
    execPromise.mockClear();
  });

  test("should not modify config in single package", async () => {
    const plugin = new NPMPlugin({ setRcToken: false });
    const hooks = makeHooks();
    const logger = dummyLog();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger,
    } as Auto.Auto);

    expect(await hooks.modifyConfig.promise({} as any)).toStrictEqual({});
  });

  test("should not modify config when tagVersionPrefix is not set", async () => {
    const plugin = new NPMPlugin({ setRcToken: false });
    const hooks = makeHooks();
    const logger = dummyLog();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger,
    } as Auto.Auto);

    expect(await hooks.modifyConfig.promise({} as any)).toStrictEqual({});
  });

  test("should modify config when tagVersionPrefix is set", async () => {
    mockFs({
      "lerna.json": `
        {
          "name": "test",
          "tagVersionPrefix": ""
        }
      `,
    });
    const plugin = new NPMPlugin({ setRcToken: false });
    const hooks = makeHooks();
    const logger = dummyLog();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger,
    } as Auto.Auto);

    expect(await hooks.modifyConfig.promise({} as any)).toStrictEqual({
      noVersionPrefix: true,
    });
  });
});

describe("publish", () => {
  beforeEach(() => {
    execPromise.mockClear();
  });

  test("should use silly logging in verbose mode", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
        }
      `,
      // ...monorepoPackagesOnFs,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();
    const logger = dummyLog();
    logger.logLevel = "veryVerbose";

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger,
    } as Auto.Auto);

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "version",
      Auto.SEMVER.patch,
      "--no-commit-hooks",
      "-m",
      "'Bump version to: %s [skip ci]'",
      "--loglevel",
      "silly",
    ]);
  });

  test("should use string semver if no published package", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "version",
      Auto.SEMVER.patch,
      "--no-commit-hooks",
      "-m",
      "'Bump version to: %s [skip ci]'",
    ]);
  });

  test("monorepo - should use start version at 0 if no published package", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    monorepoPackages.mockReturnValueOnce([]);

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "version",
      "patch",
      "--force-publish",
      "--no-commit-hooks",
      "--yes",
      "--no-push",
      "-m",
      "'\"Bump version to: %s [skip ci]\"'",
      false,
    ]);
  });

  test("monorepo - should be able to not force publish all packages", async () => {
    const plugin = new NPMPlugin({ forcePublish: false });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    monorepoPackages.mockReturnValueOnce([]);

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "version",
      "patch",
      false,
      "--no-commit-hooks",
      "--yes",
      "--no-push",
      "-m",
      "'\"Bump version to: %s [skip ci]\"'",
      false,
    ]);
  });

  test("monorepo - should be able to publish exact packages", async () => {
    const plugin = new NPMPlugin({ exact: true });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    monorepoPackages.mockReturnValueOnce([]);

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "version",
      "patch",
      "--force-publish",
      "--no-commit-hooks",
      "--yes",
      "--no-push",
      "-m",
      "'\"Bump version to: %s [skip ci]\"'",
      "--exact",
    ]);

    execPromise.mockClear();

    await hooks.publish.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "publish",
      "--yes",
      "from-package",
      "--exact",
      "--no-verify-access"
    ]);
  });

  test("monorepo - should publish", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    await hooks.publish.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "publish",
      "--yes",
      "from-package",
      false,
      "--no-verify-access"
    ]);
  });

  test("monorepo - should use legacy", async () => {
    process.env.NPM_TOKEN = "abcd";
    const plugin = new NPMPlugin({ legacyAuth: true });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    await hooks.publish.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "publish",
      "--yes",
      "from-package",
      false,
      "--legacy-auth",
      "abcd",
      "--no-verify-access"
    ]);
  });

  test("monorepo - should use publishFolder", async () => {
    const plugin = new NPMPlugin({ publishFolder: "dist/publish-folder" });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    await hooks.publish.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "publish",
      "--yes",
      "from-package",
      false,
      "--contents",
      "dist/publish-folder",
      "--no-verify-access"
    ]);
  });

  test("should use legacy", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "version": "0.0.0"
        }
      `,
    });
    process.env.NPM_TOKEN = "abcd";
    const plugin = new NPMPlugin({ legacyAuth: true });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    execPromise.mockReturnValueOnce("1.0.0");

    await hooks.publish.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "publish",
      "--_auth=abcd",
    ]);
  });

  test("should use publishFolder", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "version": "0.0.0"
        }
      `,
    });
    const plugin = new NPMPlugin({ publishFolder: "dist/publish-folder" });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    execPromise.mockReturnValueOnce("1.0.0");

    await hooks.publish.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "publish",
      "dist/publish-folder",
    ]);
  });

  test("should bump published version", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
          "version": "0.0.0"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    execPromise.mockReturnValueOnce("1.0.0");

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "version",
      "1.0.1",
      "--no-commit-hooks",
      "-m",
      "'Bump version to: %s [skip ci]'",
    ]);
  });

  test("monorepo - should bump published version", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    execPromise.mockReturnValueOnce("1.0.0");

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenNthCalledWith(2, "npx", [
      "lerna",
      "version",
      "1.0.1",
      "--force-publish",
      "--no-commit-hooks",
      "--yes",
      "--no-push",
      "-m",
      "'\"Bump version to: %s [skip ci]\"'",
      false,
    ]);
  });

  test("monorepo - should use commit message from lerna.json", async () => {
    mockFs({
      "lerna.json": `
        {
          "command": {
            "version": {
              "message": "[skip ci] Custom version commit message"
            }
          }
        }
      `,
      ...monorepoPackagesOnFs,
    });

    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    execPromise.mockReturnValueOnce("1.0.0");

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenNthCalledWith(2, "npx", [
      "lerna",
      "version",
      "1.0.1",
      "--force-publish",
      "--no-commit-hooks",
      "--yes",
      "--no-push",
      "-m",
      "'\"[skip ci] Custom version commit message\"'",
      false,
    ]);
  });

  test("monorepo - should ensure commit message from lerna.json contains [skip ci]", async () => {
    mockFs({
      "lerna.json": `
        {
          "command": {
            "version": {
              "message": "Custom version commit message"
            }
          }
        }
      `,
      ...monorepoPackagesOnFs,
    });

    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    execPromise.mockReturnValueOnce("1.0.0");

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenNthCalledWith(2, "npx", [
      "lerna",
      "version",
      "1.0.1",
      "--force-publish",
      "--no-commit-hooks",
      "--yes",
      "--no-push",
      "-m",
      "'\"Custom version commit message [skip ci]\"'",
      false,
    ]);
  });

  test("should publish private scoped packages to private", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    await hooks.publish.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).not.toHaveBeenCalledWith("npm", ["publish"]);
    expect(execPromise).toHaveBeenCalledWith("git", [
      "push",
      "--follow-tags",
      "--set-upstream",
      "origin",
      "main",
    ]);
  });
});

describe("canary", () => {
  beforeEach(() => {
    execPromise.mockClear();
  });

  test("use npm for normal package", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
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
      git: {
        getLatestRelease: () => "1.2.3",
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as unknown) as Auto.Auto);

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "canary.123.1",
    });
    expect(execPromise.mock.calls[1]).toContain("npm");
    expect(execPromise.mock.calls[2][1]).toContain("1.2.4-canary.123.1.0");
  });

  test("prints canary version in dry run", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
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
      git: {
        getLatestRelease: () => "1.2.3",
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as unknown) as Auto.Auto);

    const log = jest.fn();
    jest.spyOn(console, "log").mockImplementation(log);

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "canary.123.1",
      dryRun: true,
      quiet: true,
    });
    expect(log).toHaveBeenCalledWith("1.2.4-canary.123.1.0");
  });

  test("doesn't publish private packages", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test",
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
      git: {
        getLatestRelease: () => "1.2.3",
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as unknown) as Auto.Auto);

    expect(
      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "canary.123.1",
      })
    ).toStrictEqual({
      error: "Package private, cannot make canary release to npm.",
    });
  });

  test("finds available canary version", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
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
      git: {
        getLatestRelease: () => "1.2.3",
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as unknown) as Auto.Auto);

    // first version exists
    execPromise.mockReturnValueOnce(true);
    execPromise.mockReturnValueOnce(true);
    // second doesn't
    execPromise.mockReturnValueOnce(false);

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "canary.123.1",
    });
    expect(execPromise.mock.calls[3]).toContain("npm");
    expect(execPromise.mock.calls[3][1]).toContain("1.2.4-canary.123.1.1");
  });

  test("legacy auth work", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
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
      git: {
        getLatestRelease: () => "1.2.3",
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as unknown) as Auto.Auto);

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "canary.123.1",
    });
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "publish",
      "--tag",
      "canary",
      "--_auth=abcd",
    ]);
  });

  test("should use publishFolder", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
        }
      `,
    });
    const plugin = new NPMPlugin({ publishFolder: "dist/publish-folder" });
    const hooks = makeHooks();

    plugin.apply(({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      getCurrentVersion: () => "1.2.3",
      git: {
        getLatestRelease: () => "1.2.3",
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as unknown) as Auto.Auto);

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "canary.123.1",
    });
    expect(execPromise).toHaveBeenCalledWith("npm", [
      "publish",
      "dist/publish-folder",
      "--tag",
      "canary",
    ]);
  });

  test("monorepo - should use publishFolder", async () => {
    const plugin = new NPMPlugin({ publishFolder: "dist/publish-folder" });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      git: {
        getLatestRelease: () => Promise.resolve("1.2.3"),
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as any);

    const packages = [
      {
        path: "path/to/package",
        name: "@foobar/app",
        version: "1.2.3-canary.0+abcd",
      },
      {
        path: "path/to/package",
        name: "@foobar/lib",
        version: "1.2.3-canary.0+abcd",
      },
    ];

    monorepoPackages.mockReturnValueOnce(packages.map((p) => ({ package: p })));
    getLernaPackages.mockImplementation(async () => Promise.resolve(packages));

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "",
    });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "publish",
      "1.2.4-0",
      "--dist-tag",
      "canary",
      "--contents",
      "dist/publish-folder",
      "--force-publish",
      "--yes",
      "--no-git-reset",
      "--no-git-tag-version",
      "--exact",
      "--no-verify-access"
    ]);
  });

  test("use handles repos with no tags", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
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
      git: {
        getLatestRelease: () => "1.2.3",
        getLatestTagInBranch: () => Promise.reject(new Error()),
      },
    } as unknown) as Auto.Auto);

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "canary.123.1",
    });
    expect(execPromise.mock.calls[2]).toContain("npm");
    expect(execPromise.mock.calls[2][1]).toContain("1.2.4-canary.123.1.0");
  });

  test("use lerna for monorepo package", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      git: {
        getLatestRelease: () => Promise.resolve("1.2.3"),
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as any);

    const packages = [
      {
        path: "path/to/package",
        name: "@foobar/app",
        version: "1.2.3-canary.0+abcd",
      },
      {
        path: "path/to/package",
        name: "@foobar/lib",
        version: "1.2.3-canary.0+abcd",
      },
    ];

    monorepoPackages.mockReturnValueOnce(packages.map((p) => ({ package: p })));
    getLernaPackages.mockImplementation(async () => Promise.resolve(packages));

    const value = await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "",
    });
    expect(execPromise.mock.calls[2][1]).toContain("lerna");
    // @ts-ignore
    expect(value.newVersion).toBe("1.2.3-canary.0");
  });

  test("prints version monorepo dry run", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      git: {
        getLatestRelease: () => Promise.resolve("1.2.3"),
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as any);

    const packages = [
      {
        path: "path/to/package",
        name: "@foobar/app",
        version: "1.2.3-canary.0+abcd",
      },
      {
        path: "path/to/package",
        name: "@foobar/lib",
        version: "1.2.3-canary.0+abcd",
      },
    ];

    const log = jest.fn();
    jest.spyOn(console, "log").mockImplementation(log);
    monorepoPackages.mockReturnValueOnce(packages.map((p) => ({ package: p })));
    getLernaPackages.mockImplementation(async () => Promise.resolve(packages));

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "canary.123.1",
      dryRun: true,
      quiet: true,
    });

    expect(log).toHaveBeenCalledWith("1.2.4-canary.123.1.0");
  });

  test("legacy auth works in monorepo", async () => {
    process.env.NPM_TOKEN = "abcd";
    const plugin = new NPMPlugin({ legacyAuth: true });
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      git: {
        getLatestRelease: () => Promise.resolve("1.2.3"),
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as any);

    const packages = [
      {
        path: "path/to/package",
        name: "@foobar/app",
        version: "1.2.3-canary.0+abcd",
      },
      {
        path: "path/to/package",
        name: "@foobar/lib",
        version: "1.2.3-canary.0+abcd",
      },
    ];

    monorepoPackages.mockReturnValueOnce(packages.map((p) => ({ package: p })));
    getLernaPackages.mockImplementation(async () => Promise.resolve(packages));

    await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "",
    });
    expect(execPromise).toHaveBeenCalledWith("npx", [
      "lerna",
      "publish",
      "1.2.4-0",
      "--dist-tag",
      "canary",
      "--force-publish",
      "--legacy-auth",
      "abcd",
      "--yes",
      "--no-git-reset",
      "--no-git-tag-version",
      "--exact",
      "--no-verify-access"
    ]);
  });

  test("error when no canary release found", async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      git: {
        getLatestRelease: () => Promise.resolve("1.2.3"),
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as any);

    const packages = [
      {
        path: "path/to/package",
        name: "@foobar/app",
        version: "1.2.3",
      },
      {
        path: "path/to/package",
        name: "@foobar/lib",
        version: "1.2.3",
      },
    ];

    monorepoPackages.mockReturnValueOnce(packages.map((p) => ({ package: p })));
    getLernaPackages.mockImplementation(async () => Promise.resolve(packages));

    const value = await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "",
    });
    expect(value).toStrictEqual({
      error: "No packages were changed. No canary published.",
    });
  });

  test("doesn't force publish in independent mode", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
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

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
    } as Auto.Auto);

    getLernaPackages.mockImplementation(async () =>
      Promise.resolve([
        {
          path: "path/to/package",
          name: "@foobar/app",
          version: "1.2.4-canary.0",
        },
        {
          path: "path/to/package",
          name: "@foobar/lib",
          version: "1.1.0-canary.0",
        },
      ])
    );

    await hooks.version.promise({ bump: Auto.SEMVER.patch });
    expect(execPromise).toHaveBeenNthCalledWith(1, "npx", [
      "lerna",
      "version",
      "patch",
      false,
      "--no-commit-hooks",
      "--yes",
      "--no-push",
      "-m",
      `'"Bump independent versions [skip ci]"'`,
      false,
    ]);
  });

  test("don't force publish canaries", async () => {
    mockFs({
      "package.json": `
        {
          "name": "test"
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

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      git: {
        getLatestRelease: () => Promise.resolve("@foo/lib:1.1.0"),
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as any);

    getLernaPackages.mockImplementation(async () =>
      Promise.resolve([
        {
          path: "path/to/package",
          name: "@foobar/app",
          version: "1.2.4",
        },
        {
          path: "path/to/package",
          name: "@foobar/lib",
          version: "1.1.0.canary",
        },
      ])
    );

    expect(
      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "",
      })
    ).toMatchSnapshot();
  });

  test("error when no canary release found - independent", async () => {
    mockFs({
      "lerna.json": `
        {
          "version": "independent"
        }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      git: {
        getLatestRelease: () => Promise.resolve("@foo/lib:1.1.0"),
        getLatestTagInBranch: () => Promise.resolve("1.2.3"),
      },
    } as any);

    getLernaPackages.mockImplementation(async () =>
      Promise.resolve([
        {
          path: "path/to/package",
          name: "@foobar/app",
          version: "1.2.4",
        },
        {
          path: "path/to/package",
          name: "@foobar/lib",
          version: "1.1.0",
        },
      ])
    );

    const value = await hooks.canary.promise({
      bump: Auto.SEMVER.patch,
      canaryIdentifier: "",
    });
    expect(value).toStrictEqual({
      error: "No packages were changed. No canary published.",
    });
  });
});

describe("makeRelease", () => {
  test("publish release for each package", async () => {
    mockFs({
      "lerna.json": `
       { "name": "test", "version": "independent" }
      `,
    });
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    execPromise.mockReturnValue("@packages/a\n@packages/b");
    getLernaPackages.mockReturnValueOnce(monorepoPackagesResult);

    const publish = jest.fn();
    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (str) => str,
      git: { publish } as any,
      release: {
        makeChangelog: () => ({
          generateReleaseNotes: (commits: IExtendedCommit[]) =>
            Promise.resolve(commits.map((c) => c.subject).join("\n")),
        }),
      } as any,
    } as Auto.Auto);

    await hooks.makeRelease.promise({
      newVersion: "0.1.2",
      from: "",
      isPrerelease: false,
      fullReleaseNotes: "",
      commits: [
        {
          subject: "update package 1",
          hash: "123",
          labels: [],
          files: ["packages/a/package.json"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
        {
          subject: "update package 2",
          hash: "124",
          labels: [],
          files: ["packages/b/package.json"],
          authors: [{ username: "Andrew", hash: "124" }],
        },
      ],
    });

    expect(publish).toHaveBeenCalledWith(
      "update package 1",
      "@packages/a",
      false,
      undefined,
      true
    );
    expect(publish).toHaveBeenCalledWith(
      "update package 2",
      "@packages/b",
      false,
      undefined,
      true
    );
  });
});

describe("beforeCommitChangelog", () => {
  let updateChangelogFile: jest.Mock;

  async function subPackageChangelogTest(
    options: INpmConfig = {},
    changed = "@packages/a\n@packages/b"
  ) {
    const plugin = new NPMPlugin(options);
    const hooks = makeHooks();

    // isMonorepo
    execPromise.mockResolvedValue("@packages/a\n@packages/b");
    execPromise.mockResolvedValue(changed);
    getLernaPackages.mockReturnValueOnce(monorepoPackagesResult);

    updateChangelogFile = jest.fn();
    plugin.apply({
      config: { prereleaseBranches: ["next"] },
      hooks,
      remote: "origin",
      baseBranch: "main",
      logger: dummyLog(),
      prefixRelease: (str) => str,
      release: {
        updateChangelogFile,
        makeChangelog: () => ({
          generateReleaseNotes: (commits: IExtendedCommit[]) =>
            Promise.resolve(commits.map((c) => c.subject).join("\n")),
        }),
      } as any,
    } as Auto.Auto);

    await hooks.beforeCommitChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.1",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "update package 1",
          hash: "123",
          labels: [],
          files: ["packages/a/package.json"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
        {
          subject: "update package 2",
          hash: "124",
          labels: [],
          files: ["packages/b/package.json"],
          authors: [{ username: "Andrew", hash: "124" }],
        },
      ],
    });
  }

  test("should create sub-package changelogs", async () => {
    await subPackageChangelogTest();
    expect(updateChangelogFile).toHaveBeenCalled();
  });

  test("should not create sub-package changelogs", async () => {
    await subPackageChangelogTest({ subPackageChangelogs: false });
    expect(updateChangelogFile).not.toHaveBeenCalled();
  });

  test("should not create sub-package changelogs when nothing has changed", async () => {
    await subPackageChangelogTest({}, "");
    expect(updateChangelogFile).not.toHaveBeenCalled();
  });
});
