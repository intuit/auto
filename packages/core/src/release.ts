import GHub from '@octokit/rest';
import dedent from 'dedent';
import * as fs from 'fs';
import chunk from 'lodash.chunk';
import { inc, ReleaseType } from 'semver';
import { promisify } from 'util';

import { AsyncSeriesBailHook, SyncHook } from 'tapable';
import { Memoize } from 'typescript-memoize';
import { ICreateLabelsOptions } from './auto-args';
import Changelog from './changelog';
import Git from './git';
import LogParse, { IExtendedCommit } from './log-parse';
import SEMVER, { calculateSemVerBump } from './semver';
import execPromise from './utils/exec-promise';
import { dummyLog, ILogger } from './utils/logger';
import { makeReleaseHooks } from './utils/make-hooks';

export type VersionLabel =
  | SEMVER.major
  | SEMVER.minor
  | SEMVER.patch
  | 'skip-release'
  | 'release'
  | 'prerelease';

export const defaultLabels: VersionLabel[] = [
  SEMVER.major,
  SEMVER.minor,
  SEMVER.patch,
  'skip-release',
  'release',
  'prerelease'
];

export const isVersionLabel = (label: string): label is VersionLabel =>
  defaultLabels.includes(label as VersionLabel);

export interface IAutoConfig {
  githubApi?: string;
  baseBranch: string;
  githubGraphqlApi?: string;
  name?: string;
  email?: string;
  owner?: string;
  repo?: string;
  skipReleaseLabels: string[];
  onlyPublishWithReleaseLabel?: boolean;
  noVersionPrefix?: boolean;
  plugins?: (string | [string, any])[];
  labels: ILabelDefinitionMap;
}

interface ISearchEdge {
  node: {
    number: number;
    state: 'MERGED' | 'CLOSED' | 'OPEN';
    body: string;
    labels: {
      edges: [
        {
          node: {
            name: string;
          };
        }
      ];
    };
  };
}

interface ISearchResult {
  edges: ISearchEdge[];
}

export interface ILabelDefinition {
  name: string;
  title?: string;
  color?: string;
  description?: string;
}

export interface ILabelDefinitionMap {
  [label: string]: ILabelDefinition;
}

export const defaultLabelDefinition: ILabelDefinitionMap = {
  [SEMVER.major]: {
    name: 'major',
    title: '💥  Breaking Change',
    description: 'Increment the major version when merged'
  },
  [SEMVER.minor]: {
    name: 'minor',
    title: '🚀  Enhancement',
    description: 'Increment the minor version when merged'
  },
  [SEMVER.patch]: {
    name: 'patch',
    title: '🐛  Bug Fix',
    description: 'Increment the patch version when merged'
  },
  'skip-release': {
    name: 'skip-release',
    description: 'Preserve the current version when merged'
  },
  release: {
    name: 'release',
    description: 'Create a release when this pr is merged'
  },
  prerelease: {
    name: 'prerelease',
    title: '🚧 Prerelease',
    description: 'Create a pre-release version when merged'
  },
  internal: {
    name: 'internal',
    title: '🏠  Internal',
    description: 'Changes only affect the internal API'
  },
  documentation: {
    name: 'documentation',
    title: '📝  Documentation',
    description: 'Changes only affect the documentation'
  }
};

export const getVersionMap = (labels = defaultLabelDefinition) =>
  Object.entries(labels).reduce((semVer, [label, labelDef]) => {
    if (isVersionLabel(label)) {
      semVer.set(label, labelDef.name);
    }

    return semVer;
    // tslint:disable-next-line align
  }, new Map<VersionLabel, string>());

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface IReleaseHooks {
  onCreateChangelog: SyncHook<[Changelog, SEMVER | undefined]>;
  createChangelogTitle: AsyncSeriesBailHook<[], string | void>;
  onCreateLogParse: SyncHook<[LogParse]>;
}

export function buildSearchQuery(
  owner: string,
  project: string,
  commits: IExtendedCommit[]
) {
  const repo = `${owner}/${project}`;
  const query = commits.reduce((q, commit) => {
    const subQuery = `repo:${repo} ${commit.hash}`;

    return dedent`
      ${q}

      hash_${commit.hash}: search(query: "${subQuery}", type: ISSUE, first: 1) {
        edges {
          node {
            ... on PullRequest {
              number
              state
              body
              labels(first: 10) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;
  }, '');

  if (!query) {
    return;
  }

  return `{
    ${query}
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }`;
}

function processQueryResult(
  key: string,
  result: ISearchResult,
  commitsWithoutPR: IExtendedCommit[]
) {
  const hash = key.split('hash_')[1];
  const commit = commitsWithoutPR.find(
    commitWithoutPR => commitWithoutPR.hash === hash
  );

  if (!commit) {
    return;
  }

  if (result.edges.length > 0) {
    if (result.edges[0].node.state === 'CLOSED') {
      return;
    }

    const labels: ILabelDefinition[] = result.edges[0].node.labels
      ? result.edges[0].node.labels.edges.map(edge => edge.node)
      : [];
    commit.pullRequest = {
      number: result.edges[0].node.number,
      body: result.edges[0].node.body
    };
    commit.labels = [...labels.map(label => label.name), ...commit.labels];
  } else {
    commit.labels = ['pushToBaseBranch', ...commit.labels];
  }

  commit.subject = commit.subject.split('\n')[0];

  return commit;
}

/**
 * A class for interacting with the git remote
 */
export default class Release {
  readonly options: IAutoConfig;
  readonly hooks: IReleaseHooks;

  private readonly git: Git;
  private readonly logger: ILogger;
  private readonly versionLabels: Map<VersionLabel, string>;

  constructor(
    git: Git,
    options: IAutoConfig = {
      baseBranch: 'master',
      skipReleaseLabels: [],
      labels: defaultLabelDefinition
    },
    logger: ILogger = dummyLog()
  ) {
    this.options = options;
    this.logger = logger;
    this.hooks = makeReleaseHooks();
    this.versionLabels = getVersionMap(options.labels);
    this.git = git;
  }

  /**
   * Generate a changelog from a range of commits.
   *
   * @param from sha or tag to start changelog from
   * @param to sha or tag to end changelog at (defaults to HEAD)
   */
  async generateReleaseNotes(
    from: string,
    to = 'HEAD',
    version?: SEMVER
  ): Promise<string> {
    const commits = await this.getCommitsInRelease(from, to);
    const project = await this.git.getProject();
    const changelog = new Changelog(this.logger, {
      owner: this.git.options.owner,
      repo: this.git.options.repo,
      baseUrl: project.html_url,
      labels: this.options.labels,
      baseBranch: this.options.baseBranch
    });

    this.hooks.onCreateChangelog.call(changelog, version);
    changelog.loadDefaultHooks();

    return changelog.generateReleaseNotes(commits);
  }

  async getCommitsInRelease(from: string, to = 'HEAD') {
    const allCommits = await this.getCommits(from, to);
    const allPrCommits = await Promise.all(
      allCommits
        .filter(commit => commit.pullRequest)
        .map(async commit =>
          this.git.getCommitsForPR(Number(commit.pullRequest!.number))
        )
    );
    const allPrCommitHashes = allPrCommits
      .filter(Boolean)
      .reduce(
        (all, pr) => [...all, ...pr.map(subCommit => subCommit.sha)],
        [] as string[]
      );

    const uniqueCommits = allCommits.filter(
      commit =>
        (commit.pullRequest || !allPrCommitHashes.includes(commit.hash)) &&
        !commit.subject.includes('[skip ci]')
    );

    const commitsWithoutPR = uniqueCommits.filter(
      commit => !commit.pullRequest
    );
    const batches = chunk(commitsWithoutPR, 10);
    type Results = Record<string, ISearchResult>;

    const queries = await Promise.all<Results | undefined>(
      batches.map(batch => {
        const batchQuery = buildSearchQuery(
          this.git.options.owner,
          this.git.options.repo,
          batch
        );

        if (!batchQuery) {
          return;
        }

        return this.git.graphql(batchQuery);
      })
    );
    const data = queries.filter((q): q is Results => Boolean(q));

    if (!data.length) {
      return uniqueCommits;
    }

    const commitsInRelease: (IExtendedCommit | undefined)[] = [
      ...uniqueCommits
    ];
    const logParse = await this.createLogParse();

    Promise.all(
      data.map(results =>
        Object.entries(results)
          .map(([key, result]) =>
            processQueryResult(key, result, commitsWithoutPR)
          )
          .filter((commit): commit is IExtendedCommit => Boolean(commit))
          .map(async commit => {
            const index = commitsWithoutPR.findIndex(
              commitWithoutPR => commitWithoutPR.hash === commit.hash
            );

            commitsInRelease[index] = await logParse.normalizeCommit(commit);
          })
      )
    );

    return commitsInRelease.filter(
      (commit): commit is IExtendedCommit => Boolean(commit)
    );
  }

  /**
   * Prepend a set of release notes to the changelog.md
   *
   * @param releaseNotes Release notes to prepend to the changelog
   * @param lastRelease Last release version of the code. Could be the first commit SHA
   * @param currentVersion Current version of the code
   * @param message Message to commit the changelog with
   */
  async addToChangelog(
    releaseNotes: string,
    lastRelease: string,
    currentVersion: string,
    message = 'Update CHANGELOG.md [skip ci]'
  ) {
    this.hooks.createChangelogTitle.tapPromise('Default', async () => {
      let version;

      if (lastRelease.match(/\d+\.\d+\.\d+/)) {
        version = await this.calcNextVersion(lastRelease);
      } else {
        // lastRelease is a git sha. no releases have been made
        const bump = await this.getSemverBump(lastRelease);
        version = inc(currentVersion, bump as ReleaseType);
      }

      this.logger.verbose.info('Calculated next version to be:', version);

      if (!version) {
        return '';
      }

      return this.options.noVersionPrefix || version.startsWith('v')
        ? version
        : `v${version}`;
    });

    this.logger.verbose.info('Adding new changes to changelog.');
    const title = await this.hooks.createChangelogTitle.promise();
    const date = new Date().toDateString();
    let newChangelog = '#';

    if (title) {
      newChangelog += ` ${title}`;
    }

    newChangelog += ` (${date})\n\n${releaseNotes}`;

    if (fs.existsSync('CHANGELOG.md')) {
      this.logger.verbose.info('Old changelog exists, prepending changes.');
      const oldChangelog = await readFile('CHANGELOG.md', 'utf8');
      newChangelog = `${newChangelog}\n\n---\n\n${oldChangelog}`;
    }

    await writeFile('CHANGELOG.md', newChangelog);
    this.logger.verbose.info('Wrote new changelog to filesystem.');

    await execPromise('git', ['add', 'CHANGELOG.md']);
    await execPromise('git', ['commit', '-m', `"${message}"`, '--no-verify']);
    this.logger.verbose.info('Commited new changelog.');
  }

  /**
   * Get a range of commits. The commits will have PR numbers and labels attached
   *
   * @param from Tag or SHA to start at
   * @param to Tag or SHA to end at (defaults to HEAD)
   */
  async getCommits(from: string, to = 'HEAD'): Promise<IExtendedCommit[]> {
    this.logger.verbose.info(`Getting commits from ${from} to ${to}`);

    const gitlog = await this.git.getGitLog(from, to);

    this.logger.veryVerbose.info('Got gitlog:\n', gitlog);

    const logParse = await this.createLogParse();
    const commits = await logParse.normalizeCommits(gitlog);

    this.logger.veryVerbose.info('Added labels to commits:\n', commits);

    return commits;
  }

  async addLabelsToProject(
    labels: Partial<ILabelDefinitionMap>,
    options: ICreateLabelsOptions = {}
  ) {
    const oldLabels = await this.git.getProjectLabels();
    const labelsToCreate = Object.entries(labels).filter(
      ([versionLabel, labelDef]) => {
        if (!labelDef) {
          return;
        }

        if (
          versionLabel === 'release' &&
          !this.options.onlyPublishWithReleaseLabel
        ) {
          return;
        }

        if (
          versionLabel === 'skip-release' &&
          this.options.onlyPublishWithReleaseLabel
        ) {
          return;
        }

        return true;
      }
    );

    if (!options.dryRun) {
      await Promise.all(
        labelsToCreate.map(async ([label, labelDef]) => {
          if (!labelDef) {
            return;
          }

          if (oldLabels && oldLabels.includes(labelDef.name)) {
            await this.git.updateLabel(label, labelDef);
          } else {
            await this.git.createLabel(label, labelDef);
          }
        })
      );
    }

    const repoMetadata = await this.git.getProject();
    const justLabelNames = labelsToCreate.map(([name]) => name);

    if (justLabelNames.length > 0) {
      const state = options.dryRun ? 'Would have created' : 'Created';
      this.logger.log.log(`${state} labels: ${justLabelNames.join(', ')}`);
    } else {
      const state = options.dryRun ? 'would have been' : 'were';
      this.logger.log.log(
        `No labels ${state} created, they must have already been present on your project.`
      );
    }

    if (options.dryRun) {
      return;
    }

    this.logger.log.log(
      `\nYou can see these, and more at ${repoMetadata.html_url}/labels`
    );
  }

  /**
   * Calculate the SEMVER bump over a range of commits using the PR labels
   *
   * @param from Tag or SHA to start at
   * @param to Tag or SHA to end at (defaults to HEAD)
   */
  async getSemverBump(from: string, to = 'HEAD'): Promise<SEMVER> {
    const commits = await this.getCommits(from, to);
    const labels = commits.map(commit => commit.labels);
    const { onlyPublishWithReleaseLabel, skipReleaseLabels } = this.options;
    const options = { onlyPublishWithReleaseLabel, skipReleaseLabels };

    this.logger.verbose.info('Calculating SEMVER bump using:\n', {
      labels,
      versionLabels: this.versionLabels,
      options
    });

    const result = calculateSemVerBump(labels, this.versionLabels, options);

    this.logger.verbose.success('Calculated SEMVER bump:', result);

    return result;
  }

  async calcNextVersion(lastTag: string) {
    const bump = await this.getSemverBump(lastTag);
    return inc(lastTag, bump as ReleaseType);
  }

  @Memoize()
  private async createLogParse() {
    const logParse = new LogParse();

    logParse.hooks.parseCommit.tapPromise('Author Info', async commit =>
      this.attachAuthor(commit)
    );
    logParse.hooks.parseCommit.tapPromise('PR Information', async commit =>
      this.addPrInfoToCommit(commit)
    );
    logParse.hooks.parseCommit.tapPromise('PR Commits', async commit => {
      const prsSinceLastRelease = await this.getPRsSinceLastRelease();
      return this.getPRForRebasedCommits(commit, prsSinceLastRelease);
    });

    this.hooks.onCreateLogParse.call(logParse);

    return logParse;
  }

  @Memoize()
  private async getPRsSinceLastRelease() {
    let lastRelease: { published_at: string };

    try {
      lastRelease = await this.git.getLatestReleaseInfo();
    } catch (error) {
      const firstCommit = await this.git.getFirstCommit();

      lastRelease = {
        published_at: await this.git.getCommitDate(firstCommit)
      };
    }

    if (!lastRelease) {
      return [];
    }

    const prsSinceLastRelease = await this.git.searchRepo({
      q: `is:pr is:merged merged:>=${lastRelease.published_at}`
    });

    if (!prsSinceLastRelease || !prsSinceLastRelease.items) {
      return [];
    }

    const data = await Promise.all(prsSinceLastRelease.items.map(
      async (pr: { number: number }) =>
        this.git.getPullRequest(Number(pr.number))
    ) as GHub.Response<GHub.PullsGetResponse>[]);

    return data.map(item => item.data);
  }

  /**
   * Add the PR info (labels and body) to the commit
   *
   * @param commits Commits to modify
   */
  private async addPrInfoToCommit(commit: IExtendedCommit) {
    if (!commit.labels) {
      commit.labels = [];
    }

    if (commit.pullRequest) {
      const info = await this.git.getPr(commit.pullRequest.number);

      if (!info || !info.data) {
        return commit;
      }

      const labels = info ? info.data.labels.map(l => l.name) : [];
      commit.labels = [...new Set([...labels, ...commit.labels])];
      commit.pullRequest.body = info.data.body;
    }

    return commit;
  }

  /**
   * Commits from rebased PRs do not have messages that tie them to a PR
   * Instead we have to find all PRs since the last release and try to match
   * their merge commit SHAs.
   *
   * @param commits Commits to modify
   */
  private getPRForRebasedCommits(
    commit: IExtendedCommit,
    pullRequests: GHub.PullsGetResponse[]
  ) {
    const matchPr = pullRequests.find(
      pr => pr.merge_commit_sha === commit.hash
    );

    if (!commit.pullRequest && matchPr) {
      const labels = matchPr.labels.map(label => label.name) || [];
      commit.labels = [...new Set([...labels, ...commit.labels])];
      commit.pullRequest = {
        number: matchPr.number
      };
    }

    return commit;
  }

  private async attachAuthor(commit: IExtendedCommit) {
    let resolvedAuthors = [];

    // If there is a pull request we will attempt to get the authors
    // from any commit in the PR
    if (commit.pullRequest) {
      const prCommits = await this.git.getCommitsForPR(
        Number(commit.pullRequest.number)
      );

      if (!prCommits) {
        return commit;
      }

      resolvedAuthors = await Promise.all(
        prCommits.map(async prCommit => {
          if (!prCommit || !prCommit.author) {
            return;
          }

          return {
            ...prCommit.author,
            ...(await this.git.getUserByUsername(prCommit.author.login))
          };
        })
      );
    } else if (commit.authorEmail) {
      const author = commit.authorEmail.includes('@users.noreply.github.com')
        ? await this.git.getUserByUsername(
            commit.authorEmail.split('@users')[0]
          )
        : await this.git.getUserByEmail(commit.authorEmail);

      resolvedAuthors.push({
        email: commit.authorEmail,
        name: commit.authorName,
        ...author
      });
    }

    commit.authors = resolvedAuthors.map(author => ({
      ...author,
      ...(author && author.login ? { username: author.login } : {})
    }));

    commit.authors.map(author => {
      this.logger.veryVerbose.info(
        `Found author: ${author.username} ${author.email} ${author.name}`
      );
    });

    return commit;
  }
}
