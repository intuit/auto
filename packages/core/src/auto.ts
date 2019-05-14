import dotenv from 'dotenv';
import envCi from 'env-ci';
import fs from 'fs';
import path from 'path';
import { eq, gt, inc, parse, ReleaseType } from 'semver';
import {
  AsyncParallelHook,
  AsyncSeriesBailHook,
  SyncHook,
  SyncWaterfallHook
} from 'tapable';

import {
  ArgsType,
  ICanaryCommandOptions,
  IChangelogOptions,
  ICommentCommandOptions,
  ICreateLabelsCommandOptions,
  IInitCommandOptions,
  ILabelCommandOptions,
  IPRCheckCommandOptions,
  IPRStatusCommandOptions,
  IReleaseCommandOptions,
  IShipItCommandOptions
} from './cli-args';

import Changelog from './changelog';
import Config from './config';
import Git, { IGitOptions, IPRInfo } from './git';
import init from './init';
import LogParse, { IExtendedCommit } from './log-parse';
import Release, {
  getVersionMap,
  ILabelDefinitionMap,
  IReleaseOptions,
  VersionLabel
} from './release';
import SEMVER, { calculateSemVerBump } from './semver';
import execPromise from './utils/exec-promise';
import loadPlugin, { IPlugin } from './utils/load-plugins';
import createLog, { ILogger } from './utils/logger';
import { makeHooks } from './utils/make-hooks';

const env = envCi();

interface IAuthor {
  name?: string;
  email?: string;
}

interface IRepository {
  owner?: string;
  repo?: string;
  token?: string;
}

export interface IAutoHooks {
  modifyConfig: SyncWaterfallHook<[IReleaseOptions]>;
  beforeRun: SyncHook<[IReleaseOptions]>;
  beforeShipIt: SyncHook<[]>;
  afterShipIt: AsyncParallelHook<[string | undefined, IExtendedCommit[]]>;
  afterRelease: AsyncParallelHook<
    [string | undefined, IExtendedCommit[], string]
  >;
  getAuthor: AsyncSeriesBailHook<[], IAuthor | void>;
  getPreviousVersion: AsyncSeriesBailHook<
    [(release: string) => string],
    string
  >;
  getRepository: AsyncSeriesBailHook<[], IRepository | void>;
  onCreateRelease: SyncHook<[Release]>;
  onCreateLogParse: SyncHook<[LogParse]>;
  onCreateChangelog: SyncHook<[Changelog]>;
  version: AsyncParallelHook<[SEMVER]>;
  afterVersion: AsyncParallelHook<[]>;
  publish: AsyncParallelHook<[SEMVER]>;
  canary: AsyncSeriesBailHook<[SEMVER, string], string | { error: string }>;
  afterPublish: AsyncParallelHook<[]>;
}

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

export default class Auto {
  hooks: IAutoHooks;
  logger: ILogger;
  args: ArgsType;
  baseBranch: string;
  config?: IReleaseOptions;

  release?: Release;
  git?: Git;
  labels?: ILabelDefinitionMap;
  semVerLabels?: Map<VersionLabel, string>;

  constructor(args: ArgsType) {
    this.args = args;
    this.baseBranch = args.baseBranch || 'master';
    this.logger = createLog(
      args.veryVerbose ? 'veryVerbose' : args.verbose ? 'verbose' : undefined
    );
    this.hooks = makeHooks();

    this.hooks.onCreateRelease.tap('Link onCreateChangelog', release => {
      release.hooks.onCreateChangelog.tap(
        'Link onCreateChangelog',
        changelog => {
          this.hooks.onCreateChangelog.call(changelog);
        }
      );
    });
    this.hooks.onCreateRelease.tap('Link onCreateLogParse', release => {
      release.hooks.onCreateLogParse.tap('Link onCreateLogParse', logParse => {
        this.hooks.onCreateLogParse.call(logParse);
      });
    });

    loadEnv();
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig() {
    const configLoader = new Config(this.logger);
    const config = this.hooks.modifyConfig.call({
      ...(await configLoader.loadConfig(this.args)),
      baseBranch: this.baseBranch
    });

    this.logger.verbose.success('Loaded `auto` with config:', config);

    this.config = config;
    this.labels = config.labels;
    this.semVerLabels = getVersionMap(config.labels);
    this.loadPlugins(config);
    this.hooks.beforeRun.call(config);

    const repository = await this.getRepo(config);
    const token =
      repository && repository.token ? repository.token : process.env.GH_TOKEN;

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
  async init(options: IInitCommandOptions = {}) {
    await init(options, this.logger);
  }

  /**
   * Create all of the user's labels on the git remote if the don't already exist
   *
   * @param options Options for the createLabels functionality
   */
  async createLabels(options: ICreateLabelsCommandOptions = {}) {
    if (!this.release || !this.labels) {
      throw this.createErrorMessage();
    }

    await this.release.addLabelsToProject(this.labels, options);
  }

  /**
   * Get the labels on a specific PR. Defaults to the labels of the last merged PR
   *
   * @param options Options for the createLabels functionality
   */
  async label({ pr }: ILabelCommandOptions = {}) {
    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'label'");
    let labels: string[] = [];

    if (!pr) {
      const pulls = await this.git.getPullRequests({
        state: 'closed'
      });
      const lastMerged = pulls
        .sort(
          (a, b) =>
            new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime()
        )
        .find(pull => !!pull.merged_at);

      if (lastMerged) {
        labels = lastMerged.labels.map(label => label.name);
      }
    } else {
      labels = await this.git.getLabels(pr);
    }

    if (labels.length) {
      console.log(labels.join('\n'));
    }
  }

  /**
   * Create a status on a PR.
   *
   * @param options Options for the pr status functionality
   */
  async prStatus({ dryRun, pr, url, ...options }: IPRStatusCommandOptions) {
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

    // tslint:disable-next-line variable-name
    const target_url = url;

    if (!dryRun) {
      try {
        await this.git.createStatus({
          ...options,
          sha,
          target_url
        });
      } catch (error) {
        throw new Error(
          `Failed to post status to Pull Request with error code ${
            error.status
          }`
        );
      }

      this.logger.log.success('Posted status to Pull Request.');
    } else {
      this.logger.verbose.info('`pr` dry run complete.');
    }

    this.logger.verbose.success('Finished `pr` command');
  }

  /**
   * Check that a PR has a SEMVER label. Set a success status on the PR.
   *
   * @param options Options for the pr check functionality
   */
  async prCheck({ dryRun, pr, url, ...options }: IPRCheckCommandOptions) {
    if (!this.git || !this.release || !this.semVerLabels) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info(`Using command: 'pr-check' for '${url}'`);

    // tslint:disable-next-line variable-name
    const target_url = url;
    const prNumber = this.getPrNumber('prCheck', pr);
    let msg;
    let sha;

    try {
      const res = await this.git.getPullRequest(prNumber);
      sha = res.data.head.sha;

      const labels = await this.git.getLabels(prNumber);
      const labelTexts = [...this.semVerLabels.values()];
      const releaseTag = labels.find(l => l === 'release');

      const skipReleaseTag = labels.find(
        l =>
          !!this.release && this.release.options.skipReleaseLabels.includes(l)
      );
      const semverTag = labels.find(
        l =>
          labelTexts.includes(l) &&
          !!this.release &&
          !this.release.options.skipReleaseLabels.includes(l) &&
          l !== 'release'
      );

      if (semverTag === undefined && !skipReleaseTag) {
        throw new Error('No semver label!');
      }

      this.logger.log.success(`PR is using label: ${semverTag}`);

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

    if (!dryRun) {
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
          `Failed to post status to Pull Request with error code ${
            error.status
          }`
        );
      }
    } else {
      this.logger.verbose.info('`pr-check` dry run complete.');
    }

    this.logger.verbose.success('Finished `pr-check` command');
  }

  /**
   * Comment on a PR. Only one comment will be present on the PR, Older comments are removed.
   * You can use the "context" option to multiple comments on a PR.
   *
   * @param options Options for the comment functionality
   */
  async comment(options: ICommentCommandOptions) {
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

    this.logger.verbose.info("Using command: 'comment'");
    const prNumber = this.getPrNumber('comment', pr);

    if (dryRun) {
      if (deleteFlag) {
        this.logger.log.info(
          `Would have deleted comment on ${prNumber} under "${context}" context`
        );
      } else {
        this.logger.log.info(
          `Would have commented on ${prNumber} under "${context}" context:\n\n${message}`
        );
      }
    } else {
      if (deleteFlag) {
        await this.git.deleteComment(prNumber, context);
      }

      if (message) {
        await this.git.createComment(message, prNumber, context);
        this.logger.log.success(`Commented on PR #${pr}`);
      }
    }
  }

  /**
   * Update the body of a PR with a message. Only one message will be present in the PR,
   * Older messages are removed. You can use the "context" option to multiple message
   * in a PR body.
   *
   * @param options Options
   */
  async prBody(options: ICommentCommandOptions) {
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
  async version() {
    this.logger.verbose.info("Using command: 'version'");
    const bump = await this.getVersion();
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
  async runRelease(options: IReleaseCommandOptions = {}) {
    this.logger.verbose.info("Using command: 'release'");
    await this.makeRelease(options);
  }

  async canary(options: ICanaryCommandOptions = {}) {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

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

    pr = options.pr ? String(options.pr) : pr;
    build = options.build ? String(options.build) : build;

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

    if (!('isPr' in env)) {
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

      newVersion = result;
      const message =
        options.message || 'Published PR with canary version: `%v`';

      if (message !== 'false' && pr) {
        await this.prBody({
          pr: Number(pr),
          message: message.replace('%v', newVersion),
          context: 'canary-version'
        });
      }

      this.logger.log.success(
        `Published canary version${newVersion ? `: ${newVersion}` : ''}`
      );
    }

    const latestTag = await this.git.getLatestTagInBranch();
    const commitsInRelease = await this.release.getCommits(latestTag);
    return { newVersion, commitsInRelease };
  }

  /**
   * Run the full workflow.
   *
   * 1. Calculate version
   * 2. Make changelog
   * 3. Publish code
   * 4. Create a release
   */
  async shipit(options: IShipItCommandOptions = {}) {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'shipit'");
    this.hooks.beforeShipIt.call();

    // env-ci sets branch to target branch (ex: master) in some CI services.
    // so we should make sure we aren't in a PR just to be safe
    const isPR = 'isPr' in env && env.isPr;
    const isBaseBranch =
      !isPR && 'branch' in env && env.branch === this.baseBranch;
    const publishInfo = isBaseBranch
      ? await this.publishLatest(options)
      : await this.canary(options);

    if (!publishInfo) {
      return;
    }

    const { newVersion, commitsInRelease } = publishInfo;
    await this.hooks.afterShipIt.promise(newVersion, commitsInRelease);
  }

  async getCurrentVersion(lastRelease: string) {
    this.hooks.getPreviousVersion.tap('None', () => {
      this.logger.veryVerbose.info(
        'No previous release found, using 0.0.0 as previous version.'
      );
      return this.prefixRelease('0.0.0');
    });

    const lastVersion = await this.hooks.getPreviousVersion.promise(
      this.prefixRelease
    );

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

  private async publishLatest(options: IShipItCommandOptions) {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    const version = await this.getVersion();

    if (version === '') {
      this.logger.log.info('No version published.');
      return;
    }

    const lastRelease = await this.git.getLatestRelease();
    const commitsInRelease = await this.release.getCommitsInRelease(
      lastRelease
    );

    await this.makeChangelog(options);

    if (!options.dryRun) {
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

    return { newVersion, commitsInRelease };
  }

  private getPrNumber(command: string, pr?: number) {
    const envPr = 'pr' in env && Number(env.pr);
    const prNumber = pr || envPr;

    if (!prNumber) {
      throw new Error(
        `Could not detect PR number. ${command} must be run from either a PR or have the PR number supllied via the --pr flag.`
      );
    }

    return prNumber;
  }

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
        graphqlBaseUrl: gitOptions.graphqlBaseUrl
      },
      this.logger
    );
  }

  private async getVersion() {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    const lastRelease = await this.git.getLatestRelease();
    return this.release.getSemverBump(lastRelease);
  }

  private async makeChangelog({
    dryRun,
    from,
    to,
    message
  }: IChangelogOptions = {}) {
    if (!this.release || !this.git) {
      throw this.createErrorMessage();
    }

    await this.setGitUser();

    const lastRelease = from || (await this.git.getLatestRelease());
    const releaseNotes = await this.release.generateReleaseNotes(
      lastRelease,
      to || undefined
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
      currentVersion,
      message
    );
  }

  private async makeRelease({
    dryRun,
    useVersion
  }: IReleaseCommandOptions = {}) {
    if (!this.release || !this.git) {
      throw this.createErrorMessage();
    }

    let lastRelease = await this.git.getLatestRelease();

    // Find base commit or latest release to generate the changelog to HEAD (new tag)
    this.logger.veryVerbose.info(`Using ${lastRelease} as previous release.`);

    if (lastRelease.match(/^\d+\.\d+\.\d+/)) {
      lastRelease = this.prefixRelease(lastRelease);
    }

    this.logger.log.info('Last used release:', lastRelease);

    const commitsInRelease = await this.release.getCommitsInRelease(
      lastRelease
    );
    const releaseNotes = await this.release.generateReleaseNotes(lastRelease);

    this.logger.log.info(`Using release notes:\n${releaseNotes}`);

    const rawVersion =
      useVersion ||
      (await this.getCurrentVersion(lastRelease)) ||
      (await this.git.getLatestTagInBranch());

    if (!rawVersion) {
      this.logger.log.error('Could not calculate next version from last tag.');
      return;
    }

    const newVersion = parse(rawVersion)
      ? this.prefixRelease(rawVersion)
      : rawVersion;

    if (!dryRun && parse(lastRelease) && eq(newVersion, lastRelease)) {
      this.logger.log.warn(
        `Nothing released to Github. Version to be released is the same as the latest release on Github: ${newVersion}`
      );
      return;
    }

    if (!dryRun) {
      this.logger.log.info(`Releasing ${newVersion} to GitHub.`);
      await this.git.publish(releaseNotes, newVersion);
    } else {
      this.logger.log.info(`Would have released: ${newVersion}`);
    }

    await this.hooks.afterRelease.promise(
      newVersion,
      commitsInRelease,
      releaseNotes
    );

    return newVersion;
  }

  private readonly prefixRelease = (release: string) => {
    if (!this.release) {
      throw this.createErrorMessage();
    }

    return this.release.options.noVersionPrefix || release.startsWith('v')
      ? release
      : `v${release}`;
  };

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

      let { email, name } = this.release.options;
      this.logger.verbose.warn(
        `Got author from options: email: ${email}, name ${name}`
      );
      const packageAuthor = await this.hooks.getAuthor.promise();
      this.logger.verbose.warn(
        `Got author: ${JSON.stringify(packageAuthor, undefined, 2)}`
      );

      email = packageAuthor ? packageAuthor.email : email;
      name = packageAuthor ? packageAuthor.name : name;

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

  private async getRepo(config: IReleaseOptions) {
    if (config.owner && config.repo) {
      return config as IRepository;
    }

    return this.hooks.getRepository.promise();
  }

  /**
   * Apply all of the plugins in the config.
   */
  private loadPlugins(config: IReleaseOptions) {
    const pluginsPaths = config.plugins || ['npm'];

    pluginsPaths
      .map(plugin =>
        typeof plugin === 'string' ? ([plugin, {}] as [string, any]) : plugin
      )
      .map(plugin => loadPlugin(plugin, this.logger))
      .filter((plugin): plugin is IPlugin => !!plugin)
      .forEach(plugin => {
        this.logger.verbose.info(`Using ${plugin.name} Plugin...`);
        plugin.apply(this);
      });
  }
}

// Plugin Utils

export * from './cli-args';
export { ILogger } from './utils/logger';
export { IPlugin } from './utils/load-plugins';
export { default as Auto } from './auto';
export { default as SEMVER } from './semver';
export { default as execPromise } from './utils/exec-promise';
export { VersionLabel } from './release';
