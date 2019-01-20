import { ICommit } from 'gitlog';
import { AsyncSeriesBailHook } from 'tapable';
import { VersionLabel } from './github-release';

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

export interface IChangelogHooks {
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
