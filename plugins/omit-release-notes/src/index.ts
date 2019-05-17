import { Auto, IPlugin } from '@intuit-auto/core';

interface IReleaseNotesPluginOptions {
  username?: string | string[];
  email?: string | string[];
  name?: string | string[];
  labels?: string | string[];
}

const arrayify = <T>(arr: T | T[]): T[] =>
  Array.isArray(arr) || arr === undefined ? arr : [arr];

export default class ReleaseNotesPlugin implements IPlugin {
  name = 'Omit Release Notes';

  readonly options: {
    username: string[];
    email: string[];
    name: string[];
    labels: string[];
  };

  constructor(options: IReleaseNotesPluginOptions) {
    this.options = {
      username: options.username ? arrayify(options.username) : [],
      email: options.email ? arrayify(options.email) : [],
      name: options.name ? arrayify(options.name) : [],
      labels: options.labels ? arrayify(options.labels) : []
    };
  }

  apply(auto: Auto) {
    auto.hooks.onCreateChangelog.tap(this.name, changelog => {
      changelog.hooks.omitReleaseNotes.tap(this.name, commit => {
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
          )
        ) {
          return true;
        }
      });
    });
  }
}
