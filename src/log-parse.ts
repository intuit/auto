import { ICommit } from 'gitlog';
import { AsyncSeriesBailHook } from 'tapable';
import { URL } from 'url';
import join from 'url-join';
import { VersionLabel } from './github-release';
import { ILogger } from './utils/logger';
import { makeLogHooks } from './utils/make-hooks';

export interface ICommitAuthor {
  name?: string;
  email?: string;
  username?: string;
}

export interface IGenerateReleaseNotesOptions {
  owner: string;
  repo: string;
  baseUrl: string;
  jira?: string;
  changelogTitles: { [label: string]: string };
  versionLabels: Map<VersionLabel, string>;
}

export interface IPullRequest {
  number: number;
  base?: string;
}

export type IExtendedCommit = ICommit & {
  authors: ICommitAuthor[];
  pullRequest?: IPullRequest;
  jira?: {
    number: string[];
  };
  labels: string[];
  packages?: string[];
};

type CommitParseFunction = (
  commit: IExtendedCommit
) => IExtendedCommit | undefined;

export interface ILogParseHooks {
  renderChangelogLine: AsyncSeriesBailHook<
    [IExtendedCommit[], (commit: IExtendedCommit) => Promise<string>],
    string[] | void
  >;
  renderChangelogTitle: AsyncSeriesBailHook<
    [string, { [label: string]: string }],
    string | void
  >;
  renderChangelogAuthor: AsyncSeriesBailHook<
    [ICommitAuthor, IExtendedCommit, IGenerateReleaseNotesOptions],
    string | void
  >;
  renderChangelogAuthorLine: AsyncSeriesBailHook<
    [ICommitAuthor, string],
    string | void
  >;
}

export function filterServiceAccounts(
  commit: IExtendedCommit
): IExtendedCommit | undefined {
  const SERVICE_ACCOUNTS = ['pdbf'];

  if (commit.authorName && SERVICE_ACCOUNTS.includes(commit.authorName)) {
    return;
  }

  return commit;
}

export function parsePR(commit: IExtendedCommit): IExtendedCommit {
  const merge = /Merge pull request #(\d+) from (.+)\n([\S\s]+)/;
  const prMatch = commit.subject.match(merge);

  if (!prMatch) {
    return commit;
  }

  return {
    ...commit,
    pullRequest: {
      number: Number(prMatch[1]),
      base: prMatch[2]
    },
    subject: prMatch[3].trim()
  };
}

export function parseSquashPR(
  commit: IExtendedCommit
): IExtendedCommit | undefined {
  const firstLine = commit.subject.split('\n')[0];
  const squashMerge = /\(#(\d+)\)$/;

  const squashMergeMatch = firstLine.match(squashMerge);

  if (!squashMergeMatch) {
    return commit;
  }

  return {
    ...commit,
    pullRequest: {
      number: Number(squashMergeMatch[1])
    },
    subject: firstLine
      .substr(0, firstLine.length - squashMergeMatch[0].length)
      .trim()
  };
}

export function parseJira(commit: IExtendedCommit): IExtendedCommit {
  // Support 'JIRA-XXX:' and '[JIRA-XXX]' and '[JIRA-XXX] - '
  const jira = /^\[?([\w]{3,}-\d+)\]?:?\s?[-\s]*([\S ]+)?/;
  const matches = [];

  let currentMatch = commit.subject.match(jira);

  while (currentMatch) {
    matches.push(currentMatch);
    currentMatch = currentMatch[2].match(jira);
  }

  if (!matches.length) {
    return commit;
  }

  return {
    ...commit,
    jira: {
      number: matches.map(match => match[1])
    },
    subject: matches[matches.length - 1][2].trim()
  };
}

function normalizeCommit(commit: ICommit): IExtendedCommit | undefined {
  const parsers: CommitParseFunction[] = [
    filterServiceAccounts,
    parsePR,
    parseSquashPR,
    parseJira
  ];

  const extended: IExtendedCommit = {
    labels: [],
    ...commit,
    authors: [{ name: commit.authorName, email: commit.authorEmail }]
  };

  return parsers.reduce(
    (prev: IExtendedCommit | undefined, parser) =>
      prev === undefined ? undefined : parser(prev),
    extended
  );
}

export function normalizeCommits(commits: ICommit[]): IExtendedCommit[] {
  return commits.map(normalizeCommit).filter(Boolean) as IExtendedCommit[];
}

const filterLabel = (commits: IExtendedCommit[], label: string) =>
  commits.filter(commit => commit.labels.includes(label));

export default class LogParse {
  public readonly hooks: ILogParseHooks;

  private readonly logger: ILogger;
  private readonly options: IGenerateReleaseNotesOptions;

  constructor(logger: ILogger, options: IGenerateReleaseNotesOptions) {
    this.logger = logger;
    this.options = options;
    this.hooks = makeLogHooks();
    this.options.changelogTitles.pushToMaster = '⚠️  Pushed to master';
  }

  public loadDefaultHooks() {
    this.hooks.renderChangelogAuthor.tap('Default', (author, commit) =>
      this.createUserLink(author, commit)
    );
    this.hooks.renderChangelogAuthorLine.tap('Default', (author, user) => {
      const authorString =
        author.name && user ? `${author.name} (${user})` : user;
      return authorString ? `- ${authorString}` : undefined;
    });
    this.hooks.renderChangelogLine.tapPromise(
      'Default',
      async (currCommits, renderLine) =>
        Promise.all(currCommits.map(async commit => renderLine(commit)))
    );
    this.hooks.renderChangelogTitle.tap(
      'Default',
      (label, changelogTitles) => `#### ${changelogTitles[label]}\n`
    );
  }

  // Every Commit will either be a PR, jira story, or push to master (patch)
  public async generateReleaseNotes(
    commits: IExtendedCommit[]
  ): Promise<string> {
    if (commits.length === 0) {
      return '';
    }

    this.logger.verbose.info('Generating release notes for:\n', commits);

    const split = this.splitCommits(commits);

    this.logger.verbose.info('Split commits into groups');
    this.logger.veryVerbose.info('\n', split);

    const sections: string[] = [];

    await this.createLabelSection(split, sections);

    this.logger.verbose.info('Added groups to changelog');

    await this.createAuthorSection(split, sections);

    this.logger.verbose.info('Added authors to changelog');

    const result = sections.join('\n\n');

    this.logger.verbose.info('Successfully generated release notes.');

    return result;
  }

  public createUserLink(author: ICommitAuthor, commit: IExtendedCommit) {
    const githubUrl = new URL(this.options.baseUrl).origin;

    if (author.username === 'invalid-email-address') {
      return;
    }

    return author.username
      ? `[@${author.username}](${join(githubUrl, author.username)})`
      : author.email || commit.authorEmail;
  }

  /**
   * Split commits into changelogTitle sections.
   */
  private splitCommits(
    commits: IExtendedCommit[]
  ): { [key: string]: IExtendedCommit[] } {
    let currentCommits = [...commits];

    commits
      .filter(commit => commit.labels.length === 0)
      .map(commit => commit.labels.push('patch'));

    return Object.assign(
      {},
      ...Object.keys(this.options.changelogTitles).map(label => {
        const matchedCommits = filterLabel(
          currentCommits,
          this.options.versionLabels.get(label as VersionLabel) || label
        );

        if (matchedCommits.length === 0) {
          return {};
        }

        currentCommits = currentCommits.filter(
          commit => !matchedCommits.includes(commit)
        );

        return {
          [label]: matchedCommits
        };
      })
    );
  }

  private async createUserLinkList(commit: IExtendedCommit) {
    const result = new Set<string>();

    await Promise.all(
      commit.authors.map(async author => {
        const link = await this.hooks.renderChangelogAuthor.promise(
          author,
          commit,
          this.options
        );

        if (link) {
          result.add(link);
        }
      })
    );

    return [...result].join(' ');
  }

  private async generateCommitNote(commit: IExtendedCommit) {
    let jira = '';
    let pr = '';

    if (commit.jira && this.options.jira) {
      const link = join(this.options.jira, ...commit.jira.number);
      jira = `[${commit.jira.number}](${link}): `;
    }

    if (commit.pullRequest) {
      const prLink = join(
        this.options.baseUrl,
        'pull',
        commit.pullRequest.number.toString()
      );
      pr = `[#${commit.pullRequest.number}](${prLink})`;
    }

    const user = await this.createUserLinkList(commit);

    return `- ${jira}${commit.subject} ${pr}${user ? ` (${user})` : ''}`;
  }

  private async createAuthorSection(
    split: { [key: string]: IExtendedCommit[] },
    sections: string[]
  ) {
    const authors = new Set<string>();
    const commits = Object.values(split).reduce(
      (
        labeledCommits: IExtendedCommit[],
        sectionCommits: IExtendedCommit[]
      ) => [...labeledCommits, ...sectionCommits],
      []
    );

    await Promise.all(
      commits.map(async commit => {
        commit.authors.map(async author => {
          if (author.username === 'invalid-email-address') {
            return;
          }

          const user = await this.hooks.renderChangelogAuthor.promise(
            author,
            commit,
            this.options
          );
          const authorEntry = await this.hooks.renderChangelogAuthorLine.promise(
            author,
            user as string
          );

          if (authorEntry && !authors.has(authorEntry)) {
            authors.add(authorEntry);
          }
        });
      })
    );

    if (authors.size > 0) {
      let authorSection = `#### Authors: ${authors.size}\n\n`;
      authorSection += [...authors].join('\n');
      sections.push(authorSection);
    }
  }

  private async createLabelSection(
    split: { [key: string]: IExtendedCommit[] },
    sections: string[]
  ) {
    await Promise.all(
      Object.entries(split).map(async ([label, labelCommits]) => {
        const title = await this.hooks.renderChangelogTitle.promise(
          label,
          this.options.changelogTitles
        );
        const lines = await this.hooks.renderChangelogLine.promise(
          labelCommits,
          async commit => this.generateCommitNote(commit)
        );

        sections.push([title, ...lines].join('\n'));
      })
    );
  }
}
