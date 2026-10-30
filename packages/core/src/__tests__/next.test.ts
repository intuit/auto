import { Auto } from "../auto";
import { dummyLog } from "../utils/logger";
import makeCommitFromMsg from "./make-commit-from-msg";
import execPromise from "../utils/exec-promise";

const exec = vi.fn();
vi.mock("../utils/exec-promise");
// @ts-ignore
execPromise.mockImplementation(exec);
exec.mockResolvedValue("");

vi.mock("../utils/git-reset.ts");
vi.mock("../utils/load-plugins.ts");
vi.mock("env-ci", () => ({ default: () => ({ isCi: false, branch: "next" }) }));

const defaults = {
  baseBranch: "main",
  owner: "foo",
  repo: "bar",
};

vi.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } }),
    };

    repos = {
      get: vi.fn().mockReturnValue({}),
    };

    hook = {
      error: () => undefined,
    };

    issues = {
      listLabelsOnIssue: vi.fn().mockReturnValue({ data: [] }),
    };

    users = {
      getAuthenticated: vi.fn().mockResolvedValue({}),
    };
  };

  return { Octokit };
});

// @ts-ignore
vi.mock("gitlog", () => {
  const mod = {
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
  };
  return { ...mod, default: mod };
});

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

  vi.spyOn(auto.release!, "getCommits").mockImplementation(
    () => undefined as any
  );
  const next = vi.fn();
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
