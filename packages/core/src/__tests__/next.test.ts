import { Auto } from "../auto";
import { dummyLog } from "../utils/logger";
import makeCommitFromMsg from "./make-commit-from-msg";
import execPromise from "../utils/exec-promise";

const exec = jest.fn();
jest.mock("../utils/exec-promise");
// @ts-ignore
execPromise.mockImplementation(exec);
exec.mockResolvedValue("");

jest.mock("../utils/git-reset.ts");
jest.mock("../utils/load-plugins.ts");
jest.mock("env-ci", () => () => ({ isCi: false, branch: "next" }));

const defaults = {
  baseBranch: "main",
  owner: "foo",
  repo: "bar",
};

jest.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } }),
    };

    repos = {
      get: jest.fn().mockReturnValue({}),
    };

    hook = {
      error: () => undefined,
    };

    issues = {
      listLabelsOnIssue: jest.fn().mockReturnValue({ data: [] }),
    };

    users = {
      getAuthenticated: jest.fn().mockResolvedValue({}),
    };
  };

  return { Octokit };
});

// @ts-ignore
jest.mock("gitlog", () => ({
  gitlogPromise: () =>
    Promise.resolve([
      {
        rawBody: "foo",
        hash: "123",
      },
      {
        rawBody: "foo",
        hash: "456",
      },
    ]),
}));

test("falls back to local baseBranch if it doesn't exist on origin", async () => {
  const auto = new Auto({ ...defaults, plugins: [] });

  // @ts-ignore
  auto.checkClean = () => Promise.resolve(true);
  auto.logger = dummyLog();
  await auto.loadConfig();
  auto.remote = "origin";
  auto.git!.publish = () => Promise.resolve({ data: {} } as any);
  auto.git!.getLastTagNotInBaseBranch = () => Promise.reject(new Error("Test"));
  auto.git!.getLatestTagInBranch = () => Promise.reject(new Error("Test"));
  auto.git!.getLatestRelease = () => Promise.resolve("abcd");
  auto.release!.generateReleaseNotes = () => Promise.resolve("notes");
  auto.release!.getCommitsInRelease = () =>
    Promise.resolve([
      makeCommitFromMsg("Test Commit", { labels: ["skip-release"] }),
    ]);

  jest.spyOn(auto.release!, "getCommits").mockImplementation();
  const next = jest.fn();
  auto.hooks.next.tap("test", next);

  await auto.next({});
  expect(exec).toHaveBeenCalledWith("git", [
    "rev-list",
    "--boundary",
    "next...origin/main",
    "--left-only",
  ]);

  auto.git!.shaExists = () => Promise.resolve(false);

  await auto.next({});
  expect(exec).toHaveBeenCalledWith("git", [
    "rev-list",
    "--boundary",
    "next...main",
    "--left-only",
  ]);
});
