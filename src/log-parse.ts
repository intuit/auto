import { ICommit } from 'parse-git';
import { URL } from 'url';
import join from 'url-join';
import { ILogger } from './GithubRelease';

interface ICommitAuthor {
  name: string;
  email?: string;
  username?: string;
}

interface IGenerateReleaseNotesOptions {
  owner: string;
  repo: string;
  baseUrl: string;
  jira?: string;
  logger: ILogger;
  changelogTitles: { [label: string]: string };
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
    : author.email || commit.author.email;
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

  if (SERVICE_ACCOUNTS.includes(commit.author.name)) {
    return;
  }

  return commit;
}

export function parsePR(commit: IExtendedCommit): IExtendedCommit {
  const merge = /Merge pull request #(\d+) from (.+)\n([\S\s]+)/;
  const prMatch = commit.comment.match(merge);

  if (!prMatch) {
    return commit;
  }

  return {
    ...commit,
    pullRequest: {
      number: prMatch[1],
      base: prMatch[2]
    },
    comment: prMatch[3]
  };
}

export function parseSquashPR(
  commit: IExtendedCommit
): IExtendedCommit | undefined {
  const firstLine = commit.comment.split('\n')[0];
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
    comment: firstLine
      .substr(0, firstLine.length - squashMergeMatch[0].length)
      .trim()
  };
}

export function parseJira(commit: IExtendedCommit): IExtendedCommit {
  // Support 'JIRA-XXX:' and '[JIRA-XXX]' and '[JIRA-XXX] - '
  const jira = /^\[?([\w]{3,}-\d+)\]?:?\s?[-\s]*([\S ]+)?/;
  const matches = [];

  let currentMatch = commit.comment.match(jira);

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
    comment: matches[matches.length - 1][2]
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
    authors: [commit.author]
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
): string | undefined {
  let jira = '';
  let pr = '';

  if (commit.jira && options.jira) {
    const link = options.jira ? join(options.jira, ...commit.jira.number) : '';
    jira = `[${commit.jira.number}](${link}): `;
  }

  if (commit.pullRequest) {
    const prLink = join(options.baseUrl, 'pull', commit.pullRequest.number);
    pr = `[#${commit.pullRequest.number}](${prLink})`;
  }

  const user = createUserLinkList(commit, options);

  return `- ${jira}${commit.comment} ${pr}${user ? ` (${user})` : ''}`;
}

const filterLabel = (commits: IExtendedCommit[], label: string) =>
  commits.filter(commit => commit.labels.includes(label));

/**
 * Split commits into changelogTitle sections
 */
function splitCommits(
  commits: IExtendedCommit[],
  changelogTitles: { [label: string]: string }
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
      const matchedCommits = filterLabel(currentCommits, label);

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

interface INotePartition {
  [key: string]: string[];
}

/**
 * Attempt to create a map of monorepo packages
 */
function partitionPackages(
  labelCommits: IExtendedCommit[],
  lineRender: (commit: IExtendedCommit) => string | undefined
) {
  const packageCommits: INotePartition = {};

  labelCommits.map(commit => {
    const line = lineRender(commit);

    if (line) {
      const packages =
        commit.packages && commit.packages.length
          ? commit.packages.map(p => `\`${p}\``).join(', ')
          : 'monorepo';

      if (!packageCommits[packages]) {
        packageCommits[packages] = [];
      }

      packageCommits[packages].push(line);
    }
  });

  return packageCommits;
}

function createLabelSection(
  split: { [key: string]: IExtendedCommit[] },
  options: IGenerateReleaseNotesOptions,
  sections: string[]
) {
  Object.entries(split).forEach(([label, labelCommits]) => {
    const packageCommits = partitionPackages(labelCommits, commit =>
      generateCommitNote(commit, options)
    );

    const pkgCount = Object.keys(packageCommits).length;
    const title = `#### ${options.changelogTitles[label]}`;
    const hasRepoCommits =
      packageCommits.monorepo && packageCommits.monorepo.length > 0;

    if (pkgCount > 0 && (pkgCount !== 1 || !packageCommits.monorepo)) {
      const section = [title];

      if (hasRepoCommits) {
        packageCommits.monorepo.forEach(note => section.push(note));
        delete packageCommits.monorepo;
      }

      Object.entries(packageCommits).map(([pkg, commits]) => {
        section.push(`- ${pkg}`);
        commits.map(note => section.push(`  ${note}`));
      });

      sections.push(section.join('\n'));
    } else if (hasRepoCommits) {
      sections.push([title, ...packageCommits.monorepo].join('\n'));
    }
  });
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
        const authorString = `- ${author.name} (${user})`;

        if (!commitAuthors.includes(authorString)) {
          commitAuthors.push(authorString);
        }
      });

      return commitAuthors;
    }, []);

  if (authors.length > 0) {
    let authorSection = `#### Authors: ${authors.length}\n`;
    authorSection += authors.join('\n');
    sections.push(authorSection);
  }
}

export default function generateReleaseNotes(
  commits: IExtendedCommit[],
  options: IGenerateReleaseNotesOptions
): string {
  if (commits.length === 0) {
    return '';
  }

  options.logger.verbose.info('Generating release notes for:\n', commits);

  const split = splitCommits(commits, options.changelogTitles);

  options.logger.verbose.info('Split commits into groups');
  options.logger.veryVerbose.info('\n', split);

  const sections: string[] = [];

  createLabelSection(split, options, sections);

  options.logger.verbose.info('Added groups to changelog');

  createAuthorSection(split, options, sections);

  options.logger.verbose.info('Added authors to changelog');

  const result = sections.join('\n\n');

  options.logger.verbose.info('Successfully generated release notes.');

  return result;
}
