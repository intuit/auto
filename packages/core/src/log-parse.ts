import { AsyncSeriesBailHook, AsyncSeriesWaterfallHook } from "tapable";
import { makeLogParseHooks } from "./utils/make-hooks";

export interface ICommitAuthor {
  /** Author's name */
  name?: string | null;
  /** Author's email */
  email?: string | null;
  /** Author's username */
  username?: string;
  /** The commit this author created */
  hash?: string;
  /** The type of user */
  type?: "Bot" | "User" | string;
}

export interface IPullRequest {
  /** The issue number for the pull request */
  number: number;
  /** The base branch the pull request is on */
  base?: string;
  /** The body of the PR (opening comment) */
  body?: string;
}

export interface ICommit {
  /**
   *
   */
  hash: string;
  /**
   *
   */
  authorName?: string;
  /**
   *
   */
  authorEmail?: string;
  /**
   *
   */
  subject: string;
  /**
   *
   */
  rawBody?: string;
  /**
   *
   */
  labels?: string[];
  /**
   *
   */
  files: string[];
}

export type IExtendedCommit = ICommit & {
  /** The authors that contributed to the pull request */
  authors: ICommitAuthor[];
  /** The pull request information */
  pullRequest?: IPullRequest;
  /** Labels associated with the commit */
  labels: string[];
};

/** Parse the PR information for the merge commit message */
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
      base: prMatch[2],
    },
    subject: prMatch[3].trim(),
  };
}

/** Parse the PR information for the squashed commit message */
export function parseSquashPR(commit: IExtendedCommit): IExtendedCommit {
  const firstLine = commit.subject.split("\n")[0];
  const squashMerge = /\(#(\d+)\)$/;

  const squashMergeMatch = firstLine.match(squashMerge);

  if (!squashMergeMatch) {
    return commit;
  }

  return {
    ...commit,
    pullRequest: {
      number: Number(squashMergeMatch[1]),
    },
    subject: firstLine
      .substr(0, firstLine.length - squashMergeMatch[0].length)
      .trim(),
  };
}

export interface ILogParseHooks {
  /** Parse information about a commit from a commit. Here is where `auto` gets the PR number from the merge commits. */
  parseCommit: AsyncSeriesWaterfallHook<[IExtendedCommit]>;
  /** Choose to omit certain commits. If you return true the commit will be omitted. Be sure to return nothing if you don't want the commit omitted. */
  omitCommit: AsyncSeriesBailHook<[IExtendedCommit], boolean | void>;
}

/**
 * Parse the gitlog for commits that are PRs and attach their labels.
 * This class can also be tapped into via plugin to parse commits
 * in other ways (ex: conventional-commits)
 */
export default class LogParse {
  /** Plugin entry points */
  hooks: ILogParseHooks;

  /** Initialize the log parser and tap the default functionality  */
  constructor() {
    this.hooks = makeLogParseHooks();

    this.hooks.parseCommit.tap("Merge Commit", parsePR);
    this.hooks.parseCommit.tap("Squash Merge Commit", parseSquashPR);
    this.hooks.parseCommit.tap(
      "Strip consecutive white-space in Titles",
      (commit) => {
        const [firstLine, ...lines] = commit.subject.split("\n");

        commit.subject = [
          firstLine.replace(/[^\S\r\n]{2,}/g, " "),
          ...lines,
        ].join("\n");

        return commit;
      }
    );
  }

  /** Run the log parser over a set of commits */
  async normalizeCommits(commits: ICommit[]): Promise<IExtendedCommit[]> {
    const eCommits = await Promise.all(
      commits.map(async (commit) => this.normalizeCommit(commit))
    );

    return eCommits.filter(Boolean) as IExtendedCommit[];
  }

  /** Process a commit to find it's labels and PR information */
  async normalizeCommit(commit: ICommit): Promise<IExtendedCommit | undefined> {
    const extended = await this.hooks.parseCommit.promise({
      labels: [],
      ...commit,
      authors: [{ name: commit.authorName, email: commit.authorEmail }],
    });
    const shouldOmit = await this.hooks.omitCommit.promise(extended);

    if (shouldOmit) {
      return;
    }

    return extended;
  }
}
