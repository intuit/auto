import Auto from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import OneReleaseCommit from '../src';

const exec = jest.fn();
const getGitLog = jest.fn();

jest.mock("../../../packages/core/dist/utils/get-current-branch", () => ({
  getCurrentBranch: () => "main",
}));
jest.mock(
    "../../../packages/core/dist/utils/exec-promise",
    () => (...args: any[]) => exec(...args)
);

const setup = (mockGit?: any) => {
  const plugin = new OneReleaseCommit({});
  const hooks = makeHooks();

  plugin.apply(({
    hooks,
    git: mockGit,
    remote: "origin",
    baseBranch: "main",
    logger: dummyLog(),
  } as unknown) as Auto.Auto);

  return { plugin, hooks };
};

describe('One-Release-Commit Plugin', () => {
  const headCommitHash = "dd53ea5d7b151306ba6275a332ee333800fb39e8";

  beforeEach(() => {
    exec.mockReset();
    exec.mockResolvedValueOnce(`${headCommitHash}    refs/heads/main`);
    getGitLog.mockReset();
    getGitLog.mockResolvedValueOnce([{hash: "c2241048"},{hash: "c2241049"}]);
  });

  function expectListGitHistoryCalled() {
    expect(exec).toHaveBeenCalled();
    expect(exec.mock.calls[0]).toMatchObject(["git",["ls-remote", "--heads", "origin", "main"]]);
    expect(getGitLog).toHaveBeenCalledTimes(1);
    expect(getGitLog.mock.calls[0]).toMatchObject([headCommitHash]);
  }

  function expectLookingForGitTagOnCommit(callIdx: number, commitSha: string) {
    expect(exec.mock.calls.length >= callIdx).toBe(true);
    expect(exec.mock.calls[callIdx]).toMatchObject(["git",["describe", "--tags", "--exact-match", commitSha]]);
  }

  function expectResetAndRecreateANewReleaseCommit(callIdx: number) {
    expect(exec.mock.calls.length > callIdx).toBe(true);
    expect(exec.mock.calls[callIdx]).toMatchObject(["git",["reset", "--soft", headCommitHash]]);
    expect(exec.mock.calls[callIdx+1]).toMatchObject(["git",["commit", "-m", '"Release version v1.2.3 [skip ci]"', "--no-verify"]]);
  }

  test("should setup hooks", () => {
    const {hooks} = setup();

    expect(hooks.validateConfig.isUsed()).toBe(true);
    expect(hooks.afterVersion.isUsed()).toBe(true);
  });

  describe("validateConfig", () => {
    test('should validate the configuration', async () => {
      const {hooks, plugin} = setup();
      await expect(hooks.validateConfig.promise("not-me", {})).resolves.toBeUndefined();
      await expect(hooks.validateConfig.promise(plugin.name, {})).resolves.toStrictEqual([]);

      const res = await hooks.validateConfig.promise(plugin.name, {invalidKey: "value"});
      expect(res).toHaveLength(1);
      expect(res[0]).toContain(plugin.name);
      expect(res[0]).toContain("Found unknown configuration keys:");
      expect(res[0]).toContain("invalidKey");

      await expect(hooks.validateConfig.promise(plugin.name, {commitMessage: -1})).resolves.toMatchObject([{
        expectedType: '"string"',
        path: "one-release-commit.commitMessage",
        value: -1,
      }]);
    });
  });

  describe("afterVersion", () => {
    test('should do nothing on dryRun', async () => {
      const {hooks} = setup();
      await expect(hooks.afterVersion.promise({dryRun: true})).resolves.toBeUndefined();
      expect(exec).not.toHaveBeenCalled();
    });

    test('should do nothing without version', async () => {
      const {hooks} = setup();
      await expect(hooks.afterVersion.promise({})).resolves.toBeUndefined();
      expect(exec).not.toHaveBeenCalled();
    });

    test('should do nothing without git', async () => {
      const {hooks} = setup();
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).resolves.toBeUndefined();
      expect(exec).not.toHaveBeenCalled();
    });

    test('should be executed in a less priority group', async () => {
      getGitLog.mockReset();
      getGitLog.mockResolvedValueOnce([]);

      const {hooks} = setup({ getGitLog });
      hooks.afterVersion.tapPromise("dummy", async () => {
        expect(exec).not.toHaveBeenCalled();
        expect(getGitLog).not.toHaveBeenCalled();
      });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).resolves.toBeUndefined();

      expectListGitHistoryCalled();
    });

    test('should do nothing when there no release commits', async () => {
      getGitLog.mockReset();
      getGitLog.mockResolvedValueOnce([]);

      const {hooks} = setup({ getGitLog });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).resolves.toBeUndefined();

      expectListGitHistoryCalled();
    });

    test('should create a single release commit when there is one existing commit', async () => {
      getGitLog.mockReset();
      getGitLog.mockResolvedValueOnce([{hash: "c2241048"}]);

      const {hooks} = setup({ getGitLog });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).resolves.toBeUndefined();

      expectListGitHistoryCalled();

      expect(exec).toHaveBeenCalledTimes(4);
      expectLookingForGitTagOnCommit(1, "c2241048");
      expectResetAndRecreateANewReleaseCommit(2);
    });

    test('should create a single release commit when there is multiple existing commit', async () => {
      const {hooks} = setup({ getGitLog });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).resolves.toBeUndefined();

      expectListGitHistoryCalled();

      expect(exec).toHaveBeenCalledTimes(5);
      expectLookingForGitTagOnCommit(1, "c2241048");
      expectLookingForGitTagOnCommit(2, "c2241049");
      expectResetAndRecreateANewReleaseCommit(3);
    });

    test('should recreate all existing tags', async () => {
      exec.mockResolvedValueOnce('v1.2.4')
          .mockResolvedValueOnce('submobule-v1.2.4')
          .mockResolvedValueOnce(' Tag message for v1.2.4 ')
          .mockResolvedValueOnce(' Another multiline\ntag message\n');

      const {hooks} = setup({ getGitLog });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).resolves.toBeUndefined();

      expectListGitHistoryCalled();

      expect(exec).toHaveBeenCalledTimes(9);
      expectLookingForGitTagOnCommit(1, "c2241048");
      expectLookingForGitTagOnCommit(2, "c2241049");
      expect(exec.mock.calls[3]).toMatchObject(["git",["tag", "v1.2.4", "-l", '--format="%(contents)"']]);
      expect(exec.mock.calls[4]).toMatchObject(["git",["tag", "submobule-v1.2.4", "-l", '--format="%(contents)"']]);
      expectResetAndRecreateANewReleaseCommit(5);
    });

    test('should not failed when there is no tag on commit', async () => {
      exec.mockResolvedValueOnce('v1.2.4')
          .mockRejectedValueOnce(new Error('no tag exactly matches xyz'))
          .mockResolvedValueOnce(' Tag message for v1.2.4 ');

      const {hooks} = setup({ getGitLog });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).resolves.toBeUndefined();

      expectListGitHistoryCalled();

      expect(exec).toHaveBeenCalledTimes(7);
      expectLookingForGitTagOnCommit(1, "c2241048");
      expectLookingForGitTagOnCommit(2, "c2241049");
      expect(exec.mock.calls[3]).toMatchObject(["git",["tag", "v1.2.4", "-l", '--format="%(contents)"']]);
      expectResetAndRecreateANewReleaseCommit(4);
    });

    test.each([
        [new Error('unknown failure')],
        ['not an error'],
    ])( 'should failed when retrieving tags failed with : %p', async (cause) => {
      exec.mockRejectedValueOnce(cause);

      const {hooks} = setup({ getGitLog });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).rejects.toBe(cause);

      expectListGitHistoryCalled();

      expect(exec).toHaveBeenCalledTimes(3);
      expectLookingForGitTagOnCommit(1, "c2241048");
      expectLookingForGitTagOnCommit(2, "c2241049");
    });

    test('should failed when not remote head found', async () => {
      exec.mockReset();
      exec.mockResolvedValueOnce('');

      const {hooks} = setup({ getGitLog });
      await expect(hooks.afterVersion.promise({version: 'v1.2.3'})).rejects.toStrictEqual(new Error('No remote found for branch : "main"'));

      expect(exec).toHaveBeenCalledTimes(1);
      expect(exec.mock.calls[0]).toMatchObject(["git",["ls-remote", "--heads", "origin", "main"]]);
      expect(getGitLog).not.toHaveBeenCalled();
    });
  });
});
