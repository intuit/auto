import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import path from "path";
import {
  CANCEL_SYMBOL,
  cancel,
  confirm,
  intro,
  log,
  multiselect,
  note,
  outro,
  password,
  select,
  text,
} from "@clack/prompts";

import InteractiveInit from "../init";
import { labelPalette, leastUsedColor, paletteColorFor } from "../label-colors";
import { defaultLabels } from "../semver";
import { loadPlugin } from "../utils/load-plugins";
import { dummyLog } from "../utils/logger";

// The prompts are mocked. `group` and `isCancel` stay real, so cancelling
// inside a group runs clack's own `onCancel` handling.
vi.mock("@clack/prompts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@clack/prompts")>();

  return {
    ...actual,
    select: vi.fn(),
    multiselect: vi.fn(),
    confirm: vi.fn(),
    text: vi.fn(),
    password: vi.fn(),
    intro: vi.fn(),
    outro: vi.fn(),
    note: vi.fn(),
    cancel: vi.fn(),
    log: { ...actual.log, success: vi.fn(), step: vi.fn() },
  };
});
// Real plugins can write package.json, so none are loaded
vi.mock("../utils/load-plugins", () => ({ loadPlugin: vi.fn() }));

interface Answers {
  select?: unknown[];
  multiselect?: unknown[];
  confirm?: unknown[];
  text?: unknown[];
  password?: unknown[];
}

/** Queue answers for each kind of question, in the order they're asked */
function answer(answers: Answers) {
  const prompts = { select, multiselect, confirm, text, password };

  Object.entries(answers).forEach(([kind, values]) => {
    values.forEach((value: unknown) =>
      vi
        .mocked(prompts[kind as keyof Answers])
        .mockResolvedValueOnce(value as never)
    );
  });
}

/** Answers for every question, accepting the defaults */
const defaults = (overrides: Answers = {}): Answers => ({
  select: ["git-tag"],
  // other plugins, default labels to customize
  multiselect: [[], []],
  // owner, repo, name, email
  text: ["intuit", "auto", "Jane Doe", "jane@example.com"],
  // release label, enterprise, .env, own labels
  confirm: [false, false, false, false],
  ...overrides,
});

const readRc = () => JSON.parse(readFileSync(".autorc", "utf8"));

let cwd: string;
let dir: string;

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("process.exit");
  });

  // init writes .autorc, .env and .gitignore to the current directory
  cwd = process.cwd();
  dir = mkdtempSync(path.join(tmpdir(), "auto-init-"));
  process.chdir(dir);
});

afterEach(() => {
  process.chdir(cwd);
  rmSync(dir, { recursive: true, force: true });
});

describe("InteractiveInit", () => {
  test("writes the answers to .autorc", async () => {
    answer(defaults());

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(readRc()).toStrictEqual({
      plugins: ["git-tag"],
      owner: "intuit",
      repo: "auto",
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(intro).toHaveBeenCalledWith("auto init");
    expect(log.success).toHaveBeenCalledWith("Wrote configuration to .autorc");
    expect(note).toHaveBeenCalledWith(
      expect.stringContaining('Run "auto create-labels"'),
      "Next steps"
    );
    expect(outro).toHaveBeenCalledWith("auto is set up.");
  });

  test("lets the user pick no other plugins", async () => {
    answer(defaults());

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(multiselect).toHaveBeenCalledWith(
      expect.objectContaining({ required: false })
    );
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Which publishing plugin should auto use to publish your project?",
        options: expect.arrayContaining([
          { value: "cocoapod", label: "CocoaPods" },
        ]),
      })
    );
  });

  test("lets plugins configure themselves", async () => {
    vi.mocked(loadPlugin).mockImplementation(([name]) =>
      name === "jira"
        ? {
            name: "jira",
            apply: () => undefined,
            init: (initializer: InteractiveInit) =>
              initializer.hooks.configurePlugin.tapPromise("Test", async (n) =>
                n === "jira" ? ["jira", "https://jira.example.com"] : undefined
              ),
          }
        : undefined
    );
    answer(defaults({ multiselect: [["jira"], []] }));

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(readRc().plugins).toStrictEqual([
      "git-tag",
      ["jira", "https://jira.example.com"],
    ]);
  });

  test("asks for the enterprise API URL", async () => {
    answer(
      defaults({
        text: [
          "intuit",
          "auto",
          "Jane Doe",
          "jane@example.com",
          "https://github.example.com/api/v3",
        ],
        confirm: [false, true, false, false],
      })
    );

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(readRc().githubApi).toBe("https://github.example.com/api/v3");
  });

  test("only publishes with the release label when asked", async () => {
    answer(defaults({ confirm: [true, false, false, false] }));

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(readRc().onlyPublishWithReleaseLabel).toBe(true);
  });

  test("asks for tokens with a masked prompt and writes .env", async () => {
    writeFileSync(".gitignore", "node_modules\n");
    answer(
      defaults({
        confirm: [false, false, true, false],
        password: ["ghp_secret"],
      })
    );

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(password).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("personal access token"),
      })
    );
    expect(text).toHaveBeenCalledTimes(4);
    expect(readFileSync(".env", "utf8")).toBe("GH_TOKEN=ghp_secret\n");
    expect(readFileSync(".gitignore", "utf8")).toBe("node_modules\n\n.env\n");
  });

  test("doesn't ask for env vars already in .env", async () => {
    writeFileSync(".env", "GH_TOKEN=existing\n");
    answer(defaults({ confirm: [false, false, false] }));

    await new InteractiveInit({ logger: dummyLog() }).run();

    // release label, enterprise, own labels
    expect(confirm).toHaveBeenCalledTimes(3);
    expect(password).not.toHaveBeenCalled();
  });

  test("rejects empty answers to required questions", async () => {
    answer(defaults());

    await new InteractiveInit({ logger: dummyLog() }).run();

    const { validate } = vi.mocked(text).mock.calls[0]![0];

    expect(validate).toBeInstanceOf(Function);

    const check = validate as (value?: string) => string | undefined;

    expect(check(undefined)).toBe("This is required");
    expect(check("  ")).toBe("This is required");
    expect(check("intuit")).toBeUndefined();
  });

  describe("cancelling", () => {
    const expectCancelled = async (run: Promise<void>) => {
      await expect(run).rejects.toThrow("process.exit");
      expect(cancel).toHaveBeenCalledWith(
        "Setup cancelled before the configuration was written."
      );
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(existsSync(".autorc")).toBe(false);
    };

    test("at the first question", async () => {
      answer({ select: [CANCEL_SYMBOL] });

      await expectCancelled(new InteractiveInit({ logger: dummyLog() }).run());
      expect(multiselect).not.toHaveBeenCalled();
    });

    test("inside a group of questions", async () => {
      answer(defaults({ text: ["intuit", CANCEL_SYMBOL] }));

      await expectCancelled(new InteractiveInit({ logger: dummyLog() }).run());
      expect(text).toHaveBeenCalledTimes(2);
    });

    test("at a token", async () => {
      answer(
        defaults({ confirm: [false, false, true], password: [CANCEL_SYMBOL] })
      );

      await expectCancelled(new InteractiveInit({ logger: dummyLog() }).run());
      expect(existsSync(".env")).toBe(false);
    });

    test("inside a label's fields", async () => {
      answer(
        defaults({
          multiselect: [[], ["major"]],
          text: [
            "intuit",
            "auto",
            "Jane Doe",
            "jane@example.com",
            CANCEL_SYMBOL,
          ],
        })
      );

      await expectCancelled(new InteractiveInit({ logger: dummyLog() }).run());
      // No more of the label's questions are asked
      expect(text).toHaveBeenCalledTimes(5);
      expect(select).toHaveBeenCalledTimes(1);
    });
  });

  describe("plugin helpers", () => {
    test("getAuthorInformation returns the name and email", async () => {
      answer({ text: ["Jane Doe", "jane@example.com"] });

      await expect(
        new InteractiveInit({ logger: dummyLog() }).getAuthorInformation()
      ).resolves.toStrictEqual({ name: "Jane Doe", email: "jane@example.com" });
    });

    test("getRepoInformation returns the owner and repo", async () => {
      answer({ text: ["intuit", "auto"] });

      await expect(
        new InteractiveInit({ logger: dummyLog() }).getRepoInformation()
      ).resolves.toStrictEqual({ owner: "intuit", repo: "auto" });
    });
  });
});

/** The four answers before the label questions: owner, repo, name, email */
const before = ["intuit", "auto", "Jane Doe", "jane@example.com"];

/** The calls to the color picker, in order */
const colorPickers = () =>
  vi
    .mocked(select)
    .mock.calls.map(([options]) => options)
    .filter((options) => options.message === "Color");

describe("labels", () => {
  test("offers every default label, and picking none keeps them all", async () => {
    answer(defaults());

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(multiselect).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Which default labels would you like to customize? (optional)",
        required: false,
        options: defaultLabels.map((label) =>
          expect.objectContaining({
            value: label.name,
            hint: label.description,
          })
        ),
      })
    );
    expect(readRc().labels).toBeUndefined();
  });

  test("edits a picked default label, starting on its current values", async () => {
    answer(
      defaults({
        multiselect: [[], ["major"]],
        text: [
          ...before,
          "major",
          "💥 Breaking Change",
          "Increment the major version when merged",
        ],
        select: ["git-tag", "major", "#1F883D"],
      })
    );

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(log.step).toHaveBeenCalledWith('Editing the "major" label');
    expect(text).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Name", initialValue: "major" })
    );
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Release type",
        initialValue: "major",
      })
    );
    expect(colorPickers()[0]?.initialValue).toBe("#C5000B");
    expect(readRc().labels).toStrictEqual([
      {
        name: "major",
        changelogTitle: "💥 Breaking Change",
        description: "Increment the major version when merged",
        releaseType: "major",
        color: "#1F883D",
        overwrite: true,
      },
    ]);
  });

  test("doesn't write a default label that wasn't changed", async () => {
    answer(
      defaults({
        multiselect: [[], ["release"]],
        // release has no changelog title, so that question is skipped
        text: [...before, "release", "Create a release when this pr is merged"],
        select: ["git-tag", "release", "#0e7c7b"],
      })
    );

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(text).toHaveBeenCalledTimes(6);
    expect(readRc().labels).toBeUndefined();
  });

  test("adds labels of your own, leaving out blank fields", async () => {
    answer(
      defaults({
        // release label, enterprise, .env, own labels, another, another
        confirm: [false, false, false, true, true, false],
        text: [...before, "bug", "", "  ", "chore", "🧹 Chores", "Tidy up"],
        select: ["git-tag", "", "#1F883D", "none", "#1F6FEB"],
      })
    );

    await new InteractiveInit({ logger: dummyLog() }).run();

    expect(log.step).toHaveBeenCalledWith("New label");
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Release type", initialValue: "" })
    );
    // Green and Blue are the colors no default label uses
    expect(colorPickers().map((options) => options.initialValue)).toStrictEqual(
      ["#1F883D", "#1F6FEB"]
    );
    expect(readRc().labels).toStrictEqual([
      { name: "bug", color: "#1F883D" },
      {
        name: "chore",
        changelogTitle: "🧹 Chores",
        description: "Tidy up",
        releaseType: "none",
        color: "#1F6FEB",
      },
    ]);
  });

  test("requires a name for a new label", async () => {
    answer(
      defaults({
        confirm: [false, false, false, true, false],
        text: [...before, "bug", "", ""],
        select: ["git-tag", "", "#1F883D"],
      })
    );

    await new InteractiveInit({ logger: dummyLog() }).run();

    const name = vi
      .mocked(text)
      .mock.calls.find(([options]) => options.message === "Name")![0];
    const validate = name.validate as (value?: string) => string | undefined;

    expect(validate("")).toBe("A label needs a name");
    expect(validate("bug")).toBeUndefined();
  });

  test("takes a custom hex color", async () => {
    answer(
      defaults({
        confirm: [false, false, false, true, false],
        text: [...before, "bug", "", "", "1f6feb"],
        select: ["git-tag", "", "custom"],
      })
    );

    await new InteractiveInit({ logger: dummyLog() }).run();

    const hex = vi
      .mocked(text)
      .mock.calls.find(([options]) => options.message === "Hex color")![0];
    const validate = hex.validate as (value?: string) => string | undefined;

    expect(validate("#12345")).toBe("Use a hex color like #1F6FEB");
    expect(validate("#1F6FEB")).toBeUndefined();
    expect(validate("1f6feb")).toBeUndefined();
    expect(readRc().labels).toStrictEqual([{ name: "bug", color: "#1f6feb" }]);
  });
});

describe("label palette", () => {
  test("has 12 different colors", () => {
    expect(new Set(labelPalette.map(({ hex }) => hex.toLowerCase())).size).toBe(
      12
    );
  });

  test("has every default label's color", () => {
    const hexes = labelPalette.map(({ hex }) => hex.toLowerCase());

    defaultLabels.forEach((label) =>
      expect(hexes).toContain(label.color?.toLowerCase())
    );
  });

  test("picks the same color for a name in any case", () => {
    expect(paletteColorFor("Foo")).toBe(paletteColorFor("foo"));
    expect(labelPalette.map(({ hex }) => hex)).toContain(
      paletteColorFor("foo")
    );
  });

  test("starts new labels on the least-used color", () => {
    expect(leastUsedColor(defaultLabels)).toBe("#1F883D");
    expect(leastUsedColor([...defaultLabels, { color: "#1f883d" }])).toBe(
      "#1F6FEB"
    );
    // Every color used once: the first one
    expect(
      leastUsedColor([
        ...defaultLabels,
        { color: "#1F883D" },
        { color: "#1F6FEB" },
      ])
    ).toBe("#C5000B");
  });
});
