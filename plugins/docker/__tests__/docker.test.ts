import * as Auto from "@auto-it/core";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";

import DockerPlugin, { IDockerPluginOptions } from "../src";

const exec = jest.fn();
jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "next",
}));
jest.mock("../../../packages/core/dist/utils/exec-promise", () => ({
  // @ts-ignore
  default: (...args) => exec(...args),
}));

const registry = "registry.io/app";

const setup = (mockGit?: any, options?: IDockerPluginOptions) => {
  const plugin = new DockerPlugin(options || { registry });
  const hooks = makeHooks();

  plugin.apply(({
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
});
