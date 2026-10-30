import type { Mock, MockInstance } from "vitest";
import * as Auto from "@auto-it/core";
import Git from "@auto-it/core/dist/git";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";

import ProtectedBranchPlugin from "../src";

const exec = vi.fn();
vi.mock("@auto-it/core/dist/utils/exec-promise", () => ({
  default: (...args: unknown[]) => exec(...args),
}));

vi.mock("@auto-it/core/dist/utils/get-current-branch");

vi.mock("@auto-it/core/dist/git");
const mockAutoGit = Git as unknown as MockInstance;

describe("Protected-Branch Plugin", () => {
  const mockGetSha = vi.fn();
  const mockCreateCheck = vi.fn();
  const mockCreatePr = vi.fn();
  const mockApprovePr = vi.fn();

  function setupProtectedBranchPlugin(
    checkEnv?: MockInstance,
    withoutGit = false
  ): { plugin: ProtectedBranchPlugin; hooks: Auto.IAutoHooks } {
    const plugin = new ProtectedBranchPlugin({
      reviewerToken: "reviewerToken",
    });
    const hooks = makeHooks();

    plugin.apply({
      hooks,
      checkEnv,
      git: withoutGit
        ? undefined
        : {
            getSha: mockGetSha,
            github: {
              checks: { create: mockCreateCheck },
              pulls: {
                create: mockCreatePr,
              },
            },
            options: {
              owner: "TheOwner",
              repo: "my-repo",
            },
          },
      logger: dummyLog(),
      remote: "remote",
      baseBranch: "main",
    } as unknown as Auto.Auto);

    return { plugin, hooks };
  }

  beforeEach(() => {
    exec.mockReset();
    (Auto.getCurrentBranch as Mock).mockReset();
    mockGetSha.mockReset().mockResolvedValueOnce("sha");
    mockCreateCheck.mockReset();
    mockCreatePr.mockReset().mockResolvedValueOnce({ data: { number: 42 } });
    mockAutoGit.mockReset();
    mockApprovePr.mockReset();
  });

  test("should setup FetchGitHistory Plugin hooks", () => {
    const { hooks } = setupProtectedBranchPlugin();

    expect(hooks.validateConfig.isUsed()).toBe(true);
    expect(hooks.beforeRun.isUsed()).toBe(true);
    expect(hooks.publish.isUsed()).toBe(true);
  });

  describe("validateConfig", () => {
    test("should validate the configuration", async () => {
      const { hooks, plugin } = setupProtectedBranchPlugin();
      await expect(
        hooks.validateConfig.promise("not-me", {})
      ).resolves.toBeUndefined();
      await expect(
        hooks.validateConfig.promise(plugin.name, {})
      ).resolves.toStrictEqual([]);

      const res = await hooks.validateConfig.promise(plugin.name, {
        invalidKey: "value",
      });
      expect(res).toHaveLength(1);
      expect(res && res[0]).toContain(plugin.name);
      expect(res && res[0]).toContain("Found unknown configuration keys:");
      expect(res && res[0]).toContain("invalidKey");
    });
  });

  describe("beforeRun", () => {
    test("should check env without image", async () => {
      const checkEnv = vi.fn();
      const { hooks } = setupProtectedBranchPlugin(checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["protected-branch", {}]],
      } as any);
      expect(checkEnv).toHaveBeenCalledWith(
        "protected-branch",
        "PROTECTED_BRANCH_REVIEWER_TOKEN"
      );
    });

    test("shouldn't check env with image", async () => {
      const checkEnv = vi.fn();
      const { hooks } = setupProtectedBranchPlugin(checkEnv);
      await hooks.beforeRun.promise({
        plugins: [["protected-branch", { reviewerToken: "token" }]],
      } as any);
      expect(checkEnv).not.toHaveBeenCalled();
    });
  });

  describe("publish", () => {
    const options = { bump: Auto.SEMVER.patch };
    const commonGitArgs = {
      owner: "TheOwner",
      repo: "my-repo",
    };

    beforeEach(() => {
      (Auto.getCurrentBranch as Mock).mockReturnValueOnce(
        "current-branch-name"
      );
    });

    function doMockPrApproval() {
      mockAutoGit.mockImplementationOnce(function () {
        return {
          github: {
            pulls: { createReview: mockApprovePr },
          },
        };
      });
    }

    function expectCreateRemoteBranch(): void {
      expect(exec).toHaveBeenNthCalledWith(1, "git", [
        "push",
        "--set-upstream",
        "remote",
        "--porcelain",
        "HEAD:automatic-release-sha",
      ]);
      expect(mockGetSha).toHaveBeenCalledTimes(1);
    }

    function expectHandleBranchProtections(ciChecks: string[]): void {
      expect(mockCreateCheck).toHaveBeenCalledTimes(ciChecks.length);
      for (let i = 0; i < ciChecks.length; i++) {
        expect(mockCreateCheck).toHaveBeenNthCalledWith(i + 1, {
          ...commonGitArgs,
          name: ciChecks[i],
          head_sha: "sha",
          conclusion: "success",
        });
      }

      expect(mockCreatePr).toHaveBeenCalledWith({
        ...commonGitArgs,
        base: "current-branch-name",
        head: "automatic-release-sha",
        title: "Automatic release",
      });
      expect(mockAutoGit).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "reviewerToken",
        }),
        expect.anything()
      );
      expect(mockApprovePr).toHaveBeenCalledWith({
        ...commonGitArgs,
        pull_number: 42,
        commit_id: "sha",
        event: "APPROVE",
      });
    }

    test("should do nothing without git", async () => {
      const { hooks } = setupProtectedBranchPlugin(undefined, true);

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(Auto.getCurrentBranch as Mock).toHaveBeenCalledTimes(1);
      expect(exec).not.toHaveBeenCalled();
      expect(mockGetSha).not.toHaveBeenCalled();
      expect(mockCreateCheck).not.toHaveBeenCalled();
      expect(mockCreatePr).not.toHaveBeenCalled();
      expect(mockAutoGit).not.toHaveBeenCalled();
    });

    test("should do nothing without reviewerToken", async () => {
      const { hooks, plugin } = setupProtectedBranchPlugin();
      (plugin as any).options.reviewerToken = undefined;

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(Auto.getCurrentBranch as Mock).toHaveBeenCalledTimes(1);
      expect(exec).not.toHaveBeenCalled();
      expect(mockGetSha).not.toHaveBeenCalled();
      expect(mockCreateCheck).not.toHaveBeenCalled();
      expect(mockCreatePr).not.toHaveBeenCalled();
      expect(mockAutoGit).not.toHaveBeenCalled();
    });

    test("should handle all branch protections", async () => {
      const { hooks } = setupProtectedBranchPlugin();
      doMockPrApproval();

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(Auto.getCurrentBranch as Mock).toHaveBeenCalledTimes(1);
      expect(exec).toHaveBeenCalledTimes(1);
      expectCreateRemoteBranch();
      expectHandleBranchProtections([]);
    });

    test("should handle ci branch protections", async () => {
      const ciChecks = ["ci", "release"];

      const { hooks, plugin } = setupProtectedBranchPlugin();
      (plugin as any).options.requiredStatusChecks = ciChecks;

      doMockPrApproval();

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(Auto.getCurrentBranch as Mock).toHaveBeenCalledTimes(1);
      expect(exec).toHaveBeenCalledTimes(1);
      expectCreateRemoteBranch();
      expectHandleBranchProtections(ciChecks);
    });

    test("should silently cleanup remote stuff", async () => {
      const { hooks } = setupProtectedBranchPlugin();
      exec
        .mockResolvedValueOnce("")
        .mockResolvedValueOnce("")
        .mockRejectedValueOnce(new Error("couldn't delete remote branch"));

      doMockPrApproval();

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(Auto.getCurrentBranch as Mock).toHaveBeenCalledTimes(1);
      expect(exec).toHaveBeenCalledTimes(1);
      expectCreateRemoteBranch();
      expectHandleBranchProtections([]);
    });
  });
});
