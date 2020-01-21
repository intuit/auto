/* eslint-disable complexity */

import { ReposCreateReleaseResponse, Response } from '@octokit/rest';
import dotenv from 'dotenv';
import envCi from 'env-ci';
import fs from 'fs';
import path from 'path';
import { eq, gt, lte, inc, parse, ReleaseType, major } from 'semver';
import {
  AsyncParallelHook,
  AsyncSeriesBailHook,
  SyncHook,
  SyncWaterfallHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook
} from 'tapable';
import endent from 'endent';

import HttpsProxyAgent from 'https-proxy-agent';
import {
  ApiOptions,
  ICanaryOptions,
  IChangelogOptions,
  ICommentOptions,
  ICreateLabelsOptions,
  IInitOptions,
  ILabelOptions,
  IPRCheckOptions,
  IPRStatusOptions,
  IReleaseOptions,
  IShipItOptions,
  IVersionOptions,
  INextOptions
} from './auto-args';
import Changelog from './changelog';
import { preVersionMap } from './semver';
import Config from './config';
import Git, { IGitOptions, IPRInfo } from './git';
import init from './init';
import LogParse, { IExtendedCommit } from './log-parse';
import Release, {
  getVersionMap,
  IAutoConfig,
  ILabelDefinition
} from './release';
import SEMVER, { calculateSemVerBump, IVersionLabels } from './semver';
import execPromise from './utils/exec-promise';
import loadPlugin, { IPlugin } from './utils/load-plugins';
import createLog, { ILogger, setLogLevel } from './utils/logger';
import { makeHooks } from './utils/make-hooks';
import { IAuthorOptions, IRepoOptions } from './auto-args';
import { execSync } from 'child_process';
import { buildSearchQuery, ISearchResult } from './match-sha-to-pr';

const proxyUrl = process.env.https_proxy || process.env.http_proxy;
const env = envCi();

interface ChangelogLifecycle {
  /** The bump being applied to the version */
  bump: SEMVER;
  /** The commits included in the changelog */
  commits: IExtendedCommit[];
  /** The generated release notes for the commits */
  releaseNotes: string;
  /** The current version of the project */
  currentVersion: string;
  /** The last version of the project */
  lastRelease: string;
}

interface TestingToken {
  /** A token used for testing */
  token?: string;
}

type ShipitContext = 'canary' | 'next' | 'latest' | 'old';

interface ShipitInfo {
  /** The Version published when shipit ran */
  newVersion?: string;
  /** The commits released during shipit */
  commitsInRelease: IExtendedCommit[];
  /** The type of release made */
  context: ShipitContext;
}

export interface IAutoHooks {
  /** Modify what is in the config. You must return the config in this hook. */
  modifyConfig: SyncWaterfallHook<[IAutoConfig]>;
  /** Happens before anything is done. This is a great place to check for platform specific secrets. */
  beforeRun: SyncHook<[IAutoConfig]>;
  /** Happens before `shipit` is run. This is a great way to throw an error if a token or key is not present. */
  beforeShipIt: SyncHook<[]>;
  /** Ran before the `changelog` command commits the new release notes to `CHANGELOG.md`. */
  beforeCommitChangelog: AsyncSeriesHook<[ChangelogLifecycle]>;
  /** Ran after the `changelog` command adds the new release notes to `CHANGELOG.md`. */
  afterAddToChangelog: AsyncSeriesHook<[ChangelogLifecycle]>;
  /** Ran after the `shipit` command has run. */
  afterShipIt: AsyncParallelHook<
    [
      string | undefined,
      IExtendedCommit[],
      {
        /** The type of release made by shipit */
        context: ShipitContext;
      }
    ]
  >;
  /** Ran after the `release` command has run. */
  afterRelease: AsyncParallelHook<
    [
      {
        /** The last version released */
        lastRelease: string;
        /** The version being released */
        newVersion?: string;
        /** The commits included in the release */
        commits: IExtendedCommit[];
        /** The generated release notes for the commits */
        releaseNotes: string;
        /** The response from creating the new release. */
        response?: Response<ReposCreateReleaseResponse>;
      }
    ]
  >;
  /** Get git author. Typically from a package distribution description file. */
  getAuthor: AsyncSeriesBailHook<[], IAuthorOptions | void>;
  /** Get the previous version. Typically from a package distribution description file. */
  getPreviousVersion: AsyncSeriesBailHook<[], string>;
  /** Get owner and repository. Typically from a package distribution description file. */
  getRepository: AsyncSeriesBailHook<[], (IRepoOptions & TestingToken) | void>;
  /** Tap into the things the Release class makes. This isn't the same as `auto release`, but the main class that does most of the work. */
  onCreateRelease: SyncHook<[Release]>;
  /** This is where you hook into the LogParse's hooks. This hook is exposed for convenience on during `this.hooks.onCreateRelease` and at the root `this.hooks` */
  onCreateLogParse: SyncHook<[LogParse]>;
  /** This is where you hook into the changelog's hooks.  This hook is exposed for convenience on during `this.hooks.onCreateRelease` and at the root `this.hooks` */
  onCreateChangelog: SyncHook<[Changelog, SEMVER | undefined]>;
  /** Version the package. This is a good opportunity to `git tag` the release also.  */
  version: AsyncParallelHook<[SEMVER]>;
  /** Ran after the package has been versioned. */
  afterVersion: AsyncParallelHook<[]>;
  /** Publish the package to some package distributor. You must push the tags to github! */
  publish: AsyncParallelHook<[SEMVER]>;
  /** Used to publish a canary release. In this hook you get the semver bump and the unique canary postfix ID. */
  canary: AsyncSeriesBailHook<
    [SEMVER, string],
    | string
    | {
        /** Error when creating the canary release */
        error: string;
      }
    | void
  >;
  /**
   * Used to publish a next release. In this hook you get the semver bump
   * and an array of next versions that been released. If you make another
   * next release be sure to add it the the array.
   */
  next: AsyncSeriesWaterfallHook<[string[], SEMVER]>;
  /** Ran after the package has been published. */
  afterPublish: AsyncParallelHook<[]>;
}

/** Load the .env file into process.env. Useful for local usage. */
const loadEnv = () => {
  const envFile = path.resolve(process.cwd(), '.env');

  if (!fs.existsSync(envFile)) {
    return;
  }

  const envConfig = dotenv.parse(fs.readFileSync(envFile));

  Object.entries(envConfig).forEach(([key, value]) => {
    process.env[key] = value;
  });
};

/** Get the pr number from user input or the CI env. */
function getPrNumberFromEnv(pr?: number) {
  const envPr = 'pr' in env && Number(env.pr);
  const prNumber = pr || envPr;

  return prNumber;
}

/**
 * Bump the version but no too much.
 *
 * @example
 * currentVersion = 1.0.0
 * nextVersion = 2.0.0-next.0
 * output = 2.0.0-next.1
 */
export function determineNextVersion(
  lastVersion: string,
  currentVersion: string,
  bump: SEMVER,
  tag: string
) {
  const next =
    inc(lastVersion, `pre${bump}` as ReleaseType, tag) || 'prerelease';

  return lte(next, currentVersion)
    ? inc(currentVersion, 'prerelease', tag) || 'prerelease'
    : next;
}

/** Get the current branch the git repo is set to */
export function getCurrentBranch() {
  const isPR = 'isPr' in env && env.isPr;
  let branch: string | undefined;
  // env-ci sets branch to target branch (ex: master) in some CI services.
  // so we should make sure we aren't in a PR just to be safe

  if (isPR && 'prBranch' in env) {
    branch = env.prBranch;
  } else {
    branch = env.branch;
  }

  if (!branch) {
    try {
      branch = execSync('git symbolic-ref --short HEAD', {
        encoding: 'utf8',
        stdio: 'ignore'
      });
    } catch (error) {}
  }

  return branch;
}

/** Escape a string for use in a Regex */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * The "auto" node API. Its public interface matches the
 * commands you can run from the CLI
 */
export default class Auto {
  /** Plugin entry points */
  hooks: IAutoHooks;
  /** A logger that uses log levels */
  logger: ILogger;
  /** Options auto was initialized with */
  options: ApiOptions;
  /** The branch auto uses as master. */
  baseBranch: string;
  /** The user configuration of auto (.autorc) */
  config?: IAutoConfig;

  /** A class that handles creating releases */
  release?: Release;
  /** A class that handles interacting with git and GitHub */
  git?: Git;
  /** The labels configured by the user */
  labels?: ILabelDefinition[];
  /** A map of semver bumps to labels that signify those bumps */
  semVerLabels?: IVersionLabels;

  /** The version bump being used during "shipit" */
  private versionBump?: SEMVER;

  /** Initialize auto and it's environment */
  constructor(options: ApiOptions = {}) {
    this.options = options;
    this.baseBranch = options.baseBranch || 'master';
    setLogLevel(
      Array.isArray(options.verbose) && options.verbose.length > 1
        ? 'veryVerbose'
        : options.verbose
        ? 'verbose'
        : undefined
    );
    this.logger = createLog();
    this.hooks = makeHooks();

    this.hooks.onCreateRelease.tap('Link onCreateChangelog', release => {
      release.hooks.onCreateChangelog.tap(
        'Link onCreateChangelog',
        (changelog, version) => {
          this.hooks.onCreateChangelog.call(changelog, version);
        }
      );
    });
    this.hooks.onCreateRelease.tap('Link onCreateLogParse', release => {
      release.hooks.onCreateLogParse.tap('Link onCreateLogParse', logParse => {
        this.hooks.onCreateLogParse.call(logParse);
      });
    });
    this.hooks.beforeCommitChangelog.tapPromise(
      'Old Version Branches',
      async ({ bump }) => {
        if (bump === SEMVER.major && this.config?.versionBranches) {
          const branch = `${this.config.versionBranches}${major(
            await this.hooks.getPreviousVersion.promise()
          )}`;

          await execPromise('git', [
            'branch',
            await this.git?.getLatestTagInBranch()
          ]);
          await execPromise('git', ['push', 'origin', branch]);
        }
      }
    );

    loadEnv();

    this.logger.verbose.info('ENV:', env);
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig() {
    const configLoader = new Config(this.logger);
    const config = {
      ...(await configLoader.loadConfig(this.options)),
      baseBranch: this.baseBranch
    };

    this.logger.verbose.success('Loaded `auto` with config:', config);

    this.config = config;
    this.labels = config.labels;
    this.semVerLabels = getVersionMap(config.labels);
    this.loadPlugins(config);
    this.config = this.hooks.modifyConfig.call(config);
    this.hooks.beforeRun.call(config);

    const repository = await this.getRepo(config);
    const token = (repository && repository.token) || process.env.GH_TOKEN;

    if (!token || token === 'undefined') {
      this.logger.log.error(
        'No GitHub was found. Make sure it is available on process.env.GH_TOKEN.'
      );
      throw new Error('GitHub token not found!');
    }

    const githubOptions = {
      owner: config.owner,
      repo: config.repo,
      ...repository,
      token,
      agent: proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined,
      baseUrl: config.githubApi || 'https://api.github.com',
      graphqlBaseUrl:
        config.githubGraphqlApi || config.githubApi || 'https://api.github.com'
    };

    this.git = this.startGit(githubOptions as IGitOptions);
    this.release = new Release(this.git, config, this.logger);

    this.hooks.onCreateRelease.call(this.release);
  }

  /**
   * Interactive prompt for initializing an .autorc
   */
  async init(options: IInitOptions = {}) {
    await init(options, this.logger);
  }

  /** Determine if the repo is currently in a prerelease branch */
  inPrereleaseBranch(): boolean {
    const branch = getCurrentBranch();
    const prereleaseBranches = this.config?.prereleaseBranches!;

    return Boolean(branch && prereleaseBranches.includes(branch));
  }

  /** Determine if the repo is currently in a old-version branch */
  inOldVersionBranch(): boolean {
    const branch = getCurrentBranch();
    const prereleaseBranchPrefix = this.config?.versionBranches as
      | string
      | undefined;

    return Boolean(
      prereleaseBranchPrefix &&
        branch &&
        new RegExp(`^${escapeRegExp(prereleaseBranchPrefix)}`).test(branch)
    );
  }

  /**
   * Create all of the user's labels on the git remote if the don't already exist
   *
   * @param options - Options for the createLabels functionality
   */
  async createLabels(options: ICreateLabelsOptions = {}) {
    if (!this.release || !this.labels) {
      throw this.createErrorMessage();
    }

    await this.release.addLabelsToProject(this.labels, options);
  }

  /**
   * Get the labels on a specific PR. Defaults to the labels of the last merged PR
   *
   * @param options - Options for the createLabels functionality
   */
  async label({ pr }: ILabelOptions = {}) {
    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'label'");

    const number = getPrNumberFromEnv(pr);
    let labels: string[] = [];

    if (number) {
      labels = await this.git.getLabels(number);
    } else {
      const pulls = await this.git.getPullRequests({
        state: 'closed'
      });
      const lastMerged = pulls
        .sort(
          (a, b) =>
            new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime()
        )
        .find(pull => pull.merged_at);

      if (lastMerged) {
        labels = lastMerged.labels.map(label => label.name);
      }
    }

    if (labels.length) {
      console.log(labels.join('\n'));
    }
  }

  /**
   * Create a status on a PR.
   *
   * @param options - Options for the pr status functionality
   */
  async prStatus({ dryRun, pr, url, ...options }: IPRStatusOptions) {
    if (!this.git) {
      throw this.createErrorMessage();
    }

    let { sha } = options;
    let prNumber: number | undefined;

    try {
      prNumber = this.getPrNumber('pr', pr);
    } catch (error) {
      // default to sha if no PR found
    }

    this.logger.verbose.info("Using command: 'pr-status'");

    if (!sha && prNumber) {
      this.logger.verbose.info('Getting commit SHA from PR.');
      const res = await this.git.getPullRequest(prNumber);
      sha = res.data.head.sha;
    } else if (!sha) {
      this.logger.verbose.info('No PR found, getting commit SHA from HEAD.');
      sha = await this.git.getSha();
    }

    this.logger.verbose.info('Found PR SHA:', sha);

    const target_url = url;

    if (dryRun) {
      this.logger.verbose.info('`pr` dry run complete.');
    } else {
      try {
        await this.git.createStatus({
          ...options,
          sha,
          target_url
        });
      } catch (error) {
        throw new Error(
          `Failed to post status to Pull Request with error code ${error.status}`
        );
      }

      this.logger.log.success('Posted status to Pull Request.');
    }

    this.logger.verbose.success('Finished `pr` command');
  }

  /**
   * Check that a PR has a SEMVER label. Set a success status on the PR.
   *
   * @param options - Options for the pr check functionality
   */
  async prCheck({ dryRun, pr, url, ...options }: IPRCheckOptions) {
    if (!this.git || !this.release || !this.semVerLabels) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info(`Using command: 'pr-check' for '${url}'`);

    const target_url = url;
    const prNumber = this.getPrNumber('prCheck', pr);
    let msg;
    let sha;

    try {
      const res = await this.git.getPullRequest(prNumber);
      sha = res.data.head.sha;

      const labels = await this.git.getLabels(prNumber);
      const labelValues = [...this.semVerLabels.values()];
      const releaseTag = labels.find(l => l === 'release');

      const skipReleaseLabels = (
        this.config?.labels.filter(l => l.releaseType === 'skip') || []
      ).map(l => l.name);
      const skipReleaseTag = labels.find(l => skipReleaseLabels.includes(l));

      const semverTag = labels.find(
        l =>
          labelValues.some(labelValue => labelValue.includes(l)) &&
          !skipReleaseLabels.includes(l) &&
          l !== 'release'
      );

      if (semverTag === undefined && !skipReleaseTag) {
        throw new Error('No semver label!');
      }

      this.logger.log.success(
        `PR is using label: ${semverTag || skipReleaseTag}`
      );

      let description;

      if (skipReleaseTag) {
        description = 'PR will not create a release';
      } else if (releaseTag) {
        description = `PR will create release once merged - ${semverTag}`;
      } else {
        description = `CI - ${semverTag}`;
      }

      msg = {
        description,
        state: 'success'
      };
    } catch (error) {
      msg = {
        description: error.message,
        state: 'error'
      };
    }

    this.logger.verbose.info('Posting status to GitHub\n', msg);

    if (dryRun) {
      this.logger.verbose.info('`pr-check` dry run complete.');
    } else {
      try {
        await this.git.createStatus({
          ...options,
          ...msg,
          target_url,
          sha
        } as IPRInfo);

        this.logger.log.success('Posted status to Pull Request.');
      } catch (error) {
        throw new Error(
          `Failed to post status to Pull Request with error code ${error.status}`
        );
      }
    }

    this.logger.verbose.success('Finished `pr-check` command');
  }

  /**
   * Comment on a PR. Only one comment will be present on the PR, Older comments are removed.
   * You can use the "context" option to multiple comments on a PR.
   *
   * @param options - Options for the comment functionality
   */
  async comment(options: ICommentOptions) {
    const {
      message,
      pr,
      context = 'default',
      dryRun,
      delete: deleteFlag,
      edit: editFlag
    } = options;
    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'comment'");
    const prNumber = this.getPrNumber('comment', pr);

    if (dryRun) {
      if (deleteFlag) {
        this.logger.log.info(
          `Would have deleted comment on ${prNumber} under "${context}" context`
        );
      } else if (editFlag) {
        this.logger.log.info(
          `Would have edited the comment on ${prNumber} under "${context}" context.\n\nNew message: ${message}`
        );
      } else {
        this.logger.log.info(
          `Would have commented on ${prNumber} under "${context}" context:\n\n${message}`
        );
      }
    } else if (editFlag && message) {
      await this.git.editComment(message, prNumber, context);
      this.logger.log.success(
        `Edited comment on PR #${prNumber} under context "${context}"`
      );
    } else {
      if (deleteFlag) {
        await this.git.deleteComment(prNumber, context);
        this.logger.log.success(
          `Deleted comment on PR #${prNumber} under context "${context}"`
        );
      }

      if (message) {
        await this.git.createComment(message, prNumber, context);
        this.logger.log.success(`Commented on PR #${prNumber}`);
      }
    }
  }

  /**
   * Update the body of a PR with a message. Only one message will be present in the PR,
   * Older messages are removed. You can use the "context" option to multiple message
   * in a PR body.
   *
   * @param options - Options
   */
  async prBody(options: ICommentOptions) {
    const {
      message,
      pr,
      context = 'default',
      dryRun,
      delete: deleteFlag
    } = options;

    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'pr-body'");
    const prNumber = this.getPrNumber('pr-body', pr);

    if (dryRun) {
      if (deleteFlag) {
        this.logger.log.info(
          `Would have deleted PR body on ${prNumber} under "${context}" context`
        );
      } else {
        this.logger.log.info(
          `Would have appended to PR body on ${prNumber} under "${context}" context:\n\n${message}`
        );
      }
    } else {
      if (deleteFlag) {
        await this.git.addToPrBody('', prNumber, context);
      }

      if (message) {
        await this.git.addToPrBody(message, prNumber, context);
      }

      this.logger.log.success(`Updated body on PR #${prNumber}`);
    }
  }

  /**
   * Calculate the version bump for the current state of the repository.
   */
  async version(options: IVersionOptions = {}) {
    this.logger.verbose.info("Using command: 'version'");
    const bump = await this.getVersion(options);
    console.log(bump);
  }

  /**
   * Calculate the the changelog and commit it.
   */
  async changelog(options?: IChangelogOptions) {
    this.logger.verbose.info("Using command: 'changelog'");
    await this.makeChangelog(options);
  }

  /**
   * Make a release to the git remote with the changes.
   */
  async runRelease(options: IReleaseOptions = {}) {
    this.logger.verbose.info("Using command: 'release'");
    await this.makeRelease(options);
  }

  /** Create a canary (or test) version of the project */
  async canary(options: ICanaryOptions = {}): Promise<ShipitInfo | undefined> {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    if (!this.hooks.canary.isUsed()) {
      this.logger.log.error(endent`
        None of the plugins that you are using implement the \`canary\` command!

        "canary" releases are versions that are used solely to test changes. They make sense on some platforms (ex: npm) but not all!
        
        If you think your package manager has the ability to support canaries please file an issue or submit a pull request,
      `);
      process.exit(1);
    }

    // await this.checkClean();

    let { pr, build } = await this.getPrEnvInfo();
    pr = options.pr ? String(options.pr) : pr;
    build = options.build ? String(options.build) : build;

    this.logger.verbose.info('Canary info found:', { pr, build });

    const head = await this.release.getCommitsInRelease('HEAD^');
    const labels = head.map(commit => commit.labels);
    const version =
      calculateSemVerBump(labels, this.semVerLabels!, this.config) ||
      SEMVER.patch;
    let canaryVersion = '';

    if (pr) {
      canaryVersion = `${canaryVersion}.${pr}`;
    }

    if (build) {
      canaryVersion = `${canaryVersion}.${build}`;
    }

    if (!pr || !build) {
      canaryVersion = `${canaryVersion}.${await this.git.getSha(true)}`;
    }

    let newVersion = '';

    if (options.dryRun) {
      this.logger.log.warn(
        `Published canary identifier would be: "-canary${canaryVersion}"`
      );
    } else {
      this.logger.verbose.info('Calling canary hook');
      const result = await this.hooks.canary.promise(version, canaryVersion);

      if (typeof result === 'object') {
        this.logger.log.warn(result.error);
        return;
      }

      if (!result) {
        return;
      }

      newVersion = result;
      const message = options.message || 'Published PR with canary version: %v';

      if (message !== 'false' && pr) {
        await this.prBody({
          pr: Number(pr),
          context: 'canary-version',
          message: message.replace(
            '%v',
            !newVersion || newVersion.includes('\n')
              ? newVersion
              : `\`${newVersion}\``
          )
        });
      }

      this.logger.log.success(
        `Published canary version${newVersion ? `: ${newVersion}` : ''}`
      );
    }

    let latestTag: string;

    try {
      latestTag = await this.git.getLatestTagInBranch();
    } catch (error) {
      latestTag = await this.git.getFirstCommit();
    }

    const commitsInRelease = await this.release.getCommits(latestTag);
    return { newVersion, commitsInRelease, context: 'canary' };
  }

  /**
   * Create a next (or test) version of the project. If on master will
   * release to the default "next" branch.
   */
  async next(options: INextOptions): Promise<ShipitInfo | undefined> {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    if (!this.hooks.next.isUsed()) {
      this.logger.log.error(endent`
        None of the plugins that you are using implement the \`next\` command!

        "next" releases are pre-releases such as betas or alphas. They make sense on some platforms (ex: npm) but not all!

        If you think your package manager has the ability to support "next" releases please file an issue or submit a pull request,
      `);
      process.exit(1);
    }

    await this.checkClean();
    await this.setGitUser();

    const lastRelease = await this.git.getLatestRelease();
    const lastTag = await this.git.getLatestTagInBranch();
    const commits = await this.release.getCommitsInRelease(lastTag);
    const releaseNotes = await this.release.generateReleaseNotes(lastTag);
    const labels = commits.map(commit => commit.labels);
    const bump =
      calculateSemVerBump(labels, this.semVerLabels!, this.config) ||
      SEMVER.patch;

    if (options.dryRun) {
      this.logger.log.success(
        `Would have created prerelease version with: ${bump}`
      );

      return { newVersion: '', commitsInRelease: commits, context: 'next' };
    }

    this.logger.verbose.info(`Calling "next" hook with: ${bump}`);
    const result = await this.hooks.next.promise([], bump);
    const newVersion = result.join(', ');

    await Promise.all(
      result.map(async prerelease => {
        const release = await this.git?.publish(releaseNotes, prerelease, true);

        this.logger.verbose.info(release);

        await this.hooks.afterRelease.promise({
          lastRelease: lastTag,
          newVersion: prerelease,
          commits,
          releaseNotes,
          response: release
        });
      })
    );

    this.logger.log.success(
      `Published next version${result.length > 1 ? `s` : ''}: ${newVersion}`
    );

    const { pr } = await this.getPrEnvInfo();

    if (pr) {
      const message = options.message || 'Published prerelease version: %v';

      if (pr) {
        await this.prBody({
          pr: Number(pr),
          context: 'prerelease-version',
          message: endent`
            # Version

            ${message.replace('%v', result.map(r => `\`${r}\``).join('\n'))}

            <details>
              <summary>Changelog</summary>
              ${await this.release.generateReleaseNotes(lastRelease)}
            </details>
          `
        });
      }
    }

    return { newVersion, commitsInRelease: commits, context: 'next' };
  }

  /**
   * Run the full workflow.
   *
   * 1. Calculate version
   * 2. Make changelog
   * 3. Publish code
   * 4. Create a release
   */
  async shipit(options: IShipItOptions = {}) {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'shipit'");
    this.hooks.beforeShipIt.call();

    const isPR = 'isPr' in env && env.isPr;
    const head = await this.release.getCommitsInRelease('HEAD^');
    // env-ci sets branch to target branch (ex: master) in some CI services.
    // so we should make sure we aren't in a PR just to be safe
    const currentBranch = getCurrentBranch();
    const isBaseBrach = !isPR && currentBranch === this.baseBranch;
    const shouldGraduate =
      !options.onlyGraduateWithReleaseLabel ||
      (options.onlyGraduateWithReleaseLabel &&
        head[0].labels.some(l =>
          this.semVerLabels?.get('release')?.includes(l)
        ));
    const isPrereleaseBranch = this.config?.prereleaseBranches?.some(
      branch => currentBranch === branch
    );
    const publishPrerelease =
      isPrereleaseBranch ||
      (currentBranch === this.baseBranch &&
        options.onlyGraduateWithReleaseLabel);

    this.logger.veryVerbose.info({
      currentBranch,
      isBaseBrach,
      isPR,
      shouldGraduate,
      isPrereleaseBranch,
      publishPrerelease
    });
    const publishInfo =
      isBaseBrach && shouldGraduate
        ? await this.publishFullRelease(options)
        : this.inOldVersionBranch()
        ? await this.oldRelease(options)
        : publishPrerelease
        ? await this.next(options)
        : await this.canary(options);

    if (!publishInfo) {
      return;
    }

    const { newVersion, commitsInRelease, context } = publishInfo;
    await this.hooks.afterShipIt.promise(newVersion, commitsInRelease, {
      context
    });
  }

  /** Get the latest version number of the project */
  async getCurrentVersion(lastRelease: string) {
    this.hooks.getPreviousVersion.tap('None', () => {
      this.logger.veryVerbose.info(
        'No previous release found, using 0.0.0 as previous version.'
      );
      return this.prefixRelease('0.0.0');
    });

    const lastVersion = await this.hooks.getPreviousVersion.promise();

    if (
      parse(lastRelease) &&
      parse(lastVersion) &&
      gt(lastRelease, lastVersion)
    ) {
      this.logger.veryVerbose.info('Using latest release as previous version');
      return lastRelease;
    }

    return lastVersion;
  }

  /**
   * A utility function for plugins to check the process for tokens.
   */
  checkEnv(pluginName: string, key: string) {
    if (!process.env[key]) {
      this.logger.log.warn(`${pluginName}: No "${key}" found in environment`);
    }
  }

  /** Make a release to an old version */
  private async oldRelease(
    options: IShipItOptions
  ): Promise<ShipitInfo | undefined> {
    const latestTag = await this.git?.getLatestTagInBranch();
    const result = await this.publishFullRelease({
      ...options,
      from: latestTag
    });

    if (result) {
      result.context = 'old';
    }

    return result;
  }

  /** On master: publish a new latest version */
  private async publishFullRelease(
    options: IShipItOptions & {
      /** Internal option to shipt from a certain tag or commit */
      from?: string;
    }
  ): Promise<ShipitInfo | undefined> {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    const version = await this.getVersion(options);

    if (version === '') {
      this.logger.log.info('No version published.');
      return;
    }

    const lastRelease = options.from || (await this.git.getLatestRelease());
    const commitsInRelease = await this.release.getCommitsInRelease(
      lastRelease
    );

    await this.makeChangelog(options);

    if (!options.dryRun) {
      await this.checkClean();
      this.logger.verbose.info('Calling version hook');
      await this.hooks.version.promise(version);
      this.logger.verbose.info('Calling after version hook');
      await this.hooks.afterVersion.promise();
      this.logger.verbose.info('Calling publish hook');
      await this.hooks.publish.promise(version);
      this.logger.verbose.info('Calling after publish hook');
      await this.hooks.afterPublish.promise();
    }

    const newVersion = await this.makeRelease(options);

    if (options.dryRun) {
      this.logger.log.warn(
        "The version reported in the line above hasn't been incremented during `dry-run`"
      );

      const current = await this.getCurrentVersion(lastRelease);

      if (parse(current)) {
        this.logger.log.warn(
          `Published version would be: ${inc(current, version as ReleaseType)}`
        );
      }
    }

    return { newVersion, commitsInRelease, context: 'latest' };
  }

  /** Get a pr number from user input or the env */
  private getPrNumber(command: string, pr?: number) {
    const prNumber = getPrNumberFromEnv(pr);

    if (!prNumber) {
      throw new Error(
        `Could not detect PR number. ${command} must be run from either a PR or have the PR number supplied via the --pr flag.`
      );
    }

    return prNumber;
  }

  /** Create a client to interact with git */
  private startGit(gitOptions: IGitOptions) {
    if (!gitOptions.owner || !gitOptions.repo || !gitOptions.token) {
      throw new Error('Must set owner, repo, and GitHub token.');
    }

    this.logger.verbose.info('Options contain repo information.');

    // So that --verbose can be used on public CIs
    const tokenlessArgs = {
      ...gitOptions,
      token: `[Token starting with ${gitOptions.token.substring(0, 4)}]`
    };

    this.logger.verbose.info('Initializing GitHub API with:\n', tokenlessArgs);
    return new Git(
      {
        owner: gitOptions.owner,
        repo: gitOptions.repo,
        token: gitOptions.token,
        baseUrl: gitOptions.baseUrl,
        baseBranch: this.baseBranch,
        graphqlBaseUrl: gitOptions.graphqlBaseUrl,
        agent: gitOptions.agent
      },
      this.logger
    );
  }

  /** Calculate a version from a tag using labels */
  private async getVersion({ from }: IVersionOptions = {}) {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    const isPrerelease = this.inPrereleaseBranch();
    const lastRelease =
      from ||
      (isPrerelease && (await this.git.getLatestTagInBranch())) ||
      (await this.git.getLatestRelease());
    const calculatedBump = await this.release.getSemverBump(lastRelease);
    const bump =
      (isPrerelease && preVersionMap.get(calculatedBump)) || calculatedBump;

    this.versionBump = bump;

    return bump;
  }

  /** Make a changelog over a range of commits */
  private async makeChangelog({
    dryRun,
    from,
    to,
    message = 'Update CHANGELOG.md [skip ci]'
  }: IChangelogOptions = {}) {
    if (!this.release || !this.git) {
      throw this.createErrorMessage();
    }

    await this.setGitUser();

    const lastRelease = from || (await this.git.getLatestRelease());
    const bump = await this.release.getSemverBump(lastRelease, to);
    const releaseNotes = await this.release.generateReleaseNotes(
      lastRelease,
      to || undefined,
      this.versionBump
    );

    this.logger.log.info('New Release Notes\n', releaseNotes);

    if (dryRun) {
      this.logger.verbose.info('`changelog` dry run complete.');
      return;
    }

    const currentVersion = await this.getCurrentVersion(lastRelease);

    await this.release.addToChangelog(
      releaseNotes,
      lastRelease,
      currentVersion
    );

    const options = {
      bump,
      commits: await this.release.getCommits(lastRelease, to || undefined),
      releaseNotes,
      lastRelease,
      currentVersion
    };

    await this.hooks.beforeCommitChangelog.promise(options);
    await execPromise('git', ['commit', '-m', `"${message}"`, '--no-verify']);
    this.logger.verbose.info('Committed new changelog.');

    await this.hooks.afterAddToChangelog.promise(options);
  }

  /** Make a release over a range of commits */
  private async makeRelease({
    dryRun,
    from,
    useVersion,
    prerelease = false
  }: IReleaseOptions = {}) {
    if (!this.release || !this.git) {
      throw this.createErrorMessage();
    }

    const isPrerelease = prerelease || this.inPrereleaseBranch();
    let lastRelease =
      from ||
      (isPrerelease && (await this.git.getPreviousTagInBranch())) ||
      (await this.git.getLatestRelease());

    // Find base commit or latest release to generate the changelog to HEAD (new tag)
    this.logger.veryVerbose.info(`Using ${lastRelease} as previous release.`);

    if (lastRelease.match(/^\d+\.\d+\.\d+/)) {
      lastRelease = this.prefixRelease(lastRelease);
    }

    this.logger.log.info('Last used release:', lastRelease);

    const commitsInRelease = await this.release.getCommitsInRelease(
      lastRelease
    );
    const releaseNotes = await this.release.generateReleaseNotes(
      lastRelease,
      undefined,
      this.versionBump
    );

    this.logger.log.info(`Using release notes:\n${releaseNotes}`);

    const latestTag = await this.git.getLatestTagInBranch();
    const rawVersion =
      useVersion ||
      (isPrerelease && latestTag) ||
      (await this.getCurrentVersion(lastRelease)) ||
      latestTag;

    if (!rawVersion) {
      this.logger.log.error('Could not calculate next version from last tag.');
      return;
    }

    const newVersion = parse(rawVersion)
      ? this.prefixRelease(rawVersion)
      : rawVersion;

    if (
      !dryRun &&
      parse(newVersion) &&
      parse(lastRelease) &&
      eq(newVersion, lastRelease)
    ) {
      this.logger.log.warn(
        `Nothing released to Github. Version to be released is the same as the latest release on Github: ${newVersion}`
      );
      return;
    }

    let release: Response<ReposCreateReleaseResponse> | undefined;

    if (dryRun) {
      this.logger.log.info(
        `Would have released (unless ran with "shipit"): ${newVersion}`
      );
    } else {
      this.logger.log.info(`Releasing ${newVersion} to GitHub.`);
      release = await this.git.publish(releaseNotes, newVersion, isPrerelease);

      await this.hooks.afterRelease.promise({
        lastRelease,
        newVersion,
        commits: commitsInRelease,
        releaseNotes,
        response: release
      });
    }

    return newVersion;
  }

  /** Check if `git status` is clean. */
  readonly checkClean = async () => {
    const status = await execPromise('git', ['status', '--porcelain']);

    if (!status) {
      return;
    }

    this.logger.log.error('Changed Files:\n', status);

    throw new Error(
      'Working direction is not clean, make sure all files are commited'
    );
  };

  /** Prefix a version with a "v" if needed */
  readonly prefixRelease = (release: string) => {
    if (!this.release) {
      throw this.createErrorMessage();
    }

    return this.config?.noVersionPrefix || release.startsWith('v')
      ? release
      : `v${release}`;
  };

  /** Create an auto initialization error */
  private createErrorMessage() {
    return new Error(
      `Auto is not initialized! Make sure the have run Auto.loadConfig`
    );
  }

  /**
   * Set the git user to make releases and commit with.
   */
  private async setGitUser() {
    try {
      // If these values are not set git config will exit with an error
      await execPromise('git', ['config', 'user.email']);
      await execPromise('git', ['config', 'user.name']);
    } catch (error) {
      this.logger.verbose.warn(
        'Could not find git user or email configured in environment'
      );

      if (!env.isCi) {
        this.logger.log.note(
          `Detected local environment, will not set git user. This happens automatically in a CI environment.

If a command fails manually run:

  - git config user.email your@email.com
  - git config user.name "Your Name"`
        );
        return;
      }

      if (!this.release) {
        return;
      }

      let { email, name } = this.release.config;
      this.logger.verbose.warn(
        `Got author from options: email: ${email}, name ${name}`
      );
      const packageAuthor = await this.hooks.getAuthor.promise();
      this.logger.verbose.warn(
        `Got author: ${JSON.stringify(packageAuthor, undefined, 2)}`
      );

      email = !email && packageAuthor ? packageAuthor.email : email;
      name = !name && packageAuthor ? packageAuthor.name : name;

      if (email) {
        await execPromise('git', ['config', 'user.email', `"${email}"`]);
        this.logger.verbose.warn(`Set git email to ${email}`);
      }

      if (name) {
        await execPromise('git', ['config', 'user.name', `"${name}"`]);
        this.logger.verbose.warn(`Set git name to ${name}`);
      }
    }
  }

  /** Get the repo to interact with */
  private async getRepo(config: IAutoConfig) {
    if (config.owner && config.repo) {
      return config as IRepoOptions & TestingToken;
    }

    return this.hooks.getRepository.promise();
  }

  /**
   * Apply all of the plugins in the config.
   */
  private loadPlugins(config: IAutoConfig) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultPlugins = [(process as any).pkg ? 'git-tag' : 'npm'];
    const pluginsPaths = [
      require.resolve('./plugins/filter-non-pull-request'),
      ...(config.plugins || defaultPlugins)
    ];

    pluginsPaths
      .map(plugin =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof plugin === 'string' ? ([plugin, {}] as [string, any]) : plugin
      )
      .map(plugin => loadPlugin(plugin, this.logger))
      .filter((plugin): plugin is IPlugin => Boolean(plugin))
      .forEach(plugin => {
        this.logger.verbose.info(`Using ${plugin.name} Plugin...`);
        plugin.apply(this);
      });
  }

  /** Get the branch and build number when in CI environment */
  private async getPrEnvInfo() {
    // SailEnv falls back to commit SHA
    let pr: string | undefined;
    let build: string | undefined;

    if ('pr' in env && 'build' in env) {
      ({ pr } = env);
      ({ build } = env);
    } else if ('pr' in env && 'commit' in env) {
      ({ pr } = env);
      build = env.commit;
    }

    // If we haven't detected the PR from the env vars try to match
    // the commit to a PR
    if (env.isCi && !pr && this.git?.options.owner && this.git?.options.repo) {
      const commit = await this.git.getSha();
      const query = buildSearchQuery(
        this.git?.options.owner,
        this.git?.options.repo,
        [commit]
      );

      if (query) {
        const result = await this.git.graphql(query);

        if (result && result[`hash_${commit}`]) {
          pr = String(
            (result[`hash_${commit}`] as ISearchResult).edges[0]?.node?.number
          );
        }
      }
    }

    return { pr, build };
  }
}

// Plugin Utils

export * from './auto-args';
export { ILogger } from './utils/logger';
export { IPlugin } from './utils/load-plugins';
export { default as Auto } from './auto';
export { default as SEMVER } from './semver';
export { default as execPromise } from './utils/exec-promise';
export { VersionLabel } from './release';
