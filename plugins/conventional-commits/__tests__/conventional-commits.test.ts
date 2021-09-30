import Auto, { SEMVER, DEFAULT_PRERELEASE_BRANCHES } from "@auto-it/core";
import makeCommitFromMsg from "@auto-it/core/dist/__tests__/make-commit-from-msg";
import Git from "@auto-it/core/dist/git";
import LogParse from "@auto-it/core/dist/log-parse";
import Release, { getVersionMap } from "@auto-it/core/dist/release";
import { defaultLabels } from "@auto-it/core/dist/semver";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import {
  makeHooks,
  makeLogParseHooks,
} from "@auto-it/core/dist/utils/make-hooks";
import ConventionalCommitsPlugin from "../src";

const versionLabels = getVersionMap(defaultLabels);

const config = {
  baseBranch: "main",
  prereleaseBranches: DEFAULT_PRERELEASE_BRANCHES,
  labels: defaultLabels,
};

describe("parseCommit", () => {
  test("should do nothing when conventional commit message is not present", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("normal commit with no bump");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual(commit);
  });

  test("should add correct semver label to commit - skip", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: { getCommitsForPR: () => Promise.resolve([]) } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("chore: normal commit with no bump");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["skip-release"],
    });
  });

  test("should add correct semver label to commit - fix", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: { getCommitsForPR: () => Promise.resolve([]) } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("fix: normal commit with no bump");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["patch"],
    });
  });

  test("should add correct semver label to commit - feat", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: { getCommitsForPR: () => Promise.resolve([]) } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("feat: normal commit with no bump");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["minor"],
    });
  });

  test("should add major semver label to commit", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: { getCommitsForPR: () => Promise.resolve([]) } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("BREAKING: normal commit with no bump");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["major"],
    });
  });

  test("should add major semver label to commit - !", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: { getCommitsForPR: () => Promise.resolve([]) } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("feat!: normal commit with no bump");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["major"],
    });
  });

  test("should apply a PRs greatest semver label", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: {
        getCommitsForPR: () =>
          Promise.resolve([
            { sha: "8", commit: { message: "docs: child commit" } },
            { sha: "1", commit: { message: "chore: child commit" } },
            { sha: "2", commit: { message: "feat!: another commit" } },
          ]),
      } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("fix lint", {pullRequest: {number: 123}});
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["major"],
    });
  });

  test("should skip when not a fix/feat/breaking change commit", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: { getCommitsForPR: () => Promise.resolve([]) } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("chore: i should not trigger a release");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["skip-release"],
    });
  });

  test("should be able to configure the default release type", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin({
      defaultReleaseType: "patch",
    });
    const autoHooks = makeHooks();
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: { getCommitsForPR: () => Promise.resolve([]) } as any,
    } as Auto);

    const logParseHooks = makeLogParseHooks();
    autoHooks.onCreateLogParse.call({
      hooks: logParseHooks,
    } as LogParse);

    const commit = makeCommitFromMsg("chore: i should not trigger a release");
    expect(
      await logParseHooks.parseCommit.promise({ ...commit })
    ).toStrictEqual({
      ...commit,
      labels: ["patch"],
    });
  });
});

describe("normalizeCommit", () => {
  test("should not include label-less head commit if any other commit in PR has conventional commit message", async () => {
    const commit = makeCommitFromMsg(
      "Merge pull request #123 from some-pr\n\n"
    );
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const logParse = new LogParse();
    const autoHooks = makeHooks();
    const mockGit = ({
      getUserByEmail: jest.fn(),
      searchRepo: jest.fn(),
      getCommitDate: jest.fn(),
      getFirstCommit: jest.fn(),
      getPr: jest.fn(),
      getCommitsForPR: () =>
        Promise.resolve([
          { sha: "1", commit: { message: "chore: child commit" } },
          { sha: "2", commit: { message: "chore: another commit" } },
        ]),
    } as unknown) as Git;
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: mockGit,
      release: new Release(mockGit, config),
    } as Auto);

    autoHooks.onCreateLogParse.call(logParse);

    const result = await logParse.normalizeCommit(commit);
    expect(result).toBeUndefined();
  });

  test("should include labeled head commit", async () => {
    const commit = makeCommitFromMsg(
      "Merge pull request #123 from some-pr\n\n",
      {
        labels: ["major"],
      }
    );
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const logParse = new LogParse();
    const autoHooks = makeHooks();
    const mockGit = ({
      getUserByEmail: jest.fn(),
      searchRepo: jest.fn(),
      getCommitDate: jest.fn(),
      getFirstCommit: jest.fn(),
      getPr: jest.fn(),
      getLatestRelease: () => Promise.resolve("1.2.3"),
      getGitLog: () =>
        Promise.resolve([
          commit,
          makeCommitFromMsg("fix: child commit", { hash: "1" }),
          makeCommitFromMsg("unrelated", { hash: "2" }),
        ]),
      getCommitsForPR: () => Promise.resolve([{ sha: "1" }]),
    } as unknown) as Git;
    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: mockGit,
      release: new Release(mockGit, config),
    } as Auto);

    autoHooks.onCreateLogParse.call(logParse);

    const result = await logParse.normalizeCommit(commit);
    expect(result?.hash).toBe("foo");
  });

  test("should respect PR label if SEMVER", async () => {
    const commit = makeCommitFromMsg("fix: a test", {
      labels: ["major"],
    });
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const logParse = new LogParse();
    const autoHooks = makeHooks();
    const mockGit = ({
      getUserByEmail: jest.fn(),
      searchRepo: jest.fn(),
      getCommitDate: jest.fn(),
      getFirstCommit: jest.fn(),
      getPr: jest.fn(),
      getLatestRelease: () => Promise.resolve("1.2.3"),
      getGitLog: () => Promise.resolve([commit]),
      getCommitsForPR: () => Promise.resolve([{ sha: "1" }]),
    } as unknown) as Git;

    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: mockGit,
      release: new Release(mockGit, config),
    } as Auto);

    autoHooks.onCreateLogParse.call(logParse);

    const result = await logParse.normalizeCommit(commit);
    expect(result?.labels).toStrictEqual(["major"]);
  });

  test("should add conventional commit label if none/skip", async () => {
    const commit = makeCommitFromMsg("fix: a test", {
      labels: ["skip-release", "internal"],
    });
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const logParse = new LogParse();
    const autoHooks = makeHooks();
    const mockGit = ({
      getUserByEmail: jest.fn(),
      searchRepo: jest.fn(),
      getCommitDate: jest.fn(),
      getFirstCommit: jest.fn(),
      getPr: jest.fn(),
      getLatestRelease: () => Promise.resolve("1.2.3"),
      getGitLog: () => Promise.resolve([commit]),
      getCommitsForPR: () => Promise.resolve([{ sha: "1" }]),
    } as unknown) as Git;

    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: mockGit,
      release: new Release(mockGit, config),
    } as Auto);

    autoHooks.onCreateLogParse.call(logParse);

    const result = await logParse.normalizeCommit(commit);
    expect(result?.labels).toStrictEqual(["skip-release", "internal", "patch"]);
  });

  test("should not add skip when a non skip commit is present with a skip commit", async () => {
    const commit = makeCommitFromMsg("fix: a test");
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const logParse = new LogParse();
    const autoHooks = makeHooks();
    const mockGit = ({
      getUserByEmail: jest.fn(),
      searchRepo: jest.fn(),
      getCommitDate: jest.fn(),
      getFirstCommit: jest.fn(),
      getPr: jest.fn(),
      getLatestRelease: () => Promise.resolve("1.2.3"),
      getGitLog: () =>
        Promise.resolve([commit, makeCommitFromMsg("chore: a test 2")]),
      getCommitsForPR: () => Promise.resolve([{ sha: "1" }]),
    } as unknown) as Git;

    conventionalCommitsPlugin.apply({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: mockGit,
      release: new Release(mockGit, config),
    } as Auto);

    autoHooks.onCreateLogParse.call(logParse);

    const result = await logParse.normalizeCommit(commit);
    expect(result?.labels).toStrictEqual(["patch"]);
  });
});

describe("prCheck", () => {
  test("should not add semver label to pr if semver label exists", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    const addLabelToPr = jest.fn();
    const customLabels = [
      ...defaultLabels,
      { name: "my-major", releaseType: SEMVER.major } as any,
    ];
    const versionLabelsCustom = getVersionMap(customLabels);

    const auto = ({
      hooks: autoHooks,
      labels: customLabels,
      semVerLabels: versionLabelsCustom,
      logger: dummyLog(),
      git: {
        getLabels: async () => ["my-major"],
        getCommitsForPR: async () => {
          return [
            {
              sha: "1234",
              commit: {
                message: "fix: normal commit",
              },
            },
          ];
        },
        addLabelToPr,
      },
    } as unknown) as Auto;

    conventionalCommitsPlugin.apply(auto);

    await auto.hooks.prCheck.promise({
      pr: {
        number: 1,
      } as any,
    });

    expect(addLabelToPr).toHaveBeenCalledTimes(0);
  });

  test("should add correct semver label to pr - one commit", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    const addLabelToPr = jest.fn();
    const auto = ({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: {
        getLabels: async () => [],
        getCommitsForPR: async () => {
          return [
            {
              sha: "1234",
              commit: {
                message: "fix: normal commit",
              },
            },
          ];
        },
        addLabelToPr,
      },
    } as unknown) as Auto;

    conventionalCommitsPlugin.apply(auto);

    await auto.hooks.prCheck.promise({
      pr: {
        number: 1,
      } as any,
    });

    expect(addLabelToPr).toHaveBeenCalledWith(1, "patch");
  });

  test("should add skip label for non-release commits", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    const addLabelToPr = jest.fn();
    const auto = ({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: {
        getLabels: async () => [],
        getCommitsForPR: async () => {
          return [
            {
              sha: "1234",
              commit: {
                message: "chore: normal commit",
              },
            },
          ];
        },
        addLabelToPr,
      },
    } as unknown) as Auto;

    conventionalCommitsPlugin.apply(auto);

    await auto.hooks.prCheck.promise({
      pr: {
        number: 1,
      } as any,
    });

    expect(addLabelToPr).toHaveBeenCalledWith(1, "skip-release");
  });

  test("should add correct semver label to pr - custom labels", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const customLabels = [
      // Only use the custom major label
      ...defaultLabels.filter((l) => l.name !== "major"),
      { name: "my-major", releaseType: SEMVER.major } as any,
    ];
    const versionLabelsCustom = getVersionMap(customLabels);
    const autoHooks = makeHooks();
    const addLabelToPr = jest.fn();
    const auto = ({
      hooks: autoHooks,
      labels: customLabels,
      semVerLabels: versionLabelsCustom,
      logger: dummyLog(),
      git: {
        getLabels: async () => [],
        getCommitsForPR: async () => {
          return [
            {
              sha: "1234",
              commit: {
                message: "BREAKING: normal commit",
              },
            },
          ];
        },
        addLabelToPr,
      },
    } as unknown) as Auto;

    conventionalCommitsPlugin.apply(auto);

    await auto.hooks.prCheck.promise({
      pr: {
        number: 1,
      } as any,
    });

    expect(addLabelToPr).toHaveBeenCalledWith(1, "my-major");
  });

  test("should add correct semver label to pr - multiple commit", async () => {
    const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
    const autoHooks = makeHooks();
    const addLabelToPr = jest.fn();
    const auto = ({
      hooks: autoHooks,
      labels: defaultLabels,
      semVerLabels: versionLabels,
      logger: dummyLog(),
      git: {
        getLabels: async () => [],
        getCommitsForPR: async () => {
          return [
            {
              sha: "1234",
              commit: {
                message: "fix: normal commit",
              },
            },
            {
              sha: "12345",
              commit: {
                message: "feat: normal commit",
              },
            },
            {
              sha: "123456",
              commit: {
                message: "feat: normal commit",
              },
            },
          ];
        },
        addLabelToPr,
      },
    } as unknown) as Auto;

    conventionalCommitsPlugin.apply(auto);

    await auto.hooks.prCheck.promise({
      pr: {
        number: 1,
      } as any,
    });

    expect(addLabelToPr).toHaveBeenCalledWith(1, "minor");
  });
});
