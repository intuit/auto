import { ICommit } from 'gitlog';
import { AsyncSeriesBailHook, AsyncSeriesWaterfallHook } from 'tapable';
import { makeLogParseHooks } from './utils/make-hooks';

export interface ICommitAuthor {
  name?: string;
  email?: string;
  username?: string;
}

export interface IPullRequest {
  number: number;
  base?: string;
  body?: string;
}

export type IExtendedCommit = ICommit & {
  authors: ICommitAuthor[];
  pullRequest?: IPullRequest;
  labels: string[];
  packages?: string[];
};

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

export function parseSquashPR(commit: IExtendedCommit): IExtendedCommit {
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

export interface ILogParseHooks {
  parseCommit: AsyncSeriesWaterfallHook<[IExtendedCommit]>;
  omitCommit: AsyncSeriesBailHook<[IExtendedCommit], boolean | void>;
}

export default class LogParse {
  hooks: ILogParseHooks;

  constructor() {
    this.hooks = makeLogParseHooks();

    this.hooks.parseCommit.tap('Merge Commit', parsePR);
    this.hooks.parseCommit.tap('Squash Merge Commit', parseSquashPR);
  }

  async normalizeCommits(commits: ICommit[]): Promise<IExtendedCommit[]> {
    const eCommits = await Promise.all(
      commits.map(async commit => this.normalizeCommit(commit))
    );

    return eCommits.filter(Boolean) as IExtendedCommit[];
  }

  async normalizeCommit(commit: ICommit): Promise<IExtendedCommit | undefined> {
    const extended = await this.hooks.parseCommit.promise({
      labels: [],
      ...commit,
      authors: [{ name: commit.authorName, email: commit.authorEmail }]
    });
    const shouldOmit = await this.hooks.omitCommit.promise(extended);

    if (shouldOmit) {
      return;
    }

    return extended;
  }
}
