import { Auto, IPlugin } from '@auto-it/core';

export interface IOmitCommitsPluginOptions {
  username?: string | string[];
  email?: string | string[];
  name?: string | string[];
  subject?: string | string[];
  labels?: string | string[];
}

const arrayify = <T>(arr: T | T[]): T[] => (Array.isArray(arr) ? arr : [arr]);

export default class OmitCommitsPlugin implements IPlugin {
  name = 'Omit Commits';

  readonly options: {
    username: string[];
    email: string[];
    name: string[];
    subject: string[];
    labels: string[];
  };

  constructor(options: IOmitCommitsPluginOptions) {
    this.options = {
      username: options.username ? arrayify(options.username) : [],
      email: options.email ? arrayify(options.email) : [],
      name: options.name ? arrayify(options.name) : [],
      subject: options.subject ? arrayify(options.subject) : [],
      labels: options.labels ? arrayify(options.labels) : []
    };
  }

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
