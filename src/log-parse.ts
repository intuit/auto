import { ICommit } from 'gitlog';
import { URL } from 'url';
import join from 'url-join';
import { VersionLabel } from './github-release';
import { renderChangelogLineHook } from './main';
import { ILogger } from './utils/logger';

interface ICommitAuthor {
  name?: string;
  email?: string;
  username?: string;
}

interface IGenerateReleaseNotesOptions {
  owner: string;
  repo: string;
  baseUrl: string;
  jira?: string;
  changelogTitles: { [label: string]: string };
  versionLabels: Map<VersionLabel, string>;
  renderChangelogLine: renderChangelogLineHook;
}

export type IExtendedCommit = ICommit & {
  authors: ICommitAuthor[];
  pullRequest?: {
    number: string;
    base?: string;
  };
  jira?: {
    number: string[];
  };
  labels: string[];
  packages?: string[];
};

type CommitParseFunction = (
  commit: IExtendedCommit
) => IExtendedCommit | undefined;

export const createUserLink = (
  author: ICommitAuthor,
  commit: IExtendedCommit,
  options: IGenerateReleaseNotesOptions
) => {
  const githubUrl = new URL(options.baseUrl).origin;

  if (author.username === 'invalid-email-address') {
    return;
  }

  return author.username
    ? `[@${author.username}](${join(githubUrl, author.username)})`
    : author.email || commit.authorEmail;
};

const createUserLinkList = (
  commit: IExtendedCommit,
  options: IGenerateReleaseNotesOptions
) => {
  const result = new Set<string>();

  commit.authors.forEach(author => {
    const link = createUserLink(author, commit, options);

    if (link) {
      result.add(link);
    }
  });

  return [...result].join(' ');
};

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
      number: prMatch[1],
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
      number: squashMergeMatch[1]
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

function generateCommitNote(
  commit: IExtendedCommit,
  options: IGenerateReleaseNotesOptions
) {
  let jira = '';
  let pr = '';

  if (commit.jira && options.jira) {
    const link = join(options.jira, ...commit.jira.number);
    jira = `[${commit.jira.number}](${link}): `;
  }

  if (commit.pullRequest) {
    const prLink = join(options.baseUrl, 'pull', commit.pullRequest.number);
    pr = `[#${commit.pullRequest.number}](${prLink})`;
  }

  const user = createUserLinkList(commit, options);

  return `- ${jira}${commit.subject} ${pr}${user ? ` (${user})` : ''}`;
}

const filterLabel = (commits: IExtendedCommit[], label: string) =>
  commits.filter(commit => commit.labels.includes(label));

/**
 * Split commits into changelogTitle sections
 */
function splitCommits(
  commits: IExtendedCommit[],
  changelogTitles: { [label: string]: string },
  versionLabels: Map<VersionLabel, string>
): { [key: string]: IExtendedCommit[] } {
  let currentCommits = [...commits];

  commits
    .filter(
      commit =>
        (commit.pullRequest || commit.jira) && commit.labels.length === 0
    )
    .map(commit => commit.labels.push('patch'));

  return Object.assign(
    {},
    ...Object.keys(changelogTitles).map(label => {
      const matchedCommits = filterLabel(
        currentCommits,
        versionLabels.get(label as VersionLabel) || label
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

async function createLabelSection(
  split: { [key: string]: IExtendedCommit[] },
  options: IGenerateReleaseNotesOptions,
  sections: string[]
) {
  options.renderChangelogLine.tap('Default', (commits, renderLine) =>
    commits.map(commit => renderLine(commit))
  );

  await Promise.all(
    Object.entries(split).map(async ([label, labelCommits]) => {
      const title = `#### ${options.changelogTitles[label]}\n`;
      const lines = await options.renderChangelogLine.promise(
        labelCommits,
        commit => generateCommitNote(commit, options)
      );

      sections.push([title, ...lines].join('\n'));
    })
  );
}

function createAuthorSection(
  split: { [key: string]: IExtendedCommit[] },
  options: IGenerateReleaseNotesOptions,
  sections: string[]
) {
  const authors = Object.values(split)
    .reduce(
      (
        labeledCommits: IExtendedCommit[],
        sectionCommits: IExtendedCommit[]
      ) => [...labeledCommits, ...sectionCommits],
      []
    )
    .reduce((commitAuthors: string[], commit) => {
      commit.authors.map(author => {
        if (author.username === 'invalid-email-address') {
          return commitAuthors;
        }

        const user = createUserLink(author, commit, options);
        const authorString =
          author.name && user ? `${author.name} (${user})` : user;
        const authorEntry = `- ${authorString}`;

        if (authorString && !commitAuthors.includes(authorEntry)) {
          commitAuthors.push(authorEntry);
        }
      });

      return commitAuthors;
    }, []);

  if (authors.length > 0) {
    let authorSection = `#### Authors: ${authors.length}\n\n`;
    authorSection += authors.join('\n');
    sections.push(authorSection);
  }
}

export default async function generateReleaseNotes(
  commits: IExtendedCommit[],
  logger: ILogger,
  options: IGenerateReleaseNotesOptions
): Promise<string> {
  if (commits.length === 0) {
    return '';
  }

  logger.verbose.info('Generating release notes for:\n', commits);

  const split = splitCommits(
    commits,
    options.changelogTitles,
    options.versionLabels
  );

  logger.verbose.info('Split commits into groups');
  logger.veryVerbose.info('\n', split);

  const sections: string[] = [];

  await createLabelSection(split, options, sections);

  logger.verbose.info('Added groups to changelog');

  createAuthorSection(split, options, sections);

  logger.verbose.info('Added authors to changelog');

  const result = sections.join('\n\n');

  logger.verbose.info('Successfully generated release notes.');

  return result;
}
