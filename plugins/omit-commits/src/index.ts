import { Auto, IPlugin } from '@auto-it/core';

export interface IOmitCommitsPluginOptions {
  /** Usernames to omit */
  username?: string | string[];
  /** Emails to omit */
  email?: string | string[];
  /** Names to omit */
  name?: string | string[];
  /** Commit messages to omit */
  subject?: string | string[];
  /** Labels to omit */
  labels?: string | string[];
}

/** Ensure a value is an array */
const arrayify = <T>(arr: T | T[]): T[] => (Array.isArray(arr) ? arr : [arr]);

/** Filter certain commits out of the changelog and version calculation. */
export default class OmitCommitsPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Omit Commits';

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
      labels: options.labels ? arrayify(options.labels) : []
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateLogParse.tap(this.name, logParse => {
      logParse.hooks.omitCommit.tap(this.name, commit => {
        if (
          commit.authors.find(author =>
            Boolean(author.name && this.options.name.includes(author.name))
          ) ||
          commit.authors.find(author =>
            Boolean(author.email && this.options.email.includes(author.email))
          ) ||
          commit.authors.find(author =>
            Boolean(
              author.username && this.options.username.includes(author.username)
            )
          ) ||
          commit.labels.find(label =>
            Boolean(this.options.labels.includes(label))
          ) ||
          this.options.subject.find(str => commit.subject.includes(str))
        ) {
          return true;
        }
      });
    });
  }
}
