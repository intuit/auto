import * as Auto from "@auto-it/core";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";

import GitTag from "../src";

const exec = jest.fn();
jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "next",
}));
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args)
);

const setup = (mockGit?: any) => {
  const plugin = new GitTag();
  const hooks = makeHooks();

  plugin.apply(({
    hooks,
    git: mockGit,
    remote: "origin",
    logger: dummyLog(),
    prefixRelease: (r: string) => `v${r}`,
    config: { prereleaseBranches: ["next"] },
    getCurrentVersion: () => "v1.0.0",
  } as unknown) as Auto.Auto);

  return hooks;
};

describe("Git Tag Plugin", () => {
  beforeEach(() => {
    exec.mockClear();
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
      expect(previousVersion).toBe("v0.0.0");
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
      const hooks = setup({ getLatestTagInBranch: () => "v1.0.0" });
      await hooks.version.promise({ bump: Auto.SEMVER.patch });
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "v1.0.1",
        "-m",
        '"Update version to v1.0.1"',
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
      const hooks = setup({
        getLatestRelease: () => "v0.1.0",
        getLastTagNotInBaseBranch: () => "v1.0.0",
      });

      await hooks.next.promise([], Auto.SEMVER.patch, {} as any);

      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "v1.0.1-next.0",
        "-m",
        '"Tag pre-release: v1.0.1-next.0"',
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "origin",
        "next",
        "--tags",
      ]);
    });

    test("return next version in dry run", async () => {
      const hooks = setup({
        getLatestRelease: () => "v0.1.0",
        getLastTagNotInBaseBranch: () => "v1.0.0",
      });

      expect(
        await hooks.next.promise([], Auto.SEMVER.patch, { dryRun: true } as any)
      ).toStrictEqual(["v1.0.1-next.0"]);

      expect(exec).not.toHaveBeenCalled();
    });
  });
});
