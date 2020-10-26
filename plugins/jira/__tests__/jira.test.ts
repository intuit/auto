import Auto, { SEMVER } from "@auto-it/core";
import makeCommitFromMsg from "@auto-it/core/dist/__tests__/make-commit-from-msg";
import Changelog, {
  IGenerateReleaseNotesOptions,
} from "@auto-it/core/dist/changelog";
import LogParse from "@auto-it/core/dist/log-parse";
import { defaultLabels } from "@auto-it/core/dist/semver";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import {
  makeChangelogHooks,
  makeHooks,
} from "@auto-it/core/dist/utils/make-hooks";
import JiraPlugin, { parseJira } from "../src";

describe("parse jira", () => {
  test("no story", () => {
    const commit = {
      ...makeCommitFromMsg("Add log"),
    };

    expect(parseJira(commit)).toStrictEqual(commit);
  });

  test("story found", () => {
    const jira = {
      number: ["P-5052"],
    };

    expect(parseJira(makeCommitFromMsg("P-5052: Add log")).jira).toStrictEqual(
      jira
    );
    expect(
      parseJira(makeCommitFromMsg("[P-5052] - Add log")).jira
    ).toStrictEqual(jira);
    expect(parseJira(makeCommitFromMsg("[P-5052] Add log")).jira).toStrictEqual(
      jira
    );
  });

  test("story found, pr no title", () => {
    const jira = {
      number: ["PLAYA-5052"],
    };

    expect(parseJira(makeCommitFromMsg("[PLAYA-5052]")).jira).toStrictEqual(
      jira
    );
  });

  test("story found multiple", () => {
    const jira = {
      number: ["PLAYA-5052", "PLAYA-6000"],
    };

    expect(
      parseJira(makeCommitFromMsg("PLAYA-5052 PLAYA-6000: Add log")).jira
    ).toStrictEqual(jira);
    expect(
      parseJira(makeCommitFromMsg("[PLAYA-5052][PLAYA-6000] - Add log")).jira
    ).toStrictEqual(jira);
    expect(
      parseJira(makeCommitFromMsg("[PLAYA-5052] PLAYA-6000: Add log")).jira
    ).toStrictEqual(jira);
    expect(
      parseJira(makeCommitFromMsg("PLAYA-5052 [PLAYA-6000] - Add log")).jira
    ).toStrictEqual(jira);
  });
});

describe("render jira", () => {
  test("no jira number", async () => {
    const plugin = new JiraPlugin("jira.com");
    const hooks = makeHooks();
    const changelogHooks = makeChangelogHooks();
    const commit = makeCommitFromMsg("Add log");

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    await hooks.onCreateChangelog.promise(
      { hooks: changelogHooks } as Changelog,
      SEMVER.patch
    );

    expect(
      await changelogHooks.renderChangelogLine.promise("Add log", commit)
    ).toBe("Add log");
  });

  test("with jira number", async () => {
    const plugin = new JiraPlugin({ url: "jira.com" });
    const hooks = makeHooks();
    const changelogHooks = makeChangelogHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    await hooks.onCreateChangelog.promise(
      { hooks: changelogHooks } as Changelog,
      SEMVER.patch
    );

    const line = await changelogHooks.renderChangelogLine.promise(
      "[PLAYA-5052] Add log [author](link/to/author)",
      makeCommitFromMsg("[PLAYA-5052] Add log")
    );

    expect(line).toBe(
      "[PLAYA-5052](jira.com/PLAYA-5052): Add log [author](link/to/author)"
    );
  });
});

const testOptions = (): IGenerateReleaseNotesOptions => ({
  owner: "foobar",
  repo: "auto",
  baseUrl: "https://github.custom.com/foobar/auto",
  labels: defaultLabels,
  baseBranch: "master",
  prereleaseBranches: ["next"],
});
const logParse = new LogParse();

test("should create note for jira commits without PR title", async () => {
  const changelog = new Changelog(dummyLog(), testOptions());
  const plugin = new JiraPlugin({ url: "https://jira.custom.com/browse/" });
  const autoHooks = makeHooks();

  plugin.apply({ hooks: autoHooks } as Auto);
  await autoHooks.onCreateChangelog.promise(changelog, SEMVER.patch);
  changelog.loadDefaultHooks();

  const normalized = await logParse.normalizeCommits([
    makeCommitFromMsg("[PLAYA-5052]"),
  ]);

  expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
});

test("should create note for JIRA commits", async () => {
  const changelog = new Changelog(dummyLog(), testOptions());
  const plugin = new JiraPlugin({ url: "https://jira.custom.com/browse/" });
  const autoHooks = makeHooks();

  plugin.apply({ hooks: autoHooks } as Auto);
  await autoHooks.onCreateChangelog.promise(changelog, SEMVER.patch);
  changelog.loadDefaultHooks();

  const normalized = await logParse.normalizeCommits([
    makeCommitFromMsg("[PLAYA-5052] - Some Feature (#12345)", {
      labels: ["major"],
      packages: [],
    }),
    makeCommitFromMsg("Some Feature (#1234)", { labels: ["internal"] }),
    makeCommitFromMsg("Third", { labels: ["patch"] }),
  ]);

  expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
});
