import join from "url-join";
import { prompt } from "enquirer";
import * as t from "io-ts";

import {
  Auto,
  IPlugin,
  InteractiveInit,
  validatePluginConfiguration,
} from "@auto-it/core";
import { IExtendedCommit } from "@auto-it/core/dist/log-parse";

const pluginOptions = t.interface({
  /** Url to a hosted JIRA instance */
  url: t.string,
});

export type IJiraPluginOptions = t.TypeOf<typeof pluginOptions>;

interface InputResponse<T = "string"> {
  /** he value of the input prompt */
  value: T;
}

interface IJiraCommit extends IExtendedCommit {
  /** The jira info for the commit */
  jira?: {
    /** The jira story numbers attached to teh commit */
    number: string[];
  };
}

const jira = /\[?([\w]{1,}-\d+)\]?:?\s?[-\s]*([\S ]+)?/;

/** Get the jira number from a commit message. */
export function parseJira(commit: IExtendedCommit): IJiraCommit {
  // Support 'JIRA-XXX:' and '[JIRA-XXX]' and '[JIRA-XXX] - '
  const matches = [];

  let currentMatch = commit.subject.match(jira);

  while (currentMatch) {
    matches.push(currentMatch);
    const rest = currentMatch[2];

    if (!rest) {
      break;
    }

    currentMatch = rest.match(jira);
  }

  if (!matches.length) {
    return commit;
  }

  return {
    ...commit,
    jira: {
      number: matches.map((match) => match[1]),
    },
  };
}

/** Convert shorthand options to noraml shape */
const normalizeOptions = (options: IJiraPluginOptions | string) =>
  typeof options === "string" ? { url: options } : options;

/** Include Jira story information in your changelogs */
export default class JiraPlugin implements IPlugin {
  /** The name of the plugin */
  name = "jira";

  /** The options of the plugin */
  readonly options: IJiraPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IJiraPluginOptions | string) {
    this.options = normalizeOptions(options);
  }

  /** Custom initialization for this plugin */
  init(initializer: InteractiveInit) {
    initializer.hooks.configurePlugin.tapPromise(this.name, async (name) => {
      if (name === "jira") {
        const url = await prompt<InputResponse>({
          type: "input",
          name: "value",
          message: "What is the root url of your Jira instance?",
          required: true,
        });

        return ["jira", url.value];
      }
    });
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(
          this.name,
          pluginOptions,
          normalizeOptions(options)
        );
      }
    });

    auto.hooks.onCreateChangelog.tap(this.name, (changelog) => {
      changelog.hooks.renderChangelogLine.tap(
        this.name,
        (currentRender, commit) => {
          let line = currentRender;
          const jiraCommit = parseJira(commit);

          if (jiraCommit.jira && this.options.url) {
            const link = join(this.options.url, ...jiraCommit.jira.number);
            const [, , rest] = commit.subject.match(jira) || [];

            line = line.replace(
              jira,
              `[${jiraCommit.jira.number}](${link})${rest ? ":" : ""} $2`
            );
          }

          return line;
        }
      );
    });
  }
}
