import Auto, { InteractiveInit, SEMVER } from "@auto-it/core";
import { CANCEL_SYMBOL, cancel, text } from "@clack/prompts";
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

vi.mock("@clack/prompts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@clack/prompts")>()),
  text: vi.fn(),
  cancel: vi.fn(),
}));

const multipleJiraMessages = [
  "PLAYA-5052 PLAYA-6000: Add log",
  "[PLAYA-5052][PLAYA-6000] - Add log",
  "[PLAYA-5052] PLAYA-6000: Add log",
  "PLAYA-5052 [PLAYA-6000] - Add log",
];

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

    multipleJiraMessages.forEach((message) => {
      expect(parseJira(makeCommitFromMsg(message)).jira).toStrictEqual(jira);
    });
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
      { bump: SEMVER.patch }
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
      { bump: SEMVER.patch }
    );

    const line = await changelogHooks.renderChangelogLine.promise(
      "[PLAYA-5052] Add log [author](link/to/author)",
      makeCommitFromMsg("[PLAYA-5052] Add log")
    );

    expect(line).toBe(
      "[PLAYA-5052](jira.com/PLAYA-5052): Add log [author](link/to/author)"
    );
  });

  test("multiple jira numbers", async () => {
    const plugin = new JiraPlugin({ url: "jira.com" });
    const hooks = makeHooks();
    const changelogHooks = makeChangelogHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    await hooks.onCreateChangelog.promise(
      { hooks: changelogHooks } as Changelog,
      { bump: SEMVER.patch }
    );

    await Promise.all(
      multipleJiraMessages.map(async (message) => {
        const line = await changelogHooks.renderChangelogLine.promise(
          message,
          makeCommitFromMsg(message)
        );

        expect(line).toBe(
          "[PLAYA-5052](jira.com/PLAYA-5052),[PLAYA-6000](jira.com/PLAYA-6000): Add log"
        );
      })
    );
  });
});

const testOptions = (): IGenerateReleaseNotesOptions => ({
  owner: "foobar",
  repo: "auto",
  baseUrl: "https://github.custom.com/foobar/auto",
  labels: defaultLabels,
  baseBranch: "main",
  prereleaseBranches: ["next"],
});
const logParse = new LogParse();

test("should create note for jira commits without PR title", async () => {
  const changelog = new Changelog(dummyLog(), testOptions());
  const plugin = new JiraPlugin({ url: "https://jira.custom.com/browse/" });
  const autoHooks = makeHooks();

  plugin.apply({ hooks: autoHooks } as Auto);
  await autoHooks.onCreateChangelog.promise(changelog, { bump: SEMVER.patch });
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
  await autoHooks.onCreateChangelog.promise(changelog, { bump: SEMVER.patch });
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

describe("unknown options", () => {
  test("should reject options the plugin doesn't have", async () => {
    const hooks = makeHooks();
    const options = { url: "https://jira.com" };
    const plugin = new JiraPlugin(options);

    plugin.apply({ hooks, logger: dummyLog() } as any);

    expect(
      await hooks.validateConfig.promise(plugin.name, {
        ...options,
        notAnOption: true,
      })
    ).toStrictEqual([expect.stringContaining("notAnOption")]);
  });
});

describe("init", () => {
  const setup = () => {
    const initializer = new InteractiveInit({ logger: dummyLog() });
    new JiraPlugin("jira.com").init(initializer);

    return initializer;
  };

  test("asks for the Jira URL", async () => {
    vi.mocked(text).mockResolvedValueOnce("https://jira.example.com");

    expect(await setup().hooks.configurePlugin.promise("jira")).toStrictEqual([
      "jira",
      "https://jira.example.com",
    ]);
    expect(text).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "What's the root URL of your Jira instance?",
      })
    );
  });

  test("leaves other plugins alone", async () => {
    vi.mocked(text).mockClear();

    expect(await setup().hooks.configurePlugin.promise("npm")).toBeUndefined();
    expect(text).not.toHaveBeenCalled();
  });

  test("stops init when cancelled", async () => {
    vi.mocked(text).mockResolvedValueOnce(CANCEL_SYMBOL);
    const exit = vi.spyOn(process, "exit").mockImplementation((() => {
      throw new Error("process.exit");
    }));

    await expect(setup().hooks.configurePlugin.promise("jira")).rejects.toThrow(
      "process.exit"
    );
    expect(cancel).toHaveBeenCalledWith(
      "Setup cancelled before the configuration was written."
    );
    expect(exit).toHaveBeenCalledWith(1);

    exit.mockRestore();
  });
});
