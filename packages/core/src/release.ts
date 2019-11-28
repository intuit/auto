import { GraphQlQueryResponse } from '@octokit/graphql/dist-types/types';
import GHub from '@octokit/rest';
import on from 'await-to-js';
import dedent from 'dedent';
import * as fs from 'fs';
import chunk from 'lodash.chunk';
import { inc, ReleaseType } from 'semver';
import { promisify } from 'util';

import { AsyncSeriesBailHook, SyncHook } from 'tapable';
import { Memoize as memoize } from 'typescript-memoize';
import {
  ICreateLabelsOptions,
  IAuthorOptions,
  GlobalOptions
} from './auto-args';
import Changelog from './changelog';
import Git from './git';
import LogParse, { ICommitAuthor, IExtendedCommit } from './log-parse';
import SEMVER, { calculateSemVerBump, IVersionLabels } from './semver';
import execPromise from './utils/exec-promise';
import { dummyLog, ILogger } from './utils/logger';
import { makeReleaseHooks } from './utils/make-hooks';

export type VersionLabel =
  | SEMVER.major
  | SEMVER.minor
  | SEMVER.patch
  | 'skip-release'
  | 'release';

export const defaultLabels: VersionLabel[] = [
  SEMVER.major,
  SEMVER.minor,
  SEMVER.patch,
  'skip-release',
  'release'
];

/** Determine if a label is a label used for versioning */
export const isVersionLabel = (label: string): label is VersionLabel =>
  defaultLabels.includes(label as VersionLabel);

export type IAutoConfig = IAuthorOptions &
  GlobalOptions & {
    /** The branch that is used as the base. defaults to master */
    baseBranch: string;
    /** Labels to count as "skip-release" */
    skipReleaseLabels: string[];
    /** Instead of publishing every PR only publish when "release" label is present */
    onlyPublishWithReleaseLabel?: boolean;
    /** Whether to prefix the version with a "v" */
    noVersionPrefix?: boolean;
    /** Plugins to initialize "auto" with */
    plugins?: (string | [string, number | boolean | string | object])[];
    /** The labels configured by the user */
    labels: ILabelDefinitionMap;
  };

interface ISearchEdge {
  /** Graphql search node */
  node: {
    /** PR number */
    number: number;
    /** State of the PR */
    state: 'MERGED' | 'CLOSED' | 'OPEN';
    /** Body of the PR */
    body: string;
    /** Labels attached to the PR */
    labels: {
      /** Edges of the Query */
      edges: [
        {
          /** Graphql search node */
          node: {
            /** Name of the label */
            name: string;
          };
        }
      ];
    };
  };
}

interface ISearchResult {
  /** Results in the search */
  edges: ISearchEdge[];
}

export interface ILabelDefinition {
  /** The label text */
  name: string;
  /** A title to put in the changelog for the label */
  title?: string;
  /** The color of the label */
  color?: string;
  /** The description of the label */
  description?: string;
}

export interface ILabelDefinitionMap {
  [label: string]: ILabelDefinition[] | undefined;
}

export const defaultLabelDefinition: ILabelDefinitionMap = {
  [SEMVER.major]: [
    {
      name: 'major',
      title: '💥  Breaking Change',
      description: 'Increment the major version when merged'
    }
  ],
  [SEMVER.minor]: [
    {
      name: 'minor',
      title: '🚀  Enhancement',
      description: 'Increment the minor version when merged'
    }
  ],
  [SEMVER.patch]: [
    {
      name: 'patch',
      title: '🐛  Bug Fix',
      description: 'Increment the patch version when merged'
    }
  ],
  'skip-release': [
    {
      name: 'skip-release',
      description: 'Preserve the current version when merged'
    }
  ],
  release: [
    {
      name: 'release',
      description: 'Create a release when this pr is merged'
    }
  ],
  internal: [
    {
      name: 'internal',
      title: '🏠  Internal',
      description: 'Changes only affect the internal API'
    }
  ],
  documentation: [
    {
      name: 'documentation',
      title: '📝  Documentation',
      description: 'Changes only affect the documentation'
    }
  ]
};

/** Construct a map of label => semver label */
export const getVersionMap = (labels = defaultLabelDefinition) =>
  Object.entries(labels).reduce((semVer, [label, labelDef]) => {
    if (isVersionLabel(label) && labelDef) {
      semVer.set(
        label,
        labelDef.map(l => l.name)
      );
    }

    return semVer;
  }, new Map() as IVersionLabels);

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface IReleaseHooks {
  /** This is where you hook into the changelog's hooks. This hook is exposed for convenience on during `this.hooks.onCreateRelease` and at the root `this.hooks` */
  onCreateChangelog: SyncHook<[Changelog, SEMVER | undefined]>;
  /** Control the titles in the `CHANGELOG.md` */
  createChangelogTitle: AsyncSeriesBailHook<[], string | void>;
  /** This is where you hook into the LogParse's hooks. This hook is exposed for convenience on during `this.hooks.onCreateRelease` and at the root `this.hooks` */
  onCreateLogParse: SyncHook<[LogParse]>;
}

/**
 * Generate a GitHub graphql query to find all the commits related
 * to a PR.
 */
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

/** Use the graphql query result to fill in more information about a commit */
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
  /** Plugin entry points */
  readonly hooks: IReleaseHooks;
  /** Options Release was initialized with */
  readonly options: IAutoConfig;

  /** A class that handles interacting with git and GitHub */
  private readonly git: Git;
  /** A logger that uses log levels */
  private readonly logger: ILogger;
  /** The version bump being used during "shipit" */
  private readonly versionLabels: IVersionLabels;

  /** Initialize the release manager */
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

  /** Make the class that will generate changelogs for the project */
  @memoize()
  async makeChangelog(version?: SEMVER) {
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

    return changelog;
  }

  /**
   * Generate a changelog from a range of commits.
   *
   * @param from - sha or tag to start changelog from
   * @param to - sha or tag to end changelog at (defaults to HEAD)
   */
  async generateReleaseNotes(
    from: string,
    to = 'HEAD',
    version?: SEMVER
  ): Promise<string> {
    const commits = await this.getCommitsInRelease(from, to);
    const changelog = await this.makeChangelog(version);

    return changelog.generateReleaseNotes(commits);
  }

  /** Get all the commits that will be included in a release */
  async getCommitsInRelease(from: string, to = 'HEAD') {
    const allCommits = await this.getCommits(from, to);
    const allPrCommits = await Promise.all(
      allCommits
        .filter(commit => commit.pullRequest)
        .map(async commit => {
          const [err, commits = []] = await on(
            this.git.getCommitsForPR(Number(commit.pullRequest!.number))
          );
          return err ? [] : commits;
        })
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

    const queries = await Promise.all(
      batches
        .map(batch =>
          buildSearchQuery(this.git.options.owner, this.git.options.repo, batch)
        )
        .filter((q): q is string => Boolean(q))
        .map(q => this.git.graphql(q))
    );
    const data = queries.filter((q): q is GraphQlQueryResponse => Boolean(q));

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
          .filter((result): result is [string, ISearchResult] =>
            Boolean(result[1])
          )
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

    return commitsInRelease.filter((commit): commit is IExtendedCommit =>
      Boolean(commit)
    );
  }

  /** Update a changelog with a new set of release notes */
  async updateChangelogFile(
    title: string,
    releaseNotes: string,
    changelogPath: string
  ) {
    const date = new Date().toDateString();
    let newChangelog = '#';

    if (title) {
      newChangelog += ` ${title}`;
    }

    newChangelog += ` (${date})\n\n${releaseNotes}`;

    if (fs.existsSync(changelogPath)) {
      this.logger.verbose.info('Old changelog exists, prepending changes.');
      const oldChangelog = await readFile(changelogPath, 'utf8');
      newChangelog = `${newChangelog}\n\n---\n\n${oldChangelog}`;
    }

    await writeFile(changelogPath, newChangelog);
    this.logger.verbose.info('Wrote new changelog to filesystem.');
    await execPromise('git', ['add', changelogPath]);
  }

  /**
   * Prepend a set of release notes to the changelog.md
   *
   * @param releaseNotes - Release notes to prepend to the changelog
   * @param lastRelease - Last release version of the code. Could be the first commit SHA
   * @param currentVersion - Current version of the code
   */
  async addToChangelog(
    releaseNotes: string,
    lastRelease: string,
    currentVersion: string
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

    await this.updateChangelogFile(title || '', releaseNotes, 'CHANGELOG.md');
  }

  /**
   * Get a range of commits. The commits will have PR numbers and labels attached
   *
   * @param from - Tag or SHA to start at
   * @param to - Tag or SHA to end at (defaults to HEAD)
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

  /** Go through the configured labels and either add them to the project or update them */
  async addLabelsToProject(
    labels: Partial<ILabelDefinitionMap>,
    options: ICreateLabelsOptions = {}
  ) {
    const oldLabels = ((await this.git.getProjectLabels()) || []).map(l =>
      l.toLowerCase()
    );
    const labelsToCreate = Object.entries(labels).filter(
      ([versionLabel, labelDef]) => {
        if (!labelDef) {
          return false;
        }

        if (
          versionLabel === 'release' &&
          !this.options.onlyPublishWithReleaseLabel
        ) {
          return false;
        }

        if (
          versionLabel === 'skip-release' &&
          this.options.onlyPublishWithReleaseLabel
        ) {
          return false;
        }

        return true;
      }
    );

    if (!options.dryRun) {
      await Promise.all(
        labelsToCreate.map(async ([label, labelDefs]) => {
          if (!labelDefs) {
            return;
          }

          return Promise.all(
            labelDefs.map(async labelDef => {
              if (oldLabels.some(o => labelDef.name.toLowerCase() === o)) {
                return this.git.updateLabel(label, labelDef);
              }

              return this.git.createLabel(label, labelDef);
            })
          );
        })
      );
    }

    const repoMetadata = await this.git.getProject();
    const justLabelNames = labelsToCreate.reduce<string[]>(
      (acc, [, cLabel]) => [...acc, ...(cLabel || []).map(l => l.name)],
      []
    );

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
   * @param from - Tag or SHA to start at
   * @param to - Tag or SHA to end at (defaults to HEAD)
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

  /** Given a tag get the next incremented version */
  async calcNextVersion(lastTag: string) {
    const bump = await this.getSemverBump(lastTag);
    return inc(lastTag, bump as ReleaseType);
  }

  /** Create the class that will parse the log for PR info */
  @memoize()
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

  /** Get a the PRs that have been merged since the last GitHub release. */
  @memoize()
  private async getPRsSinceLastRelease() {
    let lastRelease: {
      /** Date the last release was published */
      published_at: string;
    };

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

    const data = await Promise.all(
      prsSinceLastRelease.items.map(
        async (pr: {
          /** The issue number of the pull request */
          number: number;
        }) => this.git.getPullRequest(Number(pr.number))
      )
    );

    return data.map(item => item.data);
  }

  /**
   * Add the PR info (labels and body) to the commit
   *
   * @param commit - Commit to modify
   */
  private async addPrInfoToCommit(commit: IExtendedCommit) {
    const modifiedCommit = { ...commit };

    if (!modifiedCommit.labels) {
      modifiedCommit.labels = [];
    }

    if (modifiedCommit.pullRequest) {
      const info = await this.git.getPr(modifiedCommit.pullRequest.number);

      if (!info || !info.data) {
        return modifiedCommit;
      }

      const labels = info ? info.data.labels.map(l => l.name) : [];
      modifiedCommit.labels = [
        ...new Set([...labels, ...modifiedCommit.labels])
      ];
      modifiedCommit.pullRequest.body = info.data.body;

      if (!modifiedCommit.authors.find(author => Boolean(author.username))) {
        const user = await this.git.getUserByUsername(info.data.user.login);

        if (user) {
          modifiedCommit.authors.push({ ...user, username: user.login });
        }
      }
    }

    return modifiedCommit;
  }

  /**
   * Commits from rebased PRs do not have messages that tie them to a PR
   * Instead we have to find all PRs since the last release and try to match
   * their merge commit SHAs.
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

  /** Parse the commit for information about the author and any other author that might have helped. */
  private async attachAuthor(commit: IExtendedCommit) {
    const modifiedCommit = { ...commit };
    let resolvedAuthors: (
      | (ICommitAuthor & {
          /** The GitHub user name of the git committer */
          login?: string;
        })
      | Partial<GHub.UsersGetByUsernameResponse>
    )[] = [];

    // If there is a pull request we will attempt to get the authors
    // from any commit in the PR
    if (modifiedCommit.pullRequest) {
      const [prCommitsErr, prCommits] = await on(
        this.git.getCommitsForPR(Number(modifiedCommit.pullRequest.number))
      );

      if (prCommitsErr || !prCommits) {
        return commit;
      }

      resolvedAuthors = await Promise.all(
        prCommits.map(async prCommit => {
          if (!prCommit.author) {
            return prCommit.commit.author;
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

    modifiedCommit.authors = resolvedAuthors.map(author => ({
      ...author,
      ...(author && 'login' in author ? { username: author.login } : {})
    }));

    modifiedCommit.authors.forEach(author => {
      this.logger.veryVerbose.info(
        `Found author: ${author.username} ${author.email} ${author.name}`
      );
    });

    return modifiedCommit;
  }
}
