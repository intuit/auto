import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import ProtectedBranchPlugin from "../src";

const execPromise = jest.fn();
jest.mock(
    "../../../packages/core/dist/utils/exec-promise",
    () => (...args: any[]) => execPromise(...args),
);

describe("Protected-Branch Plugin", () => {
  const mockGetSha = jest.fn();
  const mockCreateCheck = jest.fn();
  const mockCreatePr = jest.fn();
  const mockApprovePr = jest.fn();

  function setupProtectedBranchPlugin(
    checkEnv?: jest.SpyInstance,
    withoutGit = false
  ): { plugin: ProtectedBranchPlugin; hooks: Auto.IAutoHooks } {
    const plugin = new ProtectedBranchPlugin({ reviewerToken: "token" });
    const hooks = makeHooks();

    plugin.apply(({
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
                createReview: mockApprovePr,
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
    } as unknown) as Auto.Auto);

    return { plugin, hooks };
  }

  beforeEach(() => {
    execPromise.mockReset();
    mockGetSha.mockReset().mockResolvedValueOnce("sha");
    mockCreateCheck.mockReset();
    mockCreatePr.mockReset().mockResolvedValueOnce({ data: { number: 42 } });
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
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      expect(res && res[0]).toContain(plugin.name);
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      expect(res && res[0]).toContain("Found unknown configuration keys:");
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      expect(res && res[0]).toContain("invalidKey");
    });
  });

  describe("beforeRun", () => {
    test("should check env without image", async () => {
      const checkEnv = jest.fn();
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
      const checkEnv = jest.fn();
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

    function expectCreateRemoteBranch(): void {
      expect(execPromise).toHaveBeenNthCalledWith(1, "git", [
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
        base: "main",
        head: "automatic-release-sha",
        title: "Automatic release",
      });
      expect(execPromise).toHaveBeenNthCalledWith(2, "gh", [
        "api",
        "/repos/TheOwner/my-repo/pulls/42/reviews",
        "-X",
        "POST",
        "-F",
        "commit_id=sha",
        "-F",
        `event=APPROVE`,
      ]);
    }

    test("should do nothing without git", async () => {
      const { hooks } = setupProtectedBranchPlugin(undefined, true);

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(execPromise).not.toHaveBeenCalled();
      expect(mockGetSha).not.toHaveBeenCalled();
      expect(mockCreateCheck).not.toHaveBeenCalled();
      expect(mockCreatePr).not.toHaveBeenCalled();
      expect(mockApprovePr).not.toHaveBeenCalled();
    });

    test("should do nothing without reviewerToken", async () => {
      const { hooks, plugin } = setupProtectedBranchPlugin();
      (plugin as any).options.reviewerToken = undefined;

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(execPromise).not.toHaveBeenCalled();
      expect(mockGetSha).not.toHaveBeenCalled();
      expect(mockCreateCheck).not.toHaveBeenCalled();
      expect(mockCreatePr).not.toHaveBeenCalled();
      expect(mockApprovePr).not.toHaveBeenCalled();
    });

    test("should handle all branch protections", async () => {
      const { hooks } = setupProtectedBranchPlugin();

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(execPromise).toHaveBeenCalledTimes(2);
      expectCreateRemoteBranch();
      expectHandleBranchProtections([]);
    });

    test("should handle ci branch protections", async () => {
      const ciChecks = ["ci", "release"];

      const { hooks, plugin } = setupProtectedBranchPlugin();
      (plugin as any).options.requiredStatusChecks = ciChecks;

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(execPromise).toHaveBeenCalledTimes(2);
      expectCreateRemoteBranch();
      expectHandleBranchProtections(ciChecks);
    });

    test("should silently cleanup remote stuff", async () => {
      const { hooks } = setupProtectedBranchPlugin();
      execPromise
        .mockResolvedValueOnce("")
        .mockResolvedValueOnce("")
        .mockRejectedValueOnce(new Error("couldn't delete remote branch"));

      await expect(hooks.publish.promise(options)).resolves.toBeUndefined();

      expect(execPromise).toHaveBeenCalledTimes(2);
      expectCreateRemoteBranch();
      expectHandleBranchProtections([]);
    });
  });
});
