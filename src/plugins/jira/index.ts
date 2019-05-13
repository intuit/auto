import join from 'url-join';

import { IExtendedCommit } from '../../log-parse';
import { Auto, IPlugin } from '../../main';

interface IJiraPluginOptions {
  url: string;
}

interface IJiraCommit extends IExtendedCommit {
  jira?: {
    number: string[];
  };
}

const jira = /\[?([\w]{3,}-\d+)\]?:?\s?[-\s]*([\S ]+)?/;

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

export default class JiraPlugin implements IPlugin {
  name = 'Jira';

  readonly options: IJiraPluginOptions;

  constructor(options: IJiraPluginOptions | string) {
    this.options = typeof options === 'string' ? { url: options } : options;
  }

  apply(auto: Auto) {
    auto.hooks.onCreateChangelog.tap(this.name, changelog => {
      changelog.hooks.renderChangelogLine.tap(
        this.name,
        ([commit, currentRender]) => {
          let line = currentRender;
          const jiraCommit = parseJira(commit);

          if (jiraCommit.jira && this.options.url) {
            const link = join(this.options.url, ...jiraCommit.jira.number);
            const [, , rest] = commit.subject.match(jira);
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
