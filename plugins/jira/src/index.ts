import join from 'url-join';

import { Auto, IPlugin } from '@auto-it/core';
import { IExtendedCommit } from '@auto-it/core/dist/log-parse';

interface IJiraPluginOptions {
  /** Url to a hosted JIRA instance */
  url: string;
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
      number: matches.map(match => match[1])
    }
  };
}

/** Include Jira story information in your changelogs */
export default class JiraPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Jira';

  /** The options of the plugin */
  readonly options: IJiraPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IJiraPluginOptions | string) {
    this.options = typeof options === 'string' ? { url: options } : options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateChangelog.tap(this.name, changelog => {
      changelog.hooks.renderChangelogLine.tap(
        this.name,
        ([commit, currentRender]) => {
          let line = currentRender;
          const jiraCommit = parseJira(commit);

          if (jiraCommit.jira && this.options.url) {
            const link = join(this.options.url, ...jiraCommit.jira.number);
            const [, , rest] = commit.subject.match(jira) || [];

            line = line.replace(
              jira,
              `[${jiraCommit.jira.number}](${link})${rest ? ':' : ''} $2`
            );
          }

          return [commit, line];
        }
      );
    });
  }
}
