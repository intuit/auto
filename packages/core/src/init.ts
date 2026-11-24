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
import { prompt } from "enquirer";
import { AsyncSeriesBailHook, AsyncSeriesWaterfallHook } from "tapable";

import { makeInteractiveInitHooks } from "./utils/make-hooks";
import SEMVER, { defaultLabels, type ILabelDefinition } from "./semver";
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

interface Confirmation {
  /** Whether the user confirmed the question */
  confirmed: boolean;
}

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

/** Get label configuration from the user. */
async function getLabel(label?: ILabelDefinition) {
  interface LabelResponse {
    /** Response value */
    value: {
      /** Snippet values */
      values: ILabelDefinition;
    };
  }

  // @ts-expect-error enquirer types `validate` as taking a string, but snippet prompts pass their state
  const response = await prompt<LabelResponse>({
    type: "snippet",
    name: "value",
    message: label ? `Edit "${label.name}" label:` : "Add a label:",
    template: label
      ? endent`{
          name: #{name:${label.name}},
          ${
            label.changelogTitle
              ? `changelogTitle: #{changelogTitle:${label.changelogTitle}},`
              : ""
          }
          description: #{description:${label.description}},
          releaseType: #{releaseType:${label.releaseType}}
          color: #{color:${label.color}}
        }`
      : endent`{
          name: #{name},
          changelogTitle: #{changelogTitle},
          description: #{description},
          releaseType: #{releaseType},
          color: #{color}
        }`,
    /** Check if returned config is valid */
    validate: (state: {
      /** The result of the prompt */
      values: ILabelDefinition;
    }) => {
      if (!state.values.name) {
        return "name is required for new label";
      }

      const releaseTypes = [
        SEMVER.major,
        SEMVER.minor,
        SEMVER.patch,
        "none",
        "skip",
        "release",
      ];

      if (
        state.values.releaseType &&
        !releaseTypes.includes(state.values.releaseType)
      ) {
        return `Release type can only be one of the following: ${releaseTypes.join(
          ", "
        )}`;
      }

      return true;
    },
  });

  return response.value.values;
}

/** Get any custom labels from the user */
async function getAdditionalLabels() {
  const labels: ILabelDefinition[] = [];

  let addLabels = await prompt<Confirmation>({
    type: "confirm",
    name: "confirmed",
    message: "Would you like to add more labels?",
    initial: "no",
  });

  while (addLabels.confirmed) {
    labels.push(await getLabel());

    addLabels = await prompt<Confirmation>({
      type: "confirm",
      name: "confirmed",
      message: "Would you like to add another label?",
      initial: "no",
    });
  }

  return labels;
}

/** Get default label overrides */
async function getCustomizedDefaultLabels() {
  const labels: ILabelDefinition[] = [];
  const addLabels = await prompt<Confirmation>({
    type: "confirm",
    name: "confirmed",
    message: "Would you like to customize the default labels?",
    initial: "no",
  });

  if (addLabels.confirmed) {
    await defaultLabels.reduce(async (last, defaultLabel) => {
      await last;
      const newLabel = await getLabel(defaultLabel);

      if (JSON.stringify(newLabel) !== JSON.stringify(defaultLabel)) {
        labels.push({ ...newLabel, overwrite: true });
      }
    }, Promise.resolve());
  }

  return labels;
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

    const newLabels = [
      ...(await getCustomizedDefaultLabels()),
      ...(await getAdditionalLabels()),
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
