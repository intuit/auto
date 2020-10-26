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
  checkEnv?: jest.SpyInstance
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
    config: { prereleaseBranches: ["next"] },
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
      expect(checkEnv).toBeCalled();
    });

    test("shouldn't check env with image", async () => {
      const checkEnv = jest.fn();
      const hooks = setup(undefined, undefined, checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["docker", { registry, image: "test" }]],
      } as any);
      expect(checkEnv).not.toBeCalled();
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
      await hooks.version.promise(Auto.SEMVER.patch);
      expect(exec).not.toHaveBeenCalled();
    });

    test("should do nothing with a bad version bump", async () => {
      const hooks = setup({ getLatestTagInBranch: () => "v1.0.0" });
      await hooks.version.promise("wrong" as Auto.SEMVER);
      expect(exec).not.toHaveBeenCalled();
    });

    test("should tag next version", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        { getLatestTagInBranch: () => "v1.0.0" },
        { registry, image: sourceImage }
      );
      await hooks.version.promise(Auto.SEMVER.patch);
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
      await hooks.version.promise(Auto.SEMVER.patch);
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
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any);
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
      });

      expect(log).toHaveBeenCalledWith("1.0.1-canary.123.1");

      expect(exec).not.toHaveBeenCalled();
    });
  });

  describe("next", () => {
    test("should do nothing without git", async () => {
      const hooks = setup();
      await hooks.next.promise([], Auto.SEMVER.patch, {} as any);
      expect(exec).not.toHaveBeenCalled();
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

      await hooks.next.promise([], Auto.SEMVER.patch, {} as any);

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
    });
  });

  describe("publish", () => {
    test("should publish next version", async () => {
      const sourceImage = "app:sha-123";
      const hooks = setup(
        {
          getLatestTagInBranch: () => "v1.0.0",
          getCurrentBranch: () => "master",
          remote: "github.com",
        },
        { registry, image: sourceImage, tagLatest: false }
      );
      await hooks.version.promise(Auto.SEMVER.patch);

      await hooks.publish.promise(Auto.SEMVER.patch);
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
          getCurrentBranch: () => "master",
          remote: "github.com",
        },
        { registry, image: sourceImage, tagLatest: true }
      );
      await hooks.version.promise(Auto.SEMVER.patch);

      await hooks.publish.promise(Auto.SEMVER.patch);
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
