/* eslint-disable no-await-in-loop */

import endent from "endent";
import {
  cancel,
  confirm,
  group,
  intro,
  isCancel,
  log,
  multiselect,
  note,
  outro,
  password,
  select,
  text,
} from "@clack/prompts";
import chalk from "chalk";
import { AsyncSeriesBailHook, AsyncSeriesWaterfallHook } from "tapable";

import { makeInteractiveInitHooks } from "./utils/make-hooks";
import SEMVER, { defaultLabels, type ILabelDefinition } from "./semver";
import { findPaletteColor, labelPalette, leastUsedColor } from "./label-colors";
import { loadPlugin } from "./utils/load-plugins";
import type { ILogger } from "./utils/logger";
import { readFileSync, writeFileSync } from "fs";
import type {
  AutoRc,
  RepoInformation,
  AuthorInformation,
  PluginConfig,
} from "./types";

// const writeFile = promisify(fs.writeFile);

/** Shown when the user cancels a question */
const cancelMessage = "Setup cancelled before the configuration was written.";

/** Stop init without writing the configuration */
function exitOnCancel(): never {
  cancel(cancelMessage);
  process.exit(1);
}

/** The user's answer, or stop init if they cancelled the question */
function answer<T>(value: T): Exclude<T, symbol> {
  if (isCancel(value)) {
    exitOnCancel();
  }

  return value as Exclude<T, symbol>;
}

/** Reject an empty answer */
const required = (value?: string) =>
  value?.trim() ? undefined : "This is required";

export interface InteractiveInitHooks {
  /** Override where/how the rc file is written */
  writeRcFile: AsyncSeriesBailHook<[AutoRc], true | void>;
  /** Get or verify the repo information */
  getRepo: AsyncSeriesBailHook<[], RepoInformation | true | void>;
  /** Get or verify the author information */
  getAuthor: AsyncSeriesBailHook<[], AuthorInformation | true | void>;
  /** Run extra configuration for a plugin */
  configurePlugin: AsyncSeriesBailHook<[string], PluginConfig | void>;
  /** Add environment variables to get from the user */
  createEnv: AsyncSeriesWaterfallHook<
    [
      Array<{
        /** The name of the env var */
        variable: string;
        /** The message to ask the user for the the env var */
        message: string;
      }>,
    ]
  >;
}

/** The release type picker's value for "No release type" */
const noReleaseType = "";

/** A choice in the release type picker */
type ReleaseTypeChoice =
  | NonNullable<ILabelDefinition["releaseType"]>
  | typeof noReleaseType;

/** The release types to choose from for a label, in the order shown */
const releaseTypes: Array<{
  value: ReleaseTypeChoice;
  label: string;
  hint: string;
}> = [
  {
    value: noReleaseType,
    label: "No release type",
    hint: "doesn't change the version",
  },
  { value: SEMVER.major, label: "major", hint: "bumps the major version" },
  { value: SEMVER.minor, label: "minor", hint: "bumps the minor version" },
  { value: SEMVER.patch, label: "patch", hint: "bumps the patch version" },
  {
    value: "none",
    label: "none",
    hint: "no release if a PR has only labels like this",
  },
  { value: "skip", label: "skip", hint: "skips the release when merged" },
  {
    value: "release",
    label: "release",
    hint: 'releases when merged, if releases need the "release" label',
  },
];

/** The color picker's value for "Custom…" */
const customColor = "custom";

/** A small block in a color, for the pickers */
const swatch = (color?: string) => (color ? chalk.hex(color)("■") : " ");

/** Ask for a label's color: one from the palette, or a custom hex */
async function getColor(initial?: string) {
  const fromPalette = findPaletteColor(initial);
  const choice = answer(
    await select({
      message: "Color",
      options: [
        ...labelPalette.map(({ name, hex }) => ({
          value: hex,
          label: `${swatch(hex)} ${name}`,
          hint: hex,
        })),
        { value: customColor, label: "Custom…" },
      ],
      initialValue: fromPalette?.hex ?? (initial ? customColor : undefined),
    })
  );

  if (choice !== customColor) {
    return choice;
  }

  const hex = answer(
    await text({
      message: "Hex color",
      placeholder: "#1F6FEB",
      initialValue: fromPalette ? undefined : initial,
      validate: (value) =>
        /^#?[0-9a-f]{6}$/i.test(value?.trim() ?? "")
          ? undefined
          : "Use a hex color like #1F6FEB",
    })
  ).trim();

  return hex.startsWith("#") ? hex : `#${hex}`;
}

/** The text without surrounding space, or undefined if nothing's left */
const optional = (value?: string) => value?.trim() || undefined;

/**
 * Ask for a label's fields. An edit starts on the label's current values, and
 * a new label starts blank. Both start on the color given.
 */
async function getLabel(current: ILabelDefinition | undefined, color?: string) {
  const answers = await group(
    {
      name: () =>
        text({
          message: "Name",
          initialValue: current?.name,
          validate: (value) =>
            value?.trim() ? undefined : "A label needs a name",
        }),
      changelogTitle: () =>
        !current || current.changelogTitle
          ? text({
              message: current
                ? "Changelog title"
                : "Changelog title (optional)",
              initialValue: current?.changelogTitle,
            })
          : undefined,
      description: () =>
        text({
          message: current ? "Description" : "Description (optional)",
          initialValue: current?.description,
        }),
      releaseType: () =>
        select<ReleaseTypeChoice>({
          message: "Release type",
          options: releaseTypes,
          initialValue: current?.releaseType ?? noReleaseType,
        }),
      color: () => getColor(color),
    },
    { onCancel: exitOnCancel }
  );

  const label: ILabelDefinition = { name: answers.name.trim() };
  const changelogTitle = optional(answers.changelogTitle);
  const description = optional(answers.description);

  if (changelogTitle) {
    label.changelogTitle = changelogTitle;
  }

  if (description) {
    label.description = description;
  }

  if (answers.releaseType !== noReleaseType) {
    label.releaseType = answers.releaseType;
  }

  label.color = answers.color;

  return label;
}

/** Whether an edit changed anything about a label */
const isChanged = (before: ILabelDefinition, after: ILabelDefinition) =>
  (["name", "changelogTitle", "description", "releaseType"] as const).some(
    (key) => before[key] !== after[key]
  ) || before.color?.toLowerCase() !== after.color?.toLowerCase();

/** Get any custom labels from the user */
async function getAdditionalLabels(inUse: ILabelDefinition[]) {
  const labels: ILabelDefinition[] = [];

  let addLabel = answer(
    await confirm({
      message: "Would you like to add your own labels?",
      initialValue: false,
    })
  );

  while (addLabel) {
    log.step("New label");
    labels.push(
      await getLabel(undefined, leastUsedColor([...inUse, ...labels]))
    );

    addLabel = answer(
      await confirm({
        message: "Would you like to add another label?",
        initialValue: false,
      })
    );
  }

  return labels;
}

/** Ask which default labels to customize, and get the changed ones by name */
async function getCustomizedDefaultLabels() {
  const picked = answer(
    await multiselect({
      message: "Which default labels would you like to customize? (optional)",
      options: defaultLabels.map((label) => ({
        value: label.name,
        label: `${swatch(label.color)} ${label.name}`,
        hint: label.description,
      })),
      required: false,
    })
  );
  const edits = new Map<string, ILabelDefinition>();

  for (const defaultLabel of defaultLabels) {
    if (picked.includes(defaultLabel.name)) {
      log.step(`Editing the "${defaultLabel.name}" label`);
      const label = await getLabel(defaultLabel, defaultLabel.color);

      if (isChanged(defaultLabel, label)) {
        edits.set(defaultLabel.name, label);
      }
    }
  }

  return edits;
}

/** The publishing plugins to choose from, in the order shown */
const publishingPlugins = [
  { value: "brew", label: "Homebrew" },
  { value: "chrome", label: "Chrome Web Store" },
  { value: "cocoapod", label: "CocoaPods" },
  { value: "crates", label: "Rust Crate" },
  { value: "gem", label: "Ruby Gem" },
  { value: "git-tag", label: "Git Tag" },
  { value: "Gradle", label: "Gradle" },
  { value: "maven", label: "Maven" },
  { value: "npm", label: "npm" },
];

/** The other plugins to choose from, in the order shown */
const otherPlugins = [
  {
    value: "all-contributors",
    label: "All Contributors",
    hint: "Automatically add contributors as changelogs are produced",
  },
  {
    value: "conventional-commits",
    label: "Conventional Commits",
    hint: "Parse conventional commit messages",
  },
  {
    value: "first-time-contributor",
    label: "First Time Contributor",
    hint: "Thank first time contributors for their work right in your release notes",
  },
  { value: "jira", label: "Jira", hint: "Include Jira story information" },
  { value: "released", label: "Released", hint: "Mark PRs as released" },
  {
    value: "slack",
    label: "Slack",
    hint: "Post your release notes to a Slack channel",
  },
  {
    value: "twitter",
    label: "Twitter",
    hint: "Post tweets after a release is made",
  },
];

/** Get the plugins the user wants to use */
async function getPlugins() {
  const publishingPlugin = answer(
    await select({
      message:
        "Which publishing plugin should auto use to publish your project?",
      options: publishingPlugins,
    })
  );

  const plugins = answer(
    await multiselect({
      message: "Which other plugins would you like to use? (optional)",
      options: otherPlugins,
      required: false,
    })
  );

  return [publishingPlugin, ...plugins];
}

/** Get env vars, create .env file, add to .gitignore */
async function createEnv(hook: InteractiveInitHooks["createEnv"]) {
  let currentEnv: string;

  try {
    currentEnv = readFileSync(".env", { encoding: "utf8" });
  } catch (error) {
    currentEnv = "";
  }

  const env = (await hook.promise([])).filter(
    (envVar) => !currentEnv.includes(envVar.variable)
  );

  if (env.length === 0) {
    return;
  }

  const shouldCreateEnv = answer(
    await confirm({
      message:
        "Would you like to create an .env file? This makes it easy to test and use auto locally.",
      initialValue: true,
    })
  );

  if (!shouldCreateEnv) {
    return;
  }

  // Get user input for each variable
  for (const envVar of env) {
    const token = answer(
      await password({ message: envVar.message, validate: required })
    );

    currentEnv += `${envVar.variable}=${token}\n`;
  }

  writeFileSync(".env", currentEnv);

  let gitIgnore: string;

  try {
    gitIgnore = readFileSync(".gitignore", { encoding: "utf8" });
  } catch (error) {
    gitIgnore = "";
  }

  // Add env to gitignore if not already there
  if (!gitIgnore.includes(".env")) {
    writeFileSync(".gitignore", gitIgnore ? `${gitIgnore}\n.env\n` : `.env\n`);
  }
}

/**
 * Parse the gitlog for commits that are PRs and attach their labels.
 * This class can also be tapped into via plugin to parse commits
 * in other ways (ex: conventional-commits)
 */
export default class InteractiveInit {
  /** Plugin entry points */
  hooks: InteractiveInitHooks;
  /** The logger for the initializer */
  logger: ILogger;

  /** Initialize the the init prompter and tap the default functionality  */
  constructor(options: {
    /** The logger for the initializer */
    logger: ILogger;
  }) {
    this.hooks = makeInteractiveInitHooks();
    this.logger = options.logger;
  }

  /** Run a prompt to get the author information */
  async getAuthorInformation(): Promise<AuthorInformation> {
    return group(
      {
        name: () =>
          text({
            message: "What name should auto commit with?",
            validate: required,
          }),
        email: () =>
          text({
            message: "What email should auto commit with?",
            validate: required,
          }),
      },
      { onCancel: exitOnCancel }
    );
  }

  /** Run a prompt to get the repo information */
  async getRepoInformation(): Promise<RepoInformation> {
    return group(
      {
        owner: () =>
          text({
            message: "Who owns the GitHub repo? (a user or organization)",
            placeholder: "intuit",
            validate: required,
          }),
        repo: () =>
          text({
            message: "What's the GitHub repo's name?",
            placeholder: "auto",
            validate: required,
          }),
      },
      { onCancel: exitOnCancel }
    );
  }

  /** Load the default behavior */
  private tapDefaults() {
    this.hooks.getRepo.tapPromise("Init Default", () =>
      this.getRepoInformation()
    );
    this.hooks.getAuthor.tapPromise("Init Default", () =>
      this.getAuthorInformation()
    );
    this.hooks.createEnv.tap("Init Default", (vars) => [
      ...vars,
      {
        variable: "GH_TOKEN",
        message: `Enter a personal access token for the GitHub API https://github.com/settings/tokens/new`,
      },
    ]);
    this.hooks.writeRcFile.tap("Init Default", (rc) => {
      const filename = ".autorc";
      writeFileSync(filename, JSON.stringify(rc, null, 2));
      log.success(`Wrote configuration to ${filename}`);
    });
  }

  /** Run the initialization. */
  async run() {
    let autoRc: Partial<AutoRc> = {};

    intro("auto init");

    const plugins: string[] = await getPlugins();

    if (plugins) {
      plugins
        .map((name) => loadPlugin([name, {}], this.logger))
        .forEach((plugin) => {
          if (plugin?.init) {
            plugin.init(this);
          }
        });

      autoRc.plugins = await plugins.reduce(
        async (last, plugin) => {
          return [
            ...(await last),
            (await this.hooks.configurePlugin.promise(plugin)) || plugin,
          ];
        },
        Promise.resolve([] as PluginConfig[])
      );
    }

    this.tapDefaults();
    const repoInfo = await this.hooks.getRepo.promise();

    if (typeof repoInfo === "object") {
      autoRc = { ...autoRc, ...repoInfo };
    }

    const author = await this.hooks.getAuthor.promise();

    if (typeof author === "object") {
      autoRc = { ...autoRc, ...author };
    }

    const onlyPublishWithReleaseLabel = answer(
      await confirm({
        message: 'Only release when a pull request has the "release" label?',
        initialValue: false,
      })
    );

    if (onlyPublishWithReleaseLabel) {
      autoRc = { ...autoRc, onlyPublishWithReleaseLabel: true };
    }

    const isEnterprise = answer(
      await confirm({
        message: "Are you using a GitHub Enterprise instance?",
        initialValue: false,
      })
    );

    if (isEnterprise) {
      const githubApi = answer(
        await text({
          message: "What's the API URL of your GitHub Enterprise instance?",
          placeholder: "https://github.example.com/api/v3",
          validate: required,
        })
      );

      autoRc = { ...autoRc, githubApi };
    }

    await createEnv(this.hooks.createEnv);

    const edits = await getCustomizedDefaultLabels();
    const newLabels = [
      ...[...edits.values()].map((label) => ({ ...label, overwrite: true })),
      ...(await getAdditionalLabels(
        defaultLabels.map((label) => edits.get(label.name) ?? label)
      )),
    ];

    if (newLabels.length > 0) {
      autoRc.labels = [...(autoRc.labels || []), ...newLabels];
    }

    await this.hooks.writeRcFile.promise(autoRc);

    note(
      endent`
        - Run "auto create-labels" to create your labels on GitHub
        - Add your environment variables to your CI builds
        - Add "auto shipit" at the end of your build or release process
      `,
      "Next steps"
    );
    outro("auto is set up.");
  }
}
