import * as Auto from "@auto-it/core";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";

import DockerPlugin, { IDockerPluginOptions } from "../src";

const exec = jest.fn();
jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "next",
}));
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args)
);

const registry = "registry.io/app";

const setup = (
  mockGit?: any,
  options?: IDockerPluginOptions,
  checkEnv?: jest.SpyInstance,
  prereleaseBranches: string[] = ["next"],
) => {
  const plugin = new DockerPlugin(options || { registry });
  const hooks = makeHooks();

  plugin.apply(({
    checkEnv,
    hooks,
    git: mockGit,
    remote: "origin",
    logger: dummyLog(),
    prefixRelease: (r: string) => r,
    config: { prereleaseBranches },
    getCurrentVersion: () => "v1.0.0",
  } as unknown) as Auto.Auto);

  return hooks;
};

describe("Docker Plugin", () => {
  beforeEach(() => {
    exec.mockClear();
  });

  describe("validateConfig", () => {
    test("should error without options", async () => {
      const hooks = setup();
      await expect(
        hooks.validateConfig.promise("docker", null)
      ).resolves.toHaveLength(1);
    });

    test("should pass with valid options", async () => {
      const hooks = setup();
      await expect(
        hooks.validateConfig.promise("docker", { registry: registry })
      ).resolves.toHaveLength(0);
    });
  });

  describe("beforeRun", () => {
    test("should check env without image", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { registry }]],
      } as any);
      expect(checkEnv).toBeCalledWith('docker', 'IMAGE');
    });

    test("shouldn't check env with image", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { registry, image: "test" }]],
      } as any);
      expect(checkEnv).not.toBeCalledWith('docker','IMAGE');
    });

    test("should check env without registry", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { }]],
      } as any);
      expect(checkEnv).toHaveBeenCalledWith('docker','REGISTRY');
    });

    test("shouldn't check env with registry", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { registry, image: "test" }]],
      } as any);
      expect(checkEnv).not.toHaveBeenCalledWith('docker','REGISTRY');
    });

    test("should check env without tagLatest", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { }]],
      } as any);
      expect(checkEnv).toHaveBeenCalledWith('docker','TAG_LATEST');
    });

    test("shouldn't check env with tagLatest", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { tagLatest: true }]],
      } as any);
      expect(checkEnv).not.toHaveBeenCalledWith('docker','TAG_LATEST');
    });

    test("should check env without tagPrereleases", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { }]],
      } as any);
      expect(checkEnv).toHaveBeenCalledWith('docker','TAG_PRERELEASE_ALIASES');
    });

    test("shouldn't check env with tagPrereleases", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { tagPrereleaseAliases: true }]],
      } as any);
      expect(checkEnv).not.toHaveBeenCalledWith('docker','TAG_PRERELEASE_ALIASES');
    });

    test("should check env without tagPullRequests", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { }]],
      } as any);
      expect(checkEnv).toHaveBeenCalledWith('docker','TAG_PULL_REQUEST_ALIASES');
    });

    test("shouldn't check env with tagPullRequests", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { tagPullRequestAliases: true }]],
      } as any);
      expect(checkEnv).not.toHaveBeenCalledWith('docker','TAG_PULL_REQUEST_ALIASES');
    });
  });

  describe("getPreviousVersion", () => {
    test("should error without git", async () => {
      const hooks = setup();
      await expect(hooks.getPreviousVersion.promise()).rejects.toBeInstanceOf(
        Error
      );
    });

    test("should get previous version", async () => {
      const hooks = setup({ getLatestTagInBranch: () => "v1.0.0" });
      const previousVersion = await hooks.getPreviousVersion.promise();
      expect(previousVersion).toBe("v1.0.0");
    });

    test("should default to 0.0.0 when no previous version", async () => {
      const hooks = setup({
        getLatestTagInBranch: () => {
          throw new Error();
        },
      });
      const previousVersion = await hooks.getPreviousVersion.promise();
      expect(previousVersion).toBe("0.0.0");
    });
  });

  describe("version", () => {
    test("should do nothing without git", async () => {
      const hooks = setup();
      await hooks.version.promise({ bump: Auto.SEMVER.patch });
      expect(exec).not.toHaveBeenCalled();
    });

    test("should do nothing with a bad version bump", async () => {
      const hooks = setup({ getLatestTagInBranch: () => "v1.0.0" });
      await hooks.version.promise({ bump: "wrong" as Auto.SEMVER });
      expect(exec).not.toHaveBeenCalled();
    });

    test("should tag next version", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        { getLatestTagInBranch: () => "v1.0.0" },
        { registry, image: sourceImage }
      );
      await hooks.version.promise({ bump: Auto.SEMVER.patch });
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "1.0.1",
        "-m",
        '"Update version to 1.0.1"',
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1`,
      ]);
    });

    test("should tag latest", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        { getLatestTagInBranch: () => "v1.0.0" },
        { registry, image: sourceImage, tagLatest: true }
      );
      await hooks.version.promise({ bump: Auto.SEMVER.patch });
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "1.0.1",
        "-m",
        '"Update version to 1.0.1"',
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "-f",
        "latest",
        "-m",
        '"Tag release alias: latest (1.0.1)"',
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:latest`,
      ]);
    });
  });

  describe("canary", () => {
    test("should do nothing without git", async () => {
      const hooks = setup();
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any);
      expect(exec).not.toHaveBeenCalled();
    });

    test("should tag canary version", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestRelease: () => "v1.0.0",
          getCurrentVersion: () => "v1.0.0",
        },
        { registry, image: sourceImage }
      );

      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "canary.123.1",
      });
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1-canary.123.1`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1-canary.123.1`,
      ]);
      expect(exec).toBeCalledTimes(2);
    });

    test("should not tag canary version aliases if not a pull request", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestRelease: () => "v1.0.0",
          getCurrentVersion: () => "v1.0.0",
        },
        { registry, image: sourceImage, tagPullRequestAliases: true }
      );

      const prSpy = jest.spyOn(Auto,"getPrNumberFromEnv").mockImplementation(jest.fn());

      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: `canary.123.1`,
      });

      expect(prSpy).toBeCalled();

      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1-canary.123.1`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1-canary.123.1`,
      ]);
      expect(exec).toBeCalledTimes(2);
    });

    test("should tag canary version aliases", async () => {
      const prNumber = 123;
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestRelease: () => "v1.0.0",
          getCurrentVersion: () => "v1.0.0",
        },
        { registry, image: sourceImage, tagPullRequestAliases: true }
      );

      const prSpy = jest.spyOn(Auto,"getPrNumberFromEnv").mockImplementationOnce(() => prNumber);

      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: `canary.${prNumber}.1`,
      });

      expect(prSpy).toBeCalled();

      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1-canary.${prNumber}.1`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1-canary.${prNumber}.1`,
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "-f",
        `pr-${prNumber}`,
        "-m",
        `Tag pull request canary: pr-${prNumber} (1.0.1-canary.${prNumber}.1)`,
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        `refs/tags/pr-${prNumber}`,
        "-f"
      ])
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:pr-${prNumber}`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:pr-${prNumber}`,
      ]);
      expect(exec).toBeCalledTimes(6);
    });

    test("should print canary version in dry run", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestRelease: () => "v1.0.0",
          getCurrentVersion: () => "",
        },
        { registry, image: sourceImage }
      );

      const log = jest.fn();
      jest.spyOn(console, "log").mockImplementation(log);

      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "canary.123.1",
        dryRun: true,
        quiet: true,
      });

      expect(log).toHaveBeenCalledWith("1.0.1-canary.123.1");

      expect(exec).not.toHaveBeenCalled();
    });
  });

  describe("next", () => {
    test("should do nothing without git", async () => {
      const hooks = setup();
      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any);
      expect(exec).not.toHaveBeenCalled();
    });

    test("should tag next version with alias", async () => {
      const sourceImage = "app:sha-123"
      const hooks = setup(
        {
          getLatestRelease: () => "v0.1.0",
          getLastTagNotInBaseBranch: () => "v1.0.0",
        },
        { 
          registry,
          image: sourceImage,
          tagPrereleaseAliases: true
        },
      )

      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any);

      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "1.0.1-next.0",
        "-m",
        '"Tag pre-release: 1.0.1-next.0"',
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "-f",
        "next",
        "-m",
        '"Tag pre-release alias: next (1.0.1-next.0)"',
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        "refs/tags/next",
        "-f"
      ])
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        "next",
        "--tags",
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1-next.0`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:next`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1-next.0`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:next`,
      ]);
      expect(exec).toHaveBeenCalledTimes(8);
    });

    test("should tag next version with alias mappings", async () => {
      const sourceImage = "app:sha-123";
      const expectedAlias = "someOtherAlias";

      const hooks = setup(
        {
          getLatestRelease: () => "v0.1.0",
          getLastTagNotInBaseBranch: () => "v1.0.0",
        },
        { 
          registry,
          image: sourceImage,
          tagPrereleaseAliases: true,
          prereleaseAliasMappings: {
            "next": expectedAlias
          }
        },
      )

      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any);

      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        `1.0.1-${expectedAlias}.0`,
        "-m",
        `"Tag pre-release: 1.0.1-${expectedAlias}.0"`,
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "-f",
        expectedAlias,
        "-m",
        `"Tag pre-release alias: ${expectedAlias} (1.0.1-${expectedAlias}.0)"`,
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        `refs/tags/${expectedAlias}`,
        "-f"
      ])
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        "next",
        "--tags",
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1-${expectedAlias}.0`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:${expectedAlias}`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1-${expectedAlias}.0`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:${expectedAlias}`,
      ]);
      expect(exec).toHaveBeenCalledTimes(8);
    });

    test("should tag next version", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestRelease: () => "v0.1.0",
          getLastTagNotInBaseBranch: () => "v1.0.0",
        },
        { registry, image: sourceImage }
      );

      await hooks.next.promise([], { bump: Auto.SEMVER.patch } as any);

      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "1.0.1-next.0",
        "-m",
        '"Tag pre-release: 1.0.1-next.0"',
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        "next",
        "--tags",
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "tag",
        sourceImage,
        `${registry}:1.0.1-next.0`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1-next.0`,
      ]);
      expect(exec).toHaveBeenCalledTimes(4);
    });

    test("return next version in dry run", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestRelease: () => "v0.1.0",
          getLastTagNotInBaseBranch: () => "v1.0.0",
        },
        { registry, image: sourceImage }
      );

      expect(
        await hooks.next.promise([], {
          bump: Auto.SEMVER.patch,
          dryRun: true,
          quiet: true,
        } as any)
      ).toStrictEqual(["1.0.1-next.0"]);
      expect(exec).not.toHaveBeenCalled();
    });
  });

  describe("publish", () => {
    test("should publish next version", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestTagInBranch: () => "v1.0.0",
          getCurrentBranch: () => "main",
          remote: "github.com",
        },
        { registry, image: sourceImage, tagLatest: false }
      );
      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      await hooks.publish.promise({ bump: Auto.SEMVER.patch });
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1`,
      ]);
    });

    test("should publish latest", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestTagInBranch: () => "v1.0.0",
          getCurrentBranch: () => "main",
          remote: "github.com",
        },
        { registry, image: sourceImage, tagLatest: true }
      );
      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      await hooks.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        "refs/tags/latest",
        "-f"
      ]);

      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:1.0.1`,
      ]);
      expect(exec).toHaveBeenCalledWith("docker", [
        "push",
        `${registry}:latest`,
      ]);
    });
  });
});
