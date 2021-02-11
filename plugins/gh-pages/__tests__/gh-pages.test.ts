import { execPromise } from "@auto-it/core";
import GhPages, { IGhPagesPluginOptions } from "../src";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { execSync } from "child_process";

const execSyncSpy = execSync as jest.Mock;
jest.mock("child_process");

const execSpy = execPromise as jest.Mock;
jest.mock("@auto-it/core");

/** Create a test for gh-pages plugin */
function createTest(
  options: IGhPagesPluginOptions,
  autoOverrides: Record<string, any> = {}
) {
  const releasedLabel = new GhPages(options);
  const hooks = makeHooks();

  releasedLabel.apply({
    hooks,
    logger: dummyLog(),
    setGitUser: () => undefined,
    ...autoOverrides,
    git: autoOverrides.git || {},
  } as any);

  return hooks;
}

describe("Gh-Pages Plugin", () => {
  beforeEach(() => {
    execSpy.mockReset();
  });

  describe("beforeShipit", () => {
    test("should not release on anything but a latest release", async () => {
      const hooks = createTest({ dir: "test" });

      await hooks.beforeShipIt.promise({ releaseType: "canary" });
      await hooks.beforeShipIt.promise({ releaseType: "next" });
      await hooks.beforeShipIt.promise({ releaseType: "old" });

      expect(execSpy).not.toHaveBeenCalled();
    });

    test("should not release on anything on a dry run", async () => {
      const hooks = createTest({ dir: "test" });

      await hooks.beforeShipIt.promise({ releaseType: "latest", dryRun: true });

      expect(execSpy).not.toHaveBeenCalled();
    });

    test("should not release if there is a version bump", async () => {
      const hooks = createTest({ dir: "test" }, { getVersion: () => "patch" });

      await hooks.beforeShipIt.promise({ releaseType: "latest" });
      expect(execSpy).not.toHaveBeenCalled();
    });

    test("should not release if there is no matching PR", async () => {
      const hooks = createTest(
        { dir: "test" },
        {
          getVersion: () => "",
          git: { getSha: () => "123", matchCommitToPr: () => undefined },
        }
      );

      await hooks.beforeShipIt.promise({ releaseType: "latest" });
      expect(execSpy).not.toHaveBeenCalled();
    });

    test("should not release if PR doesn't have documentation label", async () => {
      const hooks = createTest(
        { dir: "test" },
        {
          getVersion: () => "",
          git: { getSha: () => "123", matchCommitToPr: () => ({ labels: [] }) },
        }
      );

      await hooks.beforeShipIt.promise({ releaseType: "latest" });
      expect(execSpy).not.toHaveBeenCalled();
    });

    test("should release if noVersion + documentation label", async () => {
      const hooks = createTest(
        { dir: "test" },
        {
          getVersion: () => "",
          git: {
            getSha: () => "123",
            matchCommitToPr: () => ({ labels: ["documentation"] }),
          },
        }
      );

      await hooks.beforeShipIt.promise({ releaseType: "latest" });
      expect(execSpy).toHaveBeenCalled();
    });
  });

  describe("afterRelease", () => {
    test("should not release if there is not GitHub release", async () => {
      const hooks = createTest({ dir: "test" });
      await hooks.afterRelease.promise({ response: undefined } as any);
      expect(execSpy).not.toHaveBeenCalled();
    });

    test("should not release if it was pre-release", async () => {
      const hooks = createTest({ dir: "test" });
      await hooks.afterRelease.promise({
        response: { data: { prerelease: true } },
      } as any);
      expect(execSpy).not.toHaveBeenCalled();
    });

    test("should run build command if present", async () => {
      const buildCommand = "dew it";
      const hooks = createTest({
        dir: "test",
        buildCommand,
      });
      await hooks.afterRelease.promise({
        response: { data: { prerelease: false } },
      } as any);
      expect(execSyncSpy).toHaveBeenCalledWith(buildCommand);
    });

    test("should successfully deploy to gh-pages", async () => {
      const hooks = createTest({ dir: "test" });
      await hooks.afterRelease.promise({
        response: { data: { prerelease: false } },
      } as any);
      expect(execSpy).toHaveBeenCalledWith("npx", [
        "push-dir",
        "--cleanup",
        false,
        "--remote=undefined",
        "--dir=test",
        "--branch=gh-pages",
        '--message="Update docs [skip ci]"',
      ]);
    });

    test("should use verbose logs", async () => {
      const logger = dummyLog();
      logger.logLevel = "verbose";
      const hooks = createTest({ dir: "test" }, { logger });
      await hooks.afterRelease.promise({
        response: { data: { prerelease: false } },
      } as any);
      expect(execSpy).toHaveBeenCalledWith("npx", [
        "push-dir",
        "--cleanup",
        "--verbose",
        "--remote=undefined",
        "--dir=test",
        "--branch=gh-pages",
        '--message="Update docs [skip ci]"',
      ]);
    });
  });
});
