import Git from "../git";
import LogParse from "../log-parse";
import Release, { getVersionMap } from "../release";
import SEMVER, { defaultLabels, ILabelDefinition } from "../semver";
import { dummyLog } from "../utils/logger";
import makeCommitFromMsg from "./make-commit-from-msg";
import child from "child_process";
import { getCurrentBranch } from "../utils/get-current-branch";
import { DEFAULT_PRERELEASE_BRANCHES } from "../config";

const { execSync } = child;
const exec = jest.fn();
child.execSync = exec.mockReturnValue("");

afterAll(() => {
  child.execSync = execSync;
});

const constructor = jest.fn();
const getGitLog = jest.fn();
const graphql = jest.fn();
const getUserByEmail = jest.fn();
const getPr = jest.fn().mockReturnValue(Promise.resolve());
const getPullRequest = jest.fn();
const getLatestRelease = jest.fn();
const getSha = jest.fn();
const getCommit = jest
  .fn()
  .mockReturnValue(Promise.resolve({ data: { author: { login: "" } } }));
const createStatus = jest.fn();
const getProject = jest.fn();
const createComment = jest.fn();
const changedPackages = jest.fn();
const getCommitsForPR = jest.fn().mockReturnValue(Promise.resolve(undefined));
const getUserByUsername = jest.fn();
const getProjectLabels = jest.fn();
const createLabel = jest.fn();
const updateLabel = jest.fn();
const getPullRequests = jest.fn();
const getLatestReleaseInfo = jest.fn();
const searchRepo = jest.fn();
const getCommitDate = jest.fn();
const getFirstCommit = jest.fn();

getProject.mockResolvedValue({
  html_url: "https://github.com/web/site",
});

const mockLabels = (labels: string[]) => ({
  data: { labels: labels.map((label) => ({ name: label })), user: {} },
});

// @ts-ignore
jest.mock(
  "../git.ts",
  () =>
    class MockGit {
      constructor(...args: any[]) {
        constructor(...args);
      }

      options = { owner: "test", repo: "test", version: "1.0.0" };
      graphql = graphql;
      getGitLog = getGitLog;
      getPr = getPr;
      getLatestRelease = getLatestRelease;
      getPullRequest = getPullRequest;
      getSha = getSha;
      createStatus = createStatus;
      createComment = createComment;
      getProject = getProject;
      changedPackages = changedPackages;
      getCommitsForPR = getCommitsForPR;
      getUserByUsername = getUserByUsername;
      getProjectLabels = getProjectLabels;
      createLabel = createLabel;
      updateLabel = updateLabel;
      getPullRequests = getPullRequests;
      getLatestReleaseInfo = getLatestReleaseInfo;
      searchRepo = searchRepo;
      getCommitDate = getCommitDate;
      getFirstCommit = getFirstCommit;
      getCommit = getCommit;
      getUserByEmail = getUserByEmail;
    }
);

getGitLog.mockReturnValue([]);

const execSpy = jest.fn();
// @ts-ignore
jest.mock("../utils/exec-promise.ts", () => (...args) => execSpy(...args));

const currentBranch = jest.fn();
currentBranch.mockReturnValue("main");
jest.mock("../utils/get-current-branch.ts");
// @ts-ignore
getCurrentBranch.mockImplementation(currentBranch);

const existsSync = jest.fn();
const writeSpy = jest.fn();

let readResult = "{}";

const config = {
  baseBranch: "main",
  prereleaseBranches: DEFAULT_PRERELEASE_BRANCHES,
  labels: defaultLabels,
};

jest.mock("fs", () => ({
  // @ts-ignore
  existsSync: (...args) => existsSync(...args),
  // @ts-ignore
  readFile: (a, b, cb) => {
    cb(undefined, readResult);
  },
  ReadStream: function () {},
  WriteStream: function () {},
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: (file, data, cb) => {
    cb(undefined, writeSpy(file, data));
  },
  // @ts-ignore
  read: (a, b, cb) => {
    cb(undefined);
  },
}));

const logParse = new LogParse();
const git = new Git({
  owner: "Andrew",
  repo: "test",
  token: "MY_TOKEN",
  baseBranch: "main",
});

describe("getVersionMap", () => {
  test("should return the default map", () => {
    expect(getVersionMap()).toStrictEqual(
      new Map([
        ["major", ["major"]],
        ["minor", ["minor"]],
        ["patch", ["patch", "performance"]],
        ["skip", ["skip-release"]],
        ["release", ["release"]],
        ["none", ["internal", "documentation", "tests", "dependencies"]],
      ])
    );
  });

  test("should add custom labels", () => {
    expect(
      getVersionMap([
        { name: "major", releaseType: SEMVER.major },
        { name: "BREAKING", releaseType: SEMVER.major },
      ])
    ).toStrictEqual(new Map([["major", ["major", "BREAKING"]]]));
  });
});

describe("Release", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUserByUsername.mockReset();
  });

  describe("getCommits", () => {
    test("should default to HEAD", async () => {
      const gh = new Release(git, config);
      await gh.getCommits("12345");
      expect(getGitLog).toHaveBeenCalled();
    });

    test("should use configured HEAD", async () => {
      const gh = new Release(git, config);
      await gh.getCommits("12345", "1234");
      expect(getGitLog).toHaveBeenCalled();
    });

    test("should not resolve authors with no PR commits", async () => {
      const commits = [
        makeCommitFromMsg("First"),
        makeCommitFromMsg("Second"),
        makeCommitFromMsg("Third"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      const gh = new Release(git, config);
      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });

    test("should resolve authors with PR commits", async () => {
      const commits = await logParse.normalizeCommits([
        makeCommitFromMsg("First"),
        makeCommitFromMsg("Second (#123)", {
          name: "Andrew Lisowski",
          email: "andrew@users.noreply.github.com",
        }),
        makeCommitFromMsg("Second (#123)", {
          name: "Andrew Lisowski",
          email: "lisowski54@gmail.com",
        }),
        makeCommitFromMsg("Third"),
      ]);

      getGitLog.mockReturnValueOnce(commits);
      getCommitsForPR.mockReturnValueOnce(
        Promise.resolve([
          {
            author: {
              login: "andrew",
            },
          },
        ])
      );

      getCommit.mockReturnValueOnce(
        Promise.resolve({ data: { author: { login: "adam" } } })
      );
      getUserByUsername.mockImplementation((username) => {
        if (username === "andrew") {
          return {
            login: "andrew",
            name: "Andrew Lisowski",
          };
        }

        return {
          login: "adam",
          name: "Adam Dierkens",
        };
      });

      const gh = new Release(git, config);
      const modifiedCommits = await gh.getCommits("12345", "1234");
      expect(getUserByUsername).toHaveBeenCalled();
      expect(modifiedCommits).toMatchSnapshot();
    });

    test("should be able to omit by username", async () => {
      const commits = await logParse.normalizeCommits([
        makeCommitFromMsg("First"),
        makeCommitFromMsg("Second (#123)", {
          name: "Andrew Lisowski",
          email: "lisowski54@gmail.com",
        }),
        makeCommitFromMsg("Third"),
      ]);

      getGitLog.mockReturnValueOnce(commits);
      getCommitsForPR.mockReturnValueOnce(
        Promise.resolve([
          {
            author: {
              login: "andrew",
            },
          },
        ])
      );

      getCommit.mockReturnValueOnce(
        Promise.resolve({ data: { author: { login: "adam" } } })
      );

      getCommit.mockReturnValueOnce(
        Promise.resolve({ data: { author: { login: "adam" } } })
      );
      getUserByUsername.mockImplementation((username) => {
        if (username === "andrew") {
          return {
            login: "andrew",
            name: "Andrew Lisowski",
          };
        }

        return {
          login: "adam",
          name: "Adam Dierkens",
        };
      });

      const gh = new Release(git, config);
      gh.hooks.onCreateLogParse.tap("test", (parser) => {
        parser.hooks.omitCommit.tap("test", (commit) =>
          Boolean(commit.authors.find((author) => author.username === "adam"))
        );
      });
      const modifiedCommits = await gh.getCommits("12345", "1234");
      expect(modifiedCommits).toMatchSnapshot();
    });

    test("should ignore rebased commits if no last release", async () => {
      const gh = new Release(git, config);

      getLatestReleaseInfo.mockReturnValueOnce({});
      const commits = await logParse.normalizeCommits([
        makeCommitFromMsg("Second (#123)"),
      ]);

      getGitLog.mockReturnValueOnce(commits);

      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });

    test("should match rebased commits to PRs", async () => {
      const gh = new Release(git, config);

      getLatestReleaseInfo.mockReturnValueOnce({
        published_at: "2019-01-16",
      });
      searchRepo.mockReturnValueOnce({ items: [{ number: 123 }] });
      getPullRequest.mockReturnValueOnce({
        data: {
          number: 123,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
        },
      });
      getGitLog.mockReturnValueOnce(
        await logParse.normalizeCommits([
          makeCommitFromMsg("Feature (#124)"),
          makeCommitFromMsg("I was rebased", {
            hash: "1a2b",
          }),
        ])
      );
      getUserByUsername.mockImplementationOnce(() => {
        return {
          login: "adam",
          name: "Adam Dierkens",
        };
      });

      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });

    test("should match rebased commits to PRs with first commit", async () => {
      const gh = new Release(git, config);

      getLatestReleaseInfo.mockImplementationOnce(() => {
        throw new Error("no releases yet");
      });
      getCommitDate.mockReturnValueOnce("2019-01-16");
      searchRepo.mockReturnValueOnce({ items: [{ number: 123 }] });
      getPullRequest.mockReturnValueOnce({
        data: {
          number: 123,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
        },
      });
      getGitLog.mockReturnValueOnce(
        await logParse.normalizeCommits([
          makeCommitFromMsg("Feature (#124)"),
          makeCommitFromMsg("I was rebased", {
            hash: "1a2b",
          }),
        ])
      );
      getUserByUsername.mockImplementationOnce(() => {
        return {
          login: "adam",
          name: "Adam Dierkens",
        };
      });

      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });

    test("should omit commits that have already been released", async () => {
      const gh = new Release(git, config);

      jest.spyOn(console, "log").mockImplementationOnce(() => {});
      getLatestReleaseInfo.mockReturnValueOnce({
        published_at: "2019-01-16",
      });
      searchRepo.mockReturnValueOnce({ items: [{ number: 123 }] });
      getPullRequest.mockReturnValueOnce({
        data: {
          number: 123,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
        },
      });
      getGitLog.mockReturnValueOnce(
        await logParse.normalizeCommits([
          makeCommitFromMsg("Feature (#124)"),
          makeCommitFromMsg("I was released previously", {
            hash: "1a2b",
          }),
        ])
      );
      exec.mockReturnValueOnce("0");
      exec.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });

    test("should not omit commits in next branch", async () => {
      const gh = new Release(git, config);

      jest.spyOn(console, "log").mockImplementationOnce(() => {});
      getLatestReleaseInfo.mockReturnValueOnce({
        published_at: "2019-01-16",
      });
      searchRepo.mockReturnValueOnce({ items: [{ number: 123 }] });
      getPullRequest.mockReturnValueOnce({
        data: {
          number: 123,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
        },
      });
      getGitLog.mockReturnValueOnce(
        await logParse.normalizeCommits([
          makeCommitFromMsg("Feature (#124)"),
          makeCommitFromMsg("I wasn't released previously", {
            hash: "1a2b",
          }),
        ])
      );
      exec.mockReturnValueOnce("0");
      exec.mockImplementationOnce(() => {
        throw new Error();
      });
      exec.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });

    test("should include PR opener in authors (in case of external rebase)", async () => {
      const gh = new Release(git, config);

      const info = {
        data: {
          number: 124,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
          user: { login: "renovate" },
        },
      };

      getLatestReleaseInfo.mockReturnValueOnce({
        published_at: "2019-01-16",
      });
      searchRepo.mockReturnValueOnce({ items: [{ number: 124 }] });
      getPullRequest.mockReturnValueOnce(info);
      getGitLog.mockReturnValueOnce(
        await logParse.normalizeCommits([makeCommitFromMsg("Feature (#124)")])
      );
      getPr.mockReturnValueOnce(Promise.resolve(info));
      getUserByUsername.mockReturnValueOnce({
        name: "Renovate",
        email: "renovate@automation.com",
        login: "renovate",
      });
      exec.mockReturnValueOnce("1");

      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });

    test("should use latest title of PR", async () => {
      const gh = new Release(git, config);

      const info = {
        data: {
          number: 124,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
          user: { login: "renovate" },
          title: "Updated Title",
        },
      };

      getLatestReleaseInfo.mockReturnValueOnce({
        published_at: "2019-01-16",
      });
      searchRepo.mockReturnValueOnce({ items: [{ number: 124 }] });
      getPullRequest.mockReturnValueOnce(info);
      getGitLog.mockReturnValueOnce(
        await logParse.normalizeCommits([makeCommitFromMsg("Feature (#124)")])
      );
      getPr.mockReturnValueOnce(Promise.resolve(info));
      getUserByUsername.mockImplementationOnce(() => {
        return {
          login: "adam",
          name: "Adam Dierkens",
        };
      });
      exec.mockReturnValueOnce("1");

      expect(await gh.getCommits("12345", "1234")).toMatchSnapshot();
    });
  });

  describe("addToChangelog", () => {
    test("creates new changelog if one didn't exist - from 0", async () => {
      const gh = new Release(git, config);
      await gh.addToChangelog(
        "# My new Notes",
        "klajsdlfk4lj51l43k5hj234l",
        "v0.0.0"
      );

      expect(writeSpy.mock.calls[0][1].includes(`# My new Notes`)).toBe(true);
    });

    test("creates new changelog if one didn't exist", async () => {
      const gh = new Release(git, config);
      await gh.addToChangelog("# My new Notes", "v1.0.0", "v1.0.0");

      expect(writeSpy.mock.calls[0][1].includes(`v1.0.1`)).toBe(true);
    });

    test("creates changelog with v in versions", async () => {
      const gh = new Release(git, {
        noVersionPrefix: true,
        prereleaseBranches: ["next"],
        labels: defaultLabels,
        baseBranch: "main",
      });
      await gh.addToChangelog("# My new Notes", "1.0.0", "1.0.0");

      expect(writeSpy.mock.calls[0][1].includes(`1.0.1`)).toBe(true);
    });

    test("prepends to old changelog", async () => {
      const gh = new Release(git, config);

      existsSync.mockReturnValueOnce(true);
      readResult = "# My old Notes";

      await gh.addToChangelog(
        "# My new Notes",
        "asdfasdlkfjlkj435l2j",
        "v0.0.0"
      );
      expect(writeSpy.mock.calls[0][1].includes(readResult)).toBe(true);
    });
  });

  describe("generateReleaseNotes", () => {
    test("should default to HEAD", async () => {
      const gh = new Release(git, config);
      expect(await gh.generateReleaseNotes("1234")).toBe("");
    });

    test("should use configured HEAD", async () => {
      const gh = new Release(git, config);
      expect(await gh.generateReleaseNotes("1234", "123")).toBe("");
    });

    test("should include PR-less commits", async () => {
      const gh = new Release(git, config);

      const commits = [
        {
          hash: "1",
          authorName: "Adam Dierkens",
          authorEmail: "adam@dierkens.com",
          authors: [
            {
              name: "Adam Dierkens",
              email: "adam@dierkens.com",
            },
          ],
          subject: "I should be included\nBut this should not.",
        },
        {
          hash: "2",
          authorName: "Adam Dierkens",
          authorEmail: "adam@dierkens.com",
          authors: [
            {
              name: "Adam Dierkens",
              email: "adam@dierkens.com",
            },
          ],
          subject: "First Feature",
          pullRequest: {
            number: "1235",
          },
        },
        {
          hash: "3",
          authorName: "Adam Dierkens",
          authorEmail: "adam@dierkens.com",
          authors: [
            {
              name: "Adam Dierkens",
              email: "adam@dierkens.com",
            },
          ],
          subject: "Random Commit for pr 1235",
        },
      ];

      getGitLog.mockReturnValueOnce(commits);
      getCommitsForPR.mockReturnValueOnce(Promise.resolve(undefined));
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["minor"])));
      getCommitsForPR.mockReturnValueOnce(Promise.resolve([{ sha: "3" }]));
      graphql.mockReturnValueOnce({
        hash_1: { edges: [] },
      });

      expect(await gh.generateReleaseNotes("1234", "123")).toMatchSnapshot();
    });

    test("should get extra user data for login", async () => {
      const gh = new Release(git, config);

      const commits = [
        {
          hash: "1",
          authors: [],
          subject: "I have a login attached",
          pullRequest: {
            number: "1235",
          },
        },
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(
        Promise.resolve({
          data: { labels: [], user: { login: "adierkens" } },
        })
      );
      getUserByUsername.mockReturnValueOnce({
        login: "adierkens",
        name: "Adam Dierkens",
      });

      expect(await gh.generateReleaseNotes("1234", "123")).toMatchSnapshot();
    });

    test("should allow user to configure section headings", async () => {
      const gh = new Release(git, config);

      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
        makeCommitFromMsg("Fourth (#1237)"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["major"])));
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["minor"])));
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["documentation", "internal"]))
      );
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["patch"])));

      expect(await gh.generateReleaseNotes("1234", "123")).toMatchSnapshot();
    });

    test("should match rebased commits to PRs", async () => {
      const gh = new Release(git, config);

      getLatestReleaseInfo.mockReturnValueOnce({
        published_at: "2019-01-16",
      });
      getCommitsForPR.mockReturnValueOnce(Promise.resolve(undefined));
      // Rebased PR will have different commit SHAs than the commits in base branch
      getCommitsForPR.mockReturnValueOnce(Promise.resolve([{ sha: "1a1a" }]));

      searchRepo.mockReturnValueOnce({ items: [{ number: 123 }] });
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["minor"])));
      getPullRequest.mockReturnValueOnce({
        data: {
          number: 123,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
        },
      });
      getGitLog.mockReturnValueOnce([
        makeCommitFromMsg("Feature (#124)"),
        makeCommitFromMsg("I was rebased\n\n", {
          hash: "1a2b",
        }),
        {
          hash: "1",
          authorName: "Adam Dierkens",
          authorEmail: "adam@dierkens.com",
          subject: "I am a commit to main",
        },
      ]);
      graphql.mockReturnValueOnce({
        hash_1: { edges: [] },
      });

      expect(await gh.generateReleaseNotes("12345", "1234")).toMatchSnapshot();
    });

    test("should match commits with related PRs", async () => {
      const gh = new Release(git, config);

      getLatestReleaseInfo.mockReturnValueOnce({
        published_at: "2019-01-16",
      });
      getCommitsForPR.mockReturnValueOnce(Promise.resolve(undefined));
      // Rebased PR will have different commit SHAs than the commits in base branch
      getCommitsForPR.mockReturnValueOnce(Promise.resolve([{ sha: "1a1a" }]));

      searchRepo.mockReturnValueOnce({ items: [{ number: 123 }] });
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["minor"])));
      getPullRequest.mockReturnValueOnce({
        data: {
          number: 123,
          merge_commit_sha: "1a2b",
          labels: [{ name: "skip-release" }, { name: "minor" }],
        },
      });
      getGitLog.mockReturnValueOnce(
        await logParse.normalizeCommits([
          makeCommitFromMsg("Feature (#124)"),
          {
            hash: "1",
            files: [],
            authorName: "Adam Dierkens",
            authorEmail: "adam@dierkens.com",
            subject: "I am a commit with a related PR",
          },
        ])
      );
      searchRepo.mockReturnValueOnce({
        total_count: 1,
        items: [{ labels: [{ name: "patch" }] }],
      });

      expect(await gh.generateReleaseNotes("12345", "1234")).toMatchSnapshot();
    });

    test("should find matching PRs for shas through search", async () => {
      const gh = new Release(git, config);

      getGitLog.mockReturnValueOnce([
        makeCommitFromMsg("Doom Patrol enabled", {
          hash: "1",
        }),
        makeCommitFromMsg("Autobots roll out!", {
          hash: "2",
        }),
      ]);

      graphql.mockReturnValueOnce({
        hash_1: {
          edges: [
            {
              node: {
                state: "MERGED",
                labels: { edges: [{ node: { name: "major" } }] },
              },
            },
          ],
        },
        // PR with no label, should become patch
        hash_2: {
          edges: [{ node: { state: "MERGED", labels: undefined } }],
        },
      });

      expect(await gh.generateReleaseNotes("1234", "123")).toMatchSnapshot();
    });

    test("should ignore closed prs", async () => {
      const gh = new Release(git, config);

      getGitLog.mockReturnValueOnce([
        makeCommitFromMsg("Doom Patrol enabled", {
          hash: "1",
        }),
        makeCommitFromMsg("Autobots roll out!", {
          hash: "2",
        }),
      ]);

      graphql.mockReturnValueOnce({
        hash_1: {
          edges: [
            {
              node: {
                labels: {
                  edges: [{ node: { name: "major" } }],
                },
                state: "CLOSED",
              },
            },
          ],
        },
        // PR with no label, should become patch
        hash_2: {
          edges: [{ node: { labels: undefined, state: "MERGED" } }],
        },
      });

      expect(await gh.generateReleaseNotes("1234", "123")).toMatchSnapshot();
    });

    test("should detect pre-release branches", async () => {
      const gh = new Release(git, config);

      getGitLog.mockReturnValueOnce([
        makeCommitFromMsg("Doom Patrol enabled", {
          hash: "1",
        }),
        makeCommitFromMsg("Autobots roll out!", {
          hash: "2",
        }),
      ]);

      currentBranch.mockReturnValue("next");
      graphql.mockReturnValueOnce({
        hash_1: {
          edges: [
            {
              node: {
                labels: {
                  edges: [{ node: { name: "major" } }],
                },
                state: "CLOSED",
                headRefName: "next",
                headRepositoryOwner: {
                  login: "test",
                },
              },
            },
          ],
        },
        // PR with no label, should become patch
        hash_2: {
          edges: [{ node: { labels: undefined, state: "MERGED" } }],
        },
      });

      expect(await gh.generateReleaseNotes("1234", "123")).toMatchSnapshot();
    });

    test("should include PRs merged to other PRs", async () => {
      const gh = new Release(git, config);

      getGitLog.mockReturnValueOnce([
        makeCommitFromMsg("Doom (#12343)", {
          hash: "1",
        }),
        makeCommitFromMsg("Dino (#1235)", {
          hash: "2",
        }),
        makeCommitFromMsg("Foo Bar", {
          hash: "3",
        }),
      ]);
      getCommitsForPR.mockReturnValue(
        Promise.resolve([
          {
            sha: "2",
            commit: {},
            author: {
              name: "Adam Dierkens",
              email: "adam@dierkens.com",
            },
          },
        ])
      );
      getCommitsForPR.mockReturnValue(
        Promise.resolve([
          {
            sha: "2",
            commit: {},
            author: {
              name: "Adam Dierkens",
              email: "adam@dierkens.com",
            },
          },
        ])
      );
      getCommitsForPR.mockReturnValue(
        Promise.resolve([
          {
            sha: "3",
            commit: {},
            author: {
              name: "Adam Dierkens",
              email: "adam@dierkens.com",
            },
          },
        ])
      );
      getCommitsForPR.mockReturnValue(
        Promise.resolve([
          {
            sha: "3",
            commit: {},
            author: {
              name: "Adam Dierkens",
              email: "adam@dierkens.com",
            },
          },
        ])
      );

      expect(await gh.generateReleaseNotes("1234", "123")).toMatchSnapshot();
    });

    test("should gracefully handle failed fetches to merged PRs", async () => {
      const gh = new Release(git, config);

      const commits = await logParse.normalizeCommits([
        makeCommitFromMsg("First"),
        makeCommitFromMsg("Second (#123)"),
      ]);

      getGitLog.mockReturnValueOnce(commits);

      getCommitsForPR
        .mockReturnValueOnce(Promise.reject(new Error("bah")))
        .mockReturnValueOnce(Promise.reject(new Error("bah")));

      await expect(
        gh.generateReleaseNotes("1234", "123")
      ).resolves.toBeDefined();
    });
  });

  describe("getSemverBump", () => {
    test("default to patch", async () => {
      const gh = new Release(git, config);
      const commits = [
        makeCommitFromMsg("First"),
        makeCommitFromMsg("Second"),
        makeCommitFromMsg("Third"),
      ];

      getGitLog.mockReturnValueOnce(commits);

      expect(await gh.getSemverBump("1234")).toBe(SEMVER.patch);
    });

    test("should use higher version", async () => {
      const gh = new Release(git, config);
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second"),
        makeCommitFromMsg("Third"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["minor"])));

      expect(await gh.getSemverBump("1234", "123")).toBe(SEMVER.minor);
    });

    test("should not publish a release", async () => {
      const gh = new Release(git, config);
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["skip-release", "patch"]))
      );
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["skip-release", "patch"]))
      );
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["skip-release", "minor"]))
      );

      expect(await gh.getSemverBump("1234", "123")).toBe("");
    });

    test("should publish a release", async () => {
      const gh = new Release(git, config);
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["patch"])));
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["skip-release", "patch"]))
      );
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["skip-release", "minor"]))
      );

      expect(await gh.getSemverBump("1234", "123")).toBe(SEMVER.minor);
    });

    test("should default to publish a prepatch", async () => {
      const gh = new Release(git, config);
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["skip-release"])));
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels([])));
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels([])));

      expect(await gh.getSemverBump("1234", "123")).toBe("");
    });

    test("should not publish a release in onlyPublishWithReleaseLabel without label", async () => {
      const gh = new Release(git, {
        onlyPublishWithReleaseLabel: true,
        prereleaseBranches: ["next"],
        labels: defaultLabels,
        baseBranch: "main",
      });
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["patch"])));
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["major"])));
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["patch"])));

      expect(await gh.getSemverBump("1234", "123")).toBe("");
    });

    test("should publish a release in onlyPublishWithReleaseLabel with label", async () => {
      const gh = new Release(git, {
        onlyPublishWithReleaseLabel: true,
        prereleaseBranches: ["next"],
        labels: defaultLabels,
        baseBranch: "main",
      });
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
      ];

      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["release", "patch"]))
      );
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["patch"])));
      getPr.mockReturnValueOnce(Promise.resolve(mockLabels(["minor"])));

      expect(await gh.getSemverBump("1234", "123")).toBe(SEMVER.minor);
    });

    test("should be able to configure labels - no release", async () => {
      const customLabels = [
        ...defaultLabels,
        { name: "Version: Major", releaseType: SEMVER.major },
        { name: "Version: Minor", releaseType: SEMVER.minor },
        { name: "Version: Patch", releaseType: SEMVER.patch },
        { name: "Deploy", releaseType: "release" },
      ] as ILabelDefinition[];

      const gh = new Release(git, {
        onlyPublishWithReleaseLabel: true,
        prereleaseBranches: ["next"],
        labels: customLabels,
        baseBranch: "main",
      });
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
      ];

      // Test default labels do nothing
      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["Version: Major"]))
      );
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["Version: Patch"]))
      );
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["Version: Minor", "release"]))
      );

      expect(await gh.getSemverBump("1234", "123")).toBe("");
    });

    test("should be able to configure labels", async () => {
      const customLabels = [
        ...defaultLabels,
        { name: "Version: Major", releaseType: SEMVER.major },
        { name: "Version: Minor", releaseType: SEMVER.minor },
        { name: "Version: Patch", releaseType: SEMVER.patch },
        { name: "Deploy", releaseType: "release" },
      ] as ILabelDefinition[];

      const gh = new Release(git, {
        onlyPublishWithReleaseLabel: true,
        prereleaseBranches: ["next"],
        labels: customLabels,
        baseBranch: "main",
      });
      const commits = [
        makeCommitFromMsg("First (#1234)"),
        makeCommitFromMsg("Second (#1235)"),
        makeCommitFromMsg("Third (#1236)"),
      ];

      // Test deploy label creates release
      getGitLog.mockReturnValueOnce(commits);
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["Version: Minor", "Deploy"]))
      );
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["Version: Major"]))
      );
      getPr.mockReturnValueOnce(
        Promise.resolve(mockLabels(["Version: Patch"]))
      );

      expect(await gh.getSemverBump("1234", "123")).toBe(SEMVER.major);
    });
  });

  describe("addLabelsToProject", () => {
    test("should add labels", async () => {
      const gh = new Release(git, config);
      const customLabels: ILabelDefinition[] = [
        { name: "1", description: "major", releaseType: SEMVER.major },
        { name: "2", description: "minor", releaseType: SEMVER.minor },
        { name: "3", description: "patch", releaseType: SEMVER.patch },
      ];

      await gh.addLabelsToProject(customLabels);

      expect(createLabel).toHaveBeenCalledWith({
        name: "1",
        description: "major",
        releaseType: SEMVER.major,
      });
      expect(createLabel).toHaveBeenCalledWith({
        name: "2",
        description: "minor",
        releaseType: SEMVER.minor,
      });
      expect(createLabel).toHaveBeenCalledWith({
        name: "3",
        description: "patch",
        releaseType: SEMVER.patch,
      });
    });

    test("should log that it has created the labels", async () => {
      const mockLogger = dummyLog();
      jest.spyOn(mockLogger.log, "log").mockImplementation();

      const gh = new Release(
        git,
        {
          prereleaseBranches: ["next"],
          labels: defaultLabels,
          baseBranch: "main",
        },
        mockLogger
      );

      const labels: ILabelDefinition[] = [
        { name: "3", description: "three", releaseType: SEMVER.patch },
      ];

      await gh.addLabelsToProject(labels);

      expect(mockLogger.log.log).toHaveBeenCalledWith("Created labels: 3");
      expect(mockLogger.log.log).toHaveBeenCalledWith(
        "\nYou can see these, and more at https://github.com/web/site/labels"
      );
    });

    test("should not add old labels", async () => {
      const gh = new Release(git, config);
      const labels: ILabelDefinition[] = [
        { name: "1", description: "major", releaseType: SEMVER.major },
        { name: "2", description: "minor", releaseType: SEMVER.minor },
      ];

      getProjectLabels.mockReturnValueOnce(["1"]);
      await gh.addLabelsToProject(labels);

      expect(updateLabel).toHaveBeenCalledWith({
        name: "1",
        description: "major",
        releaseType: SEMVER.major,
      });
      expect(createLabel).toHaveBeenCalledWith({
        description: "minor",
        name: "2",
        releaseType: SEMVER.minor,
      });
    });

    test("should not add old labels - case sensitive", async () => {
      const gh = new Release(git, config);
      const labels: ILabelDefinition[] = [
        { name: "major", description: "", releaseType: SEMVER.major },
        { name: "Minor", description: "", releaseType: SEMVER.minor },
      ];

      getProjectLabels.mockReturnValueOnce(["Major", "minor"]);
      await gh.addLabelsToProject(labels);

      expect(updateLabel).toHaveBeenCalledWith({
        name: "major",
        description: "",
        releaseType: SEMVER.major,
      });
      expect(updateLabel).toHaveBeenCalledWith({
        description: "",
        name: "Minor",
        releaseType: SEMVER.minor,
      });
    });

    test("should add release label in onlyPublishWithReleaseLabel mode", async () => {
      let gh = new Release(git, {
        prereleaseBranches: ["next"],
        labels: defaultLabels,
        baseBranch: "main",
      });
      const labels: ILabelDefinition[] = [
        {
          name: "deploy",
          description: "release the code",
          releaseType: "release",
        },
      ];

      await gh.addLabelsToProject(labels);
      expect(createLabel).not.toHaveBeenCalledWith({
        name: "deploy",
        description: "release the code",
        releaseType: "release",
      });

      gh = new Release(git, {
        onlyPublishWithReleaseLabel: true,
        prereleaseBranches: ["next"],
        labels: defaultLabels,
        baseBranch: "main",
      });
      await gh.addLabelsToProject(labels);
      expect(createLabel).toHaveBeenCalledWith({
        name: "deploy",
        description: "release the code",
        releaseType: "release",
      });
    });

    test("should add skip-release label not in onlyPublishWithReleaseLabel mode", async () => {
      let gh = new Release(git, {
        onlyPublishWithReleaseLabel: true,
        prereleaseBranches: ["next"],
        labels: defaultLabels,
        baseBranch: "main",
      });
      const labels: ILabelDefinition[] = [
        {
          name: "no!",
          description: "Do not create a release",
          releaseType: "skip",
        },
      ];

      await gh.addLabelsToProject(labels);
      expect(createLabel).not.toHaveBeenCalledWith({
        name: "no!",
        description: "Do not create a release",
        releaseType: "skip",
      });

      gh = new Release(git, {
        prereleaseBranches: ["next"],
        labels: defaultLabels,
        baseBranch: "main",
      });
      await gh.addLabelsToProject(labels);
      expect(createLabel).toHaveBeenCalledWith({
        description: "Do not create a release",
        name: "no!",
        releaseType: "skip",
      });
    });
  });
});
