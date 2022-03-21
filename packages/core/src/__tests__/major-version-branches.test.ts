import { Auto } from "../auto";
import SEMVER from "../semver";
import execPromise from "../utils/exec-promise";

const execSpy = execPromise as jest.Mock;
jest.mock("../utils/exec-promise");

const search = jest.fn();
jest.mock("cosmiconfig", () => ({
  cosmiconfig: () => ({
    search,
  }),
}));

jest.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } }),
    };

    repos = {
      get: jest.fn().mockReturnValueOnce({}),
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

const defaults = {
  owner: "foo",
  repo: "bar",
};

describe("Old Version Branches", () => {
  beforeEach(() => {
    search.mockClear();
    execSpy.mockClear();
  });

  test("should not create old version branches", async () => {
    search.mockReturnValueOnce({});
    execSpy.mockResolvedValueOnce(undefined);

    const auto = new Auto({ ...defaults, plugins: [] });
    await auto.loadConfig();

    auto.hooks.getPreviousVersion.tap("test", () => "1.0.0");
    await auto.hooks.beforeCommitChangelog.promise({
      bump: SEMVER.major,
    } as any);

    expect(execSpy).not.toHaveBeenCalledWith();
  });

  test("create old version branches", async () => {
    search.mockReturnValueOnce({ config: { versionBranches: true } });
    execSpy.mockResolvedValueOnce(undefined);

    const auto = new Auto({ ...defaults, plugins: [] });
    await auto.loadConfig();

    auto.hooks.getPreviousVersion.tap("test", () => "1.0.0");
    await auto.hooks.beforeCommitChangelog.promise({
      bump: SEMVER.major,
      lastRelease: "1.0.0",
    } as any);

    expect(execSpy).toHaveBeenCalledWith("git", [
      "branch",
      "version-1",
      "1.0.0",
    ]);
  });

  test("should be able to customize old version branches", async () => {
    search.mockReturnValueOnce({ config: { versionBranches: "v" } });
    execSpy.mockResolvedValueOnce(undefined);

    const auto = new Auto({ ...defaults, plugins: [] });
    await auto.loadConfig();

    auto.hooks.getPreviousVersion.tap("test", () => "1.0.0");
    await auto.hooks.beforeCommitChangelog.promise({
      bump: SEMVER.major,
      lastRelease: "1.0.0",
    } as any);

    expect(execSpy).toHaveBeenCalledWith("git", ["branch", "v1", "1.0.0"]);
  });
});
