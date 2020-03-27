import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import * as t from "io-ts";

const pattern = t.union([t.string, t.array(t.string)]);
const pluginOptions = t.partial({
  /** Usernames to omit */
  username: pattern,
  /** Emails to omit */
  email: pattern,
  /** Names to omit */
  name: pattern,
  /** Commit messages to omit */
  subject: pattern,
  /** Labels to omit */
  labels: pattern,
});

export type IOmitCommitsPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Ensure a value is an array */
const arrayify = <T>(arr: T | T[]): T[] => (Array.isArray(arr) ? arr : [arr]);

/** Filter certain commits out of the changelog and version calculation. */
export default class OmitCommitsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "omit-commits";

  /** The options of the plugin */
  readonly options: {
    /** Usernames to omit */
    username: string[];
    /** Emails to omit */
    email: string[];
    /** Names to omit */
    name: string[];
    /** Commit messages to omit */
    subject: string[];
    /** Labels to omit */
    labels: string[];
  };

  /** Initialize the plugin with it's options */
  constructor(options: IOmitCommitsPluginOptions) {
    this.options = {
      username: options.username ? arrayify(options.username) : [],
      email: options.email ? arrayify(options.email) : [],
      name: options.name ? arrayify(options.name) : [],
      subject: options.subject ? arrayify(options.subject) : [],
      labels: options.labels ? arrayify(options.labels) : [],
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
      logParse.hooks.omitCommit.tap(this.name, (commit) => {
        if (
          commit.authors.find((author) =>
            Boolean(author.name && this.options.name.includes(author.name))
          ) ||
          commit.authors.find((author) =>
            Boolean(author.email && this.options.email.includes(author.email))
          ) ||
          commit.authors.find((author) =>
            Boolean(
              author.username && this.options.username.includes(author.username)
            )
          ) ||
          commit.labels.find((label) =>
            Boolean(this.options.labels.includes(label))
          ) ||
          this.options.subject.find((str) => commit.subject.includes(str))
        ) {
          return true;
        }
      });
    });
  }
}
