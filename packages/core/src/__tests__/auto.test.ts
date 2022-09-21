import { Auto } from "../auto";
import { IPRStatusOptions } from "../auto-args";
import SEMVER from "../semver";
import { dummyLog } from "../utils/logger";
import makeCommitFromMsg from "./make-commit-from-msg";
import { loadPlugin } from "../utils/load-plugins";
import child from "child_process";
import execPromise from "../utils/exec-promise";

const exec = jest.fn();
jest.mock("../utils/exec-promise");
// @ts-ignore
execPromise.mockImplementation(exec);
exec.mockResolvedValue("");

const importMock = jest.fn();

jest.mock("../utils/git-reset.ts");
jest.mock("../utils/load-plugins.ts");
jest.mock("../utils/verify-auth.ts", () => () => true);
jest.mock("import-cwd", () => (path: string) => importMock(path));
jest.mock("env-ci", () => () => ({ isCi: false, branch: "main" }));

const defaults = {
  baseBranch: "main",
  owner: "foo",
  repo: "bar",
};

process.env.GH_TOKEN = "XXXX";

const labels = [
  { name: "Version: Major", releaseType: SEMVER.major, overwrite: true },
  { name: "Version: Patch", releaseType: SEMVER.patch, overwrite: true },
  { name: "Version: Minor", releaseType: SEMVER.minor, overwrite: true },
];

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

describe("Auto", () => {
  beforeEach(() => {
    // @ts-ignore
    loadPlugin.mockClear();

    jest
      .spyOn(child, "execSync")
      .mockImplementation()
      // @ts-ignore
      .mockReturnValue("");
  });

  test("should use args", async () => {
    const auto = new Auto(defaults);
    auto.logger = dummyLog();
    await auto.loadConfig();
    expect(auto.release).toBeDefined();
  });

  test("should load config", async () => {
    search.mockReturnValueOnce({ config: defaults });
    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();
    expect(auto.release).toBeDefined();
  });

  test("should set default baseBranch", async () => {
    search.mockReturnValueOnce({
      config: defaults,
    });

    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();
    expect(auto.baseBranch).toBe("main");
  });

  test("should set custom baseBranch", async () => {
    search.mockReturnValueOnce({
      config: {
        ...defaults,
        baseBranch: "production",
      },
    });

    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();
    expect(auto.baseBranch).toBe("production");
    expect(auto.config?.baseBranch).toBe("production");
  });

  test("should default to npm in non-pkg", async () => {
    search.mockReturnValueOnce({ config: defaults });
    // @ts-ignore
    loadPlugin.mockReturnValueOnce(() => ({ apply: () => {} }));

    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();

    // @ts-ignore
    expect(loadPlugin.mock.calls[1][0][0]).toBe("npm");
  });

  test("should default to git-tag in pkg", async () => {
    // @ts-ignore
    process.pkg = true;
    search.mockReturnValueOnce({ config: defaults });
    // @ts-ignore
    loadPlugin.mockReturnValueOnce(() => ({ apply: () => {} }));

    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();

    // @ts-ignore
    expect(loadPlugin.mock.calls[1][0][0]).toBe("git-tag");
    // @ts-ignore
    process.pkg = undefined;
  });

  test("should throw if no GH_TOKEN set", async () => {
    const auto = new Auto();
    auto.logger = dummyLog();
    // @ts-ignore
    auto.getRepo = () => ({});
    process.env.GH_TOKEN = undefined;
    await expect(auto.loadConfig()).rejects.toBeInstanceOf(Error);
    process.env.GH_TOKEN = "XXXX";
  });

  test("should extend config", async () => {
    search.mockReturnValueOnce({ config: { ...defaults, extends: "@artsy" } });
    importMock.mockImplementation((path) =>
      path === "@artsy/auto-config/package.json"
        ? { auto: { onlyPublishWithReleaseLabel: true } }
        : undefined
    );

    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();
    expect(auto.release!.config).toMatchSnapshot();
  });

  test("should exit with errors in config", async () => {
    search.mockReturnValueOnce({ config: { name: 123 } });
    process.exit = jest.fn() as any;
    const auto = new Auto({ owner: "foo", repo: "bar" });
    auto.logger = dummyLog();
    await auto.loadConfig();
    expect(process.exit).toHaveBeenCalled();
  });

  test("should extend local config", async () => {
    const orig = process.cwd;
    process.cwd = () => "/foo/";
    search.mockReturnValueOnce({
      config: { ...defaults, extends: "./fake.json" },
    });
    importMock.mockImplementation((path) =>
      path === "/foo/fake.json" ? { noVersionPrefix: true } : undefined
    );

    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();
    expect(auto.release!.config).toMatchSnapshot();
    process.cwd = orig;
  });

  test("should use labels from config config", async () => {
    search.mockReturnValueOnce({
      config: { ...defaults, labels },
    });
    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();

    expect([...auto.semVerLabels!.values()]).toStrictEqual([
      ["Version: Major"],
      ["Version: Patch"],
      ["Version: Minor"],
      ["skip-release"],
      ["release"],
      ["internal", "documentation", "tests", "dependencies"],
    ]);
  });

  test("should be able to add label as string", async () => {
    search.mockReturnValueOnce({
      config: {
        ...defaults,
        labels: [
          {
            name: "feature",
            releaseType: SEMVER.minor,
          },
        ],
      },
    });

    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();

    expect(auto.config!.labels.find((l) => l.name === "feature")).toStrictEqual(
      {
        description: "Increment the minor version when merged",
        color: "#F1A60E",
        name: "feature",
        changelogTitle: "🚀 Enhancement",
        releaseType: SEMVER.minor,
      }
    );
  });

  test("should be able to omit properties from label definition", async () => {
    search.mockReturnValueOnce({
      config: {
        ...defaults,
        labels: [{ name: "minor", description: "This is a test" }],
      },
    });
    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();

    expect(
      auto.config!.labels.find((l) => l.description === "This is a test")
    ).toStrictEqual({
      description: "This is a test",
      color: "#F1A60E",
      name: "minor",
      changelogTitle: "🚀 Enhancement",
      releaseType: SEMVER.minor,
    });
  });

  test("arbitrary labels should be able to omit name", async () => {
    search.mockReturnValueOnce({
      config: {
        ...defaults,
        labels: [
          {
            name: "fooBar",
            description: "This is a test",
          },
        ],
      },
    });
    const auto = new Auto();
    auto.logger = dummyLog();
    await auto.loadConfig();

    expect(auto.config!.labels.find((l) => l.name === "fooBar")).toStrictEqual({
      description: "This is a test",
      name: "fooBar",
    });
  });

  describe("createLabels", () => {
    test("should throw when not initialized", async () => {
      search.mockReturnValueOnce({
        config: { ...defaults, labels },
      });
      const auto = new Auto();
      auto.logger = dummyLog();
      await expect(auto.createLabels()).rejects.not.toBeUndefined();
    });

    test("should create the labels", async () => {
      search.mockReturnValueOnce({
        config: { ...defaults, labels },
      });
      const auto = new Auto();
      auto.logger = dummyLog();
      await auto.loadConfig();

      jest.spyOn(auto.release!, "addLabelsToProject").mockImplementation();
      await auto.createLabels();
      expect(auto.release!.addLabelsToProject).toMatchSnapshot();
    });
  });

  describe("label", () => {
    test("should throw when not initialized", async () => {
      search.mockReturnValueOnce({
        config: { ...defaults, labels },
      });
      const auto = new Auto();
      auto.logger = dummyLog();
      await expect(auto.label({ pr: 13 })).rejects.not.toBeUndefined();
    });

    test("should get labels", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const getLabels = jest.fn();
      auto.git!.getLabels = getLabels;
      getLabels.mockReturnValueOnce(["foo"]);
      jest.spyOn(console, "log").mockImplementation();

      await auto.label({ pr: 13 });
      expect(console.log).toHaveBeenCalledWith("foo");
    });

    test("should check for a given label", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const getLabels = jest.fn();
      auto.git!.getLabels = getLabels;
      getLabels.mockReturnValueOnce(["foo"]);
      jest.spyOn(console, "log").mockImplementation();

      await auto.label({ pr: 13, exists: "foo" });
      expect(console.log).toHaveBeenCalledWith("foo");
    });

    test("should throw if a check for a label fails", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const getLabels = jest.fn();
      auto.git!.getLabels = getLabels;
      getLabels.mockReturnValueOnce(["bar"]);
      jest.spyOn(console, "log").mockImplementation();

      await expect(auto.label({ pr: 13, exists: "foo" })).rejects.toThrow();
    });

    test("should get labels for last merged PR", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();

      const getPullRequests = jest.fn();
      auto.git!.getPullRequests = getPullRequests;
      getPullRequests.mockReturnValueOnce([
        {
          merged_at: "2019-01-08T03:45:33.000Z",
          labels: [{ name: "wubbalublub" }],
        },
        {
          merged_at: "2019-01-10T03:45:33.000Z",
          labels: [{ name: "foo" }, { name: "bar" }],
        },
      ]);
      jest.spyOn(console, "log").mockImplementation();

      await auto.label();
      expect(console.log).toHaveBeenCalledWith("foo\nbar");
    });

    test("should do nothing when no last merge found", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();

      const getPullRequests = jest.fn();
      auto.git!.getPullRequests = getPullRequests;
      getPullRequests.mockReturnValueOnce([]);
      jest.spyOn(console, "log").mockImplementation().mockReset();

      await auto.label();
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("pr", () => {
    let createStatus: jest.Mock;

    beforeEach(() => {
      createStatus = jest.fn();
    });

    const required: IPRStatusOptions = {
      url: "https://google.com",
      state: "pending",
      description: "foo",
      context: "bar",
    };

    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await expect(auto.prStatus(required)).rejects.not.toBeUndefined();
    });

    test("should catch exceptions when status fails to post", async () => {
      const auto = new Auto(defaults);

      process.exit = jest.fn() as any;
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      await auto.prStatus({ ...required, sha: "1234" });
      expect(process.exit).toHaveBeenCalled();
      expect(createStatus).toHaveBeenCalled();
    });

    test("should do nothing", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();

      await auto.prStatus({ ...required, sha: "1234", dryRun: true });
      expect(createStatus).not.toHaveBeenCalled();
    });

    test("should use provided SHA", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      await auto.prStatus({ ...required, sha: "1234" });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: "1234",
        })
      );
    });

    test("should use HEAD SHA", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      const getSha = jest.fn();
      auto.git!.getSha = getSha;
      getSha.mockReturnValueOnce("abc");

      await auto.prStatus({ ...required });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: "abc",
        })
      );
    });

    test("should use lookup SHA for PR", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      const getPullRequest = jest.fn();
      auto.git!.getPullRequest = getPullRequest;
      getPullRequest.mockReturnValueOnce({ data: { head: { sha: "deep" } } });

      await auto.prStatus({ ...required, pr: 14 });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          sha: "deep",
        })
      );
    });
  });

  describe("pr-check", () => {
    jest.setTimeout(10 * 1000);
    let createStatus: jest.Mock;

    beforeEach(() => {
      createStatus = jest.fn();
    });

    const required = {
      url: "https://google.com",
    };

    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await expect(
        auto.prCheck({ pr: 13, ...required })
      ).rejects.not.toBeUndefined();
    });

    test("should do nothing with dryRun", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      await auto.prCheck({ ...required, pr: 13, dryRun: true });
      expect(createStatus).not.toHaveBeenCalled();
    });

    test("should catch errors", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      await auto.prCheck({ ...required, pr: 13 });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          state: "error",
        })
      );
    });

    test("should catch status errors", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.createStatus = createStatus;
      createStatus.mockRejectedValueOnce({ status: 123 });

      await expect(
        auto.prCheck({ ...required, pr: 13 })
      ).rejects.toBeInstanceOf(Error);
      expect(createStatus).toHaveBeenCalled();
    });

    test("should error with no label", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      const getPullRequest = jest.fn();
      auto.git!.getPullRequest = getPullRequest;
      getPullRequest.mockReturnValueOnce({ data: { head: { sha: "sha" } } });

      const getLabels = jest.fn();
      auto.git!.getLabels = getLabels;
      getLabels.mockReturnValueOnce([]);

      await auto.prCheck({ ...required, pr: 13 });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "No semver label!",
        })
      );
    });

    test("should pass with semver label", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      const getPullRequest = jest.fn();
      auto.git!.getPullRequest = getPullRequest;
      getPullRequest.mockReturnValueOnce({ data: { head: { sha: "sha" } } });

      const getLabels = jest.fn();
      auto.git!.getLabels = getLabels;
      getLabels.mockReturnValueOnce(["major"]);

      await auto.prCheck({ ...required, pr: 13 });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "CI - major",
        })
      );
    });

    test("should pass with skip release label", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      const getPullRequest = jest.fn();
      auto.git!.getPullRequest = getPullRequest;
      getPullRequest.mockReturnValueOnce({ data: { head: { sha: "sha" } } });

      const getLabels = jest.fn();
      auto.git!.getLabels = getLabels;
      getLabels.mockReturnValueOnce(["major", "skip-release"]);

      await auto.prCheck({ ...required, pr: 13 });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "PR will not create a release",
        })
      );
    });

    test("should pass with release label", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      const getPullRequest = jest.fn();
      auto.git!.getPullRequest = getPullRequest;
      getPullRequest.mockReturnValueOnce({ data: { head: { sha: "sha" } } });

      const getLabels = jest.fn();
      auto.git!.getLabels = getLabels;
      getLabels.mockReturnValueOnce(["major", "release"]);

      await auto.prCheck({ ...required, pr: 13 });
      expect(createStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "PR will create release once merged - major",
        })
      );
    });
  });

  describe("comment", () => {
    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await expect(
        auto.comment({ pr: 10, message: "foo" })
      ).rejects.not.toBeUndefined();
    });

    test("should make a comment", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const createComment = jest.fn();
      auto.git!.createComment = createComment;

      await auto.comment({ pr: 10, message: "foo" });
      expect(createComment).toHaveBeenCalled();
    });

    test("should delete a comment", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const deleteComment = jest.fn();
      auto.git!.deleteComment = deleteComment;

      await auto.comment({ pr: 10, delete: true });
      expect(deleteComment).toHaveBeenCalled();
    });

    test("should edit a comment", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const editComment = jest.fn();
      auto.git!.editComment = editComment;

      await auto.comment({ pr: 10, message: "foo", edit: true });
      expect(editComment).toHaveBeenCalled();
    });

    test("should not delete a comment in dry run mode", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const deleteComment = jest.fn();
      auto.git!.deleteComment = deleteComment;
      const editComment = jest.fn();
      auto.git!.editComment = editComment;

      await auto.comment({ pr: 10, message: "foo bar", dryRun: true });
      expect(deleteComment).not.toHaveBeenCalled();

      await auto.comment({ pr: 10, delete: true, dryRun: true });
      expect(deleteComment).not.toHaveBeenCalled();

      await auto.comment({
        pr: 10,
        message: "foo bar",
        edit: true,
        dryRun: true,
      });
      expect(deleteComment).not.toHaveBeenCalled();
      expect(editComment).not.toHaveBeenCalled();
    });
  });

  describe("prBody", () => {
    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await expect(
        auto.prBody({ pr: 10, message: "foo" })
      ).rejects.not.toBeUndefined();
    });

    test("should make a pr body update", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const addToPrBody = jest.fn();
      auto.git!.addToPrBody = addToPrBody;

      await auto.prBody({ pr: 10, message: "foo" });
      expect(addToPrBody).toHaveBeenCalled();
    });

    test("should delete old pr body update", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const addToPrBody = jest.fn();
      auto.git!.addToPrBody = addToPrBody;

      await auto.prBody({ pr: 10, delete: true });
      expect(addToPrBody).toHaveBeenCalledWith("", 10, "default");
    });

    test("should not update pr body a dry run mode", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      const addToPrBody = jest.fn();
      auto.git!.addToPrBody = addToPrBody;

      await auto.prBody({ pr: 10, message: "foo bar", dryRun: true });
      expect(addToPrBody).not.toHaveBeenCalled();

      await auto.prBody({ pr: 10, delete: true, dryRun: true });
      expect(addToPrBody).not.toHaveBeenCalled();
    });
  });

  describe("version", () => {
    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await expect(auto.version()).rejects.not.toBeUndefined();
    });

    test("should calculate version with default options", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      jest
        .spyOn(auto.git!, "getLatestRelease")
        .mockImplementation(() => Promise.resolve("v1.2.3"));
      jest
        .spyOn(auto.release!, "getSemverBump")
        .mockImplementation(() => Promise.resolve(SEMVER.patch));
      jest.spyOn(console, "log").mockImplementation();

      await auto.version();
      expect(auto.release!.getSemverBump).toHaveBeenCalledWith("v1.2.3");
      expect(console.log).toHaveBeenCalledWith("patch");
    });

    test("should calculate version with from option", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();
      await auto.loadConfig();

      jest
        .spyOn(auto.git!, "getLatestRelease")
        .mockImplementation(() => Promise.resolve("v1.2.3"));
      jest
        .spyOn(auto.release!, "getSemverBump")
        .mockImplementation(() => Promise.resolve(SEMVER.minor));
      jest.spyOn(console, "log").mockImplementation();

      await auto.version({ from: "v1.1.0" });
      expect(auto.release!.getSemverBump).toHaveBeenCalledWith("v1.1.0");
      expect(console.log).toHaveBeenCalledWith("minor");
    });
  });

  describe("changelog", () => {
    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      await expect(auto.changelog()).rejects.not.toBeUndefined();
    });

    test("should do nothing on a dryRun", async () => {
      const auto = new Auto(defaults);

      auto.logger = dummyLog();
      await auto.loadConfig();

      const addToChangelog = jest.fn();
      auto.release!.addToChangelog = addToChangelog;
      jest.spyOn(auto.release!, "generateReleaseNotes").mockImplementation();

      await auto.changelog({ from: "v1.0.0", dryRun: true });
      expect(addToChangelog).not.toHaveBeenCalled();
    });

    test("should not commit on noGitCommit", async () => {
      const auto = new Auto(defaults);

      auto.logger = dummyLog();
      await auto.loadConfig();

      const addToChangelog = jest.fn();
      auto.release!.addToChangelog = addToChangelog;
      const beforeCommitChangelog = jest.fn();
      auto.hooks.beforeCommitChangelog.tap("test", beforeCommitChangelog);
      jest.spyOn(auto.release!, "generateReleaseNotes").mockImplementation();

      await auto.changelog({ from: "v1.0.0", noGitCommit: true });
      expect(addToChangelog).toHaveBeenCalled();
      expect(beforeCommitChangelog).not.toHaveBeenCalled();
    });

    test("should be able to override title", async () => {
      const auto = new Auto(defaults);

      auto.logger = dummyLog();
      await auto.loadConfig();

      const addToChangelog = jest.fn();
      auto.release!.addToChangelog = addToChangelog;
      jest.spyOn(auto.release!, "generateReleaseNotes").mockImplementation();

      await auto.changelog({ from: "v1.0.0", dryRun: true, title: "foo" });
      // @ts-ignore
      expect(await auto.release?.hooks.createChangelogTitle.promise()).toBe(
        "foo"
      );
    });

    test("should skip getRepository hook if passed in via cli", async () => {
      process.env.GH_TOKEN = "XXXX";
      const auto = new Auto({
        repo: "test",
        owner: "adierkens",
      });
      auto.logger = dummyLog();

      const hookFn = jest.fn();
      auto.hooks.getRepository.tap("test", hookFn);
      await auto.loadConfig();
      await auto.prStatus({
        url: "foo.bar",
        state: "pending",
        description: "Waiting for stuffs",
        context: "tests",
        dryRun: true,
      });

      expect(hookFn).not.toHaveBeenCalled();
    });
  });

  describe("release", () => {
    test("should exit when no tags found", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      const exit = jest.fn();

      // @ts-ignore
      process.exit = exit;

      auto.logger = dummyLog();
      await auto.loadConfig();

      auto.git!.getLatestRelease = () => Promise.resolve("");
      auto.git!.getLatestTagInBranch = () =>
        Promise.reject(new Error("No names found, cannot describe anything."));

      await auto.runRelease();
      expect(exit).toHaveBeenCalled();
    });

    test("should publish with default options", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");

      jest.spyOn(auto.git!, "publish").mockReturnValueOnce({ data: {} } as any);
      jest
        .spyOn(auto.release!, "generateReleaseNotes")
        .mockImplementation(() => Promise.resolve("releaseNotes"));
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      auto.hooks.getPreviousVersion.tap("test", () => "1.2.4");
      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.runRelease();
      expect(auto.release!.generateReleaseNotes).toHaveBeenCalledWith(
        "v1.2.3",
        undefined,
        undefined
      );
      expect(auto.git!.publish).toHaveBeenCalledWith(
        "releaseNotes",
        "v1.2.4",
        false,
        ""
      );
      expect(afterRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          lastRelease: "v1.2.3",
          newVersion: "v1.2.4",
        })
      );
    });


    test("should use --to commit target", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");

      jest.spyOn(auto.git!, "publish").mockReturnValueOnce({ data: {} } as any);
      jest
        .spyOn(auto.release!, "generateReleaseNotes")
        .mockImplementation(() => Promise.resolve("releaseNotes"));
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      auto.hooks.getPreviousVersion.tap("test", () => "1.2.4");
      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.runRelease({ to: 'abc'});

      expect(auto.git!.publish).toHaveBeenCalledWith(
        "releaseNotes",
        "v1.2.4",
        false,
        "abc"
      );
    });

    test("should publish to a tag", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");

      jest.spyOn(auto.git!, "publish").mockReturnValueOnce({ data: {} } as any);
      jest
        .spyOn(auto.release!, "generateReleaseNotes")
        .mockImplementation(() => Promise.resolve("releaseNotes"));
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      auto.hooks.getPreviousVersion.tap("test", () => "1.2.4");
      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.runRelease({ to: "v1.2.5" });
      expect(auto.release!.generateReleaseNotes).toHaveBeenCalledWith(
        "v1.2.3",
        "v1.2.5",
        undefined
      );
    });

    test("should a prerelease", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      auto.logger = dummyLog();
      await auto.loadConfig();

      auto.git!.getPreviousTagInBranch = () => Promise.resolve("1.2.3");
      auto.git!.getLatestTagInBranch = () => Promise.resolve("1.2.4");

      jest.spyOn(auto.git!, "publish").mockReturnValueOnce({ data: {} } as any);
      jest
        .spyOn(auto.release!, "generateReleaseNotes")
        .mockImplementation(() => Promise.resolve("releaseNotes"));
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      auto.hooks.getPreviousVersion.tap("test", () => "1.2.4");
      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.runRelease({ prerelease: true });
      expect(auto.release!.generateReleaseNotes).toHaveBeenCalledWith(
        "v1.2.3",
        undefined,
        undefined
      );
      expect(auto.git!.publish).toHaveBeenCalledWith(
        "releaseNotes",
        "v1.2.4",
        true,
        ""
      );
      expect(afterRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          lastRelease: "v1.2.3",
          newVersion: "v1.2.4",
        })
      );
    });

    test("should publish with lastRelease using from option", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");

      jest.spyOn(auto.git!, "publish").mockReturnValueOnce({ data: {} } as any);
      jest
        .spyOn(auto.release!, "generateReleaseNotes")
        .mockImplementation(() => Promise.resolve("releaseNotes"));
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      auto.hooks.getPreviousVersion.tap("test", () => "1.2.4");
      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.runRelease({
        from: "v1.2.0",
      });
      expect(auto.release!.generateReleaseNotes).toHaveBeenCalledWith(
        "v1.2.0",
        undefined,
        undefined
      );
      expect(auto.git!.publish).toHaveBeenCalledWith(
        "releaseNotes",
        "v1.2.4",
        false,
        ""
      );
      expect(afterRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          lastRelease: "v1.2.0",
          newVersion: "v1.2.4",
        })
      );
    });

    test("should publish with newVersion using useVersion option", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");

      jest.spyOn(auto.git!, "publish").mockReturnValueOnce({ data: {} } as any);
      jest
        .spyOn(auto.release!, "generateReleaseNotes")
        .mockImplementation(() => Promise.resolve("releaseNotes"));
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      auto.hooks.getPreviousVersion.tap("test", () => "1.2.4");
      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.runRelease({
        useVersion: "v1.3.0",
      });
      expect(auto.release!.generateReleaseNotes).toHaveBeenCalledWith(
        "v1.2.3",
        undefined,
        undefined
      );
      expect(auto.git!.publish).toHaveBeenCalledWith(
        "releaseNotes",
        "v1.3.0",
        false,
        ""
      );
      expect(afterRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          lastRelease: "v1.2.3",
          newVersion: "v1.3.0",
        })
      );
    });

    test("should publish with newVersion using useVersion option with semver build part", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");

      jest.spyOn(auto.git!, "publish").mockReturnValueOnce({ data: {} } as any);
      jest
        .spyOn(auto.release!, "generateReleaseNotes")
        .mockImplementation(() => Promise.resolve("releaseNotes"));
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      auto.hooks.getPreviousVersion.tap("test", () => "1.2.4");
      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.runRelease({
        useVersion: "1.2.3+1",
      });
      expect(auto.release!.generateReleaseNotes).toHaveBeenCalledWith(
        "v1.2.3",
        undefined,
        undefined
      );
      expect(auto.git!.publish).toHaveBeenCalledWith(
        "releaseNotes",
        "v1.2.3+1",
        false,
        ""
      );
      expect(afterRelease).toHaveBeenCalledWith(
        expect.objectContaining({
          lastRelease: "v1.2.3",
          newVersion: "v1.2.3+1",
        })
      );
    });
  });

  describe("canary", () => {
    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();

      await expect(auto.canary()).rejects.not.toBeUndefined();
    });

    test("calls the canary hook with the pr info", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);

      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.git!.getSha = () => Promise.resolve("abc");
      jest.spyOn(auto.git!, "addToPrBody").mockImplementation();
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);
      const canary = jest.fn();
      canary.mockReturnValueOnce("1.2.3");
      auto.hooks.canary.tap("test", canary);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.canary({ pr: 123, build: 1 });
      expect(canary).toHaveBeenCalledWith(
        expect.objectContaining({
          bump: SEMVER.patch,
          canaryIdentifier: "-canary.123.1",
        })
      );
      expect(auto.git!.addToPrBody).toHaveBeenCalled();
    });

    test("adds sha if no pr or build number is found", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.git!.getSha = () => Promise.resolve("abc");
      jest.spyOn(auto.git!, "addToPrBody").mockImplementation();
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);
      const canary = jest.fn();
      auto.hooks.canary.tap("test", canary);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.canary();
      expect(canary).toHaveBeenCalledWith(
        expect.objectContaining({
          bump: SEMVER.patch,
          canaryIdentifier: "-canary.abc",
        })
      );
    });

    test("doesn't comment if there is an error", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      jest.spyOn(auto, "prBody").mockImplementation();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.git!.getSha = () => Promise.resolve("abc");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      const canary = jest.fn();
      canary.mockReturnValue({ error: "ooops" });
      auto.hooks.canary.tap("test", canary);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.canary({ pr: 123, build: 1 });
      expect(auto.prBody).not.toHaveBeenCalled();
    });

    test("defaults to sha when run locally", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();

      auto.git!.getSha = () => Promise.resolve("abcd");
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);
      const canary = jest.fn();
      auto.hooks.canary.tap("test", canary);

      await auto.canary();
      expect(canary).toHaveBeenCalledWith(
        expect.objectContaining({
          bump: SEMVER.patch,
          canaryIdentifier: "-canary.abcd",
        })
      );
    });

    test('should not publish when is present "skip-release" label', async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();

      auto.git!.getSha = () => Promise.resolve("abcd");
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([
          makeCommitFromMsg("Test Commit", {
            labels: ["skip-release"],
          }),
        ]);
      const canary = jest.fn();
      auto.hooks.canary.tap("test", canary);

      await auto.canary();
      expect(canary).not.toHaveBeenCalled();
    });

    test("should publish with --force and skip-release label", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();

      auto.git!.getSha = () => Promise.resolve("abcd");
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([
          makeCommitFromMsg("Test Commit", {
            labels: ["skip-release"],
          }),
        ]);
      const canary = jest.fn();
      auto.hooks.canary.tap("test", canary);

      await auto.canary({ force: true });
      expect(canary).toHaveBeenCalledWith(
        expect.objectContaining({
          bump: SEMVER.patch,
          canaryIdentifier: "-canary.abcd",
        })
      );
    });
  });

  describe("next", () => {
    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();

      await expect(auto.next({})).rejects.not.toBeUndefined();
    });

    test("calls the next hook with the release info", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });

      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.remote = "origin";
      auto.git!.publish = () => Promise.resolve({ data: {} } as any);
      auto.git!.getLatestTagInBranch = () => Promise.resolve("1.2.3");
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.release!.generateReleaseNotes = () => Promise.resolve("notes");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      auto.hooks.next.tap("test", () => ["1.2.4-next.0"]);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.next({});
      expect(afterRelease).toHaveBeenCalled();
    });

    test("falls back to first commit when there are no tags", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });

      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.remote = "origin";
      auto.git!.publish = () => Promise.resolve({ data: {} } as any);
      auto.git!.getLastTagNotInBaseBranch = () =>
        Promise.reject(new Error("Test"));
      auto.git!.getLatestTagInBranch = () => Promise.reject(new Error("Test"));
      auto.git!.getLatestRelease = () => Promise.resolve("abcd");
      auto.release!.generateReleaseNotes = () => Promise.resolve("notes");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([makeCommitFromMsg("Test Commit")]);

      const afterRelease = jest.fn();
      auto.hooks.afterRelease.tap("test", afterRelease);
      auto.hooks.next.tap("test", () => ["1.2.4-next.0"]);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.next({});
      expect(afterRelease).toHaveBeenCalled();
    });

    test("respects none release labels", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });

      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.remote = "origin";
      auto.git!.publish = () => Promise.resolve({ data: {} } as any);
      auto.git!.getLastTagNotInBaseBranch = () =>
        Promise.reject(new Error("Test"));
      auto.git!.getLatestTagInBranch = () => Promise.reject(new Error("Test"));
      auto.git!.getLatestRelease = () => Promise.resolve("abcd");
      auto.release!.generateReleaseNotes = () => Promise.resolve("notes");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([
          makeCommitFromMsg("Test Commit", { labels: ["skip-release"] }),
        ]);

      const next = jest.fn();
      auto.hooks.next.tap("test", next);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.next({});
      expect(next).not.toHaveBeenCalled();
    });

    test("can --force release", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });

      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.remote = "origin";
      auto.git!.publish = () => Promise.resolve({ data: {} } as any);
      auto.git!.getLastTagNotInBaseBranch = () =>
        Promise.reject(new Error("Test"));
      auto.git!.getLatestTagInBranch = () => Promise.reject(new Error("Test"));
      auto.git!.getLatestRelease = () => Promise.resolve("abcd");
      auto.release!.generateReleaseNotes = () => Promise.resolve("notes");
      auto.release!.getCommitsInRelease = () =>
        Promise.resolve([
          makeCommitFromMsg("Test Commit", { labels: ["skip-release"] }),
        ]);

      const next = jest.fn();
      auto.hooks.next.tap("test", next);
      jest.spyOn(auto.release!, "getCommits").mockImplementation();

      await auto.next({ force: true });
      expect(next).toHaveBeenCalled();
    });
  });

  describe("shipit", () => {
    test("should throw when not initialized", async () => {
      const auto = new Auto(defaults);
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();

      await expect(auto.shipit()).rejects.not.toBeUndefined();
    });

    test("should not publish when no latest version found", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();

      auto.release!.getCommitsInRelease = () => Promise.resolve([]);
      auto.git!.getLatestRelease = () => Promise.resolve("");
      auto.release!.getSemverBump = () => Promise.resolve(SEMVER.noVersion);
      const afterShipIt = jest.fn();
      auto.hooks.afterShipIt.tap("test", afterShipIt);

      await auto.shipit();
      expect(afterShipIt).not.toHaveBeenCalled();
    });

    test("should publish to latest on base branch", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.remote = "https://github.com/intuit/auto";

      // @ts-ignore
      auto.makeChangelog = () => Promise.resolve();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.git!.publish = () =>
        Promise.resolve({
          data: { html_url: "https://github.com/my/repo/release" },
        } as any);
      jest.spyOn(auto.release!, "getCommitsInRelease").mockImplementation();
      jest.spyOn(auto.release!, "generateReleaseNotes").mockImplementation();
      jest.spyOn(auto.release!, "addToChangelog").mockImplementation();
      const afterShipIt = jest.fn();
      auto.hooks.afterShipIt.tap("test", afterShipIt);

      await auto.shipit();
      expect(afterShipIt).toHaveBeenCalled();
    });

    test("should not create changelog with noChangelog", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.remote = "https://github.com/intuit/auto";

      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      auto.git!.publish = () =>
        Promise.resolve({
          data: { html_url: "https://github.com/my/repo/release" },
        } as any);
      jest.spyOn(auto.release!, "getCommitsInRelease").mockImplementation();
      jest.spyOn(auto.release!, "generateReleaseNotes").mockImplementation();
      const addToChangelog = jest
        .spyOn(auto.release!, "addToChangelog")
        .mockImplementation();
      const beforeCommitChangelog = jest.fn();
      auto.hooks.beforeCommitChangelog.tap("test", beforeCommitChangelog);
      const afterChangelog = jest.fn();
      auto.hooks.afterChangelog.tap("test", afterChangelog);

      await auto.shipit({ noChangelog: true });

      expect(addToChangelog).not.toHaveBeenCalled();
      expect(beforeCommitChangelog).not.toHaveBeenCalled();
      expect(afterChangelog).toHaveBeenCalled();
    });

    test("should not publish when behind remote", async () => {
      exec.mockImplementation((command, args) => {
        if (
          command.startsWith("git") &&
          args[0] === "ls-remote" &&
          args[1] === "--heads"
        ) {
          return Promise.reject(new Error());
        }

        return Promise.resolve("");
      });

      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      // @ts-ignore
      // eslint-disable-next-line jest/prefer-spy-on
      process.exit = jest.fn();
      await auto.loadConfig();
      auto.remote = "https://github.com/intuit/auto";

      // @ts-ignore
      auto.logger = dummyLog();
      // @ts-ignore
      auto.makeChangelog = () => Promise.resolve();
      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      jest.spyOn(auto.git!, "publish").mockImplementation();
      jest.spyOn(auto.release!, "getCommitsInRelease").mockImplementation();
      jest.spyOn(auto.release!, "generateReleaseNotes").mockImplementation();
      jest.spyOn(auto.release!, "addToChangelog").mockImplementation();
      const afterShipIt = jest.fn();
      auto.hooks.afterShipIt.tap("test", afterShipIt);

      await auto.shipit();
      expect(process.exit).toHaveBeenCalled();
    });

    test("should skip publish in dry run", async () => {
      const auto = new Auto({ ...defaults, plugins: [] });
      // @ts-ignore
      auto.checkClean = () => Promise.resolve(true);
      auto.logger = dummyLog();
      await auto.loadConfig();

      auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
      jest.spyOn(auto.git!, "publish").mockImplementation();
      jest.spyOn(auto.release!, "getCommitsInRelease").mockImplementation();
      jest.spyOn(auto.release!, "generateReleaseNotes").mockImplementation();
      jest.spyOn(auto.release!, "addToChangelog").mockImplementation();
      const spy = jest.fn();
      auto.hooks.publish.tap("test", spy);

      await auto.shipit({ dryRun: true });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe("hooks", () => {
  beforeEach(() => {
    jest
      .spyOn(child, "execSync")
      .mockImplementation()
      // @ts-ignore
      .mockReturnValue("");
  });

  test("should be able to modifyConfig", async () => {
    const auto = new Auto(defaults);
    auto.logger = dummyLog();

    auto.hooks.modifyConfig.tap("test", (testConfig) => {
      testConfig.labels.push({
        name: "released",
        description: "This issue/pull request has been released",
        releaseType: "none",
      });

      return testConfig;
    });

    await auto.loadConfig();
    expect(auto.labels?.find((l) => l.name === "released")).toStrictEqual({
      description: "This issue/pull request has been released",
      name: "released",
      releaseType: "none",
    });
  });

  describe("logParse", () => {
    test("should be able to tap parseCommit", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      auto.hooks.onCreateLogParse.tap("test", (logParse) => {
        logParse.hooks.parseCommit.tap("test parse", (commit) => {
          commit.labels = [...auto.semVerLabels!.get(SEMVER.major)!];
          return commit;
        });
      });

      await auto.loadConfig();
      auto.git!.getLatestRelease = async () => Promise.resolve("1.0.0");

      jest.spyOn(console, "log").mockImplementation();
      await auto.version();

      expect(console.log).toHaveBeenCalledWith("major");
    });

    test("should be able to tap omitCommit", async () => {
      const auto = new Auto(defaults);
      auto.logger = dummyLog();

      auto.hooks.onCreateLogParse.tap("test", (logParse) => {
        logParse.hooks.parseCommit.tap("test parse", (commit) => {
          commit.labels = [...auto.semVerLabels!.get(SEMVER.major)!];
          return commit;
        });
      });

      auto.hooks.onCreateLogParse.tap("test", (logParse) => {
        logParse.hooks.omitCommit.tap("test omit", (commit) => {
          if (commit.labels.includes("major")) {
            return true;
          }
        });
      });

      await auto.loadConfig();
      auto.git!.getLatestRelease = async () => Promise.resolve("1.0.0");

      jest.spyOn(console, "log").mockImplementation();
      await auto.version();

      expect(console.log).toHaveBeenCalledWith("patch");
    });
  });
});
