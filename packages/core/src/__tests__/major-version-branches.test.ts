import type { Mock } from "vitest";
import { Auto } from "../auto";
import SEMVER from "../semver";
import execPromise from "../utils/exec-promise";

const execSpy = execPromise as Mock;
vi.mock("../utils/exec-promise");

const search = vi.fn();
vi.mock("cosmiconfig", () => {
  const mod = {
    cosmiconfig: () => ({
      search,
    }),
  };
  return { ...mod, default: mod };
});

vi.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } }),
    };

    repos = {
      get: vi.fn().mockReturnValueOnce({}),
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
