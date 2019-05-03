import dotenv from 'dotenv';
import envCi from 'env-ci';
import fs from 'fs';
import path from 'path';
import { gt, inc, ReleaseType } from 'semver';
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
  IPRCommandOptions,
  IReleaseCommandOptions,
  IShipItCommandOptions
} from './cli/args';

import Changelog from './changelog';
import Config from './config';
import Git, { IGitOptions, IPRInfo } from './git';
import init from './init';
import LogParse, { IExtendedCommit } from './log-parse';
import { execPromise } from './main';
import Release, {
  getVersionMap,
  ILabelDefinitionMap,
  IReleaseOptions,
  VersionLabel
} from './release';
import SEMVER, { calculateSemVerBump } from './semver';
import getGitHubToken from './utils/github-token';
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
  afterRelease: AsyncParallelHook<[string | undefined, IExtendedCommit[]]>;
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
  canary: AsyncParallelHook<[string]>;
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
  config?: IReleaseOptions;

  release?: Release;
  git?: Git;
  labels?: ILabelDefinitionMap;
  semVerLabels?: Map<VersionLabel, string>;

  constructor(args: ArgsType) {
    this.args = args;
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
    const config = this.hooks.modifyConfig.call(
      await configLoader.loadConfig(this.args)
    );

    this.logger.verbose.success('Loaded `auto` with config:', config);

    this.config = config;
    this.labels = config.labels;
    this.semVerLabels = getVersionMap(config.labels);
    this.loadPlugins(config);
    this.hooks.beforeRun.call(config);

    const repository = await this.getRepo(config);
    const token =
      repository && repository.token
        ? repository.token
        : await getGitHubToken(config.githubApi);
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
  async pr({ dryRun, pr, url, ...options }: IPRCommandOptions) {
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

    this.logger.verbose.info("Using command: 'pr'");

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
  async comment({
    message,
    pr,
    context = 'default',
    dryRun
  }: ICommentCommandOptions) {
    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'comment'");
    if (dryRun) {
      this.logger.log.info(
        `Would have commented on ${pr} under "${context}" context:\n\n${message}`
      );
    } else {
      const prNumber = this.getPrNumber('comment', pr);

      await this.git.createComment(message, prNumber, context);
      this.logger.log.success(`Commented on PR #${pr}`);
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
  async runRelease(options: IReleaseCommandOptions) {
    this.logger.verbose.info("Using command: 'release'");
    await this.makeRelease(options);
  }

  async canary(options: ICanaryCommandOptions = {}) {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    const lastRelease = await this.git.getLatestRelease();
    // SailEnv falls back to commit SHA
    let preId: string | undefined;
    let build: string | undefined;

    if ('pr' in env && 'build' in env) {
      preId = env.pr;
      ({ build } = env);
    } else if ('pr' in env && 'commit' in env) {
      preId = env.pr;
      build = env.commit;
    } else {
      preId = await this.git.getSha(true);
    }

    preId = options.pr ? String(options.pr) : preId;
    build = options.build ? String(options.build) : build;

    const current = await this.getCurrentVersion(lastRelease);
    const head = await this.release.getCommitsInRelease('HEAD^');
    const labels = head.map(commit => commit.labels);
    const version = calculateSemVerBump(
      labels,
      this.semVerLabels!,
      this.config
    );
    const nextVersion = inc(current, (version || 'patch') as ReleaseType);
    let canaryVersion = `${nextVersion}-canary.${preId}`;

    if (build) {
      canaryVersion = `${canaryVersion}.${build}`;
    }

    if (options.dryRun) {
      this.logger.log.warn(`Published version would be ${canaryVersion}`);
    } else {
      this.logger.verbose.info('Calling canary hook');
      await this.hooks.canary.promise(canaryVersion);

      const message =
        options.message || 'Published PR with canary version: `%v`';

      if (message !== 'false' && env.isCi) {
        this.comment({
          message: message.replace('%v', canaryVersion),
          context: 'canary-version'
        });
      }
    }

    return canaryVersion;
  }

  /**
   * Run the full workflow.
   *
   * 1. Calculate version
   * 2. Make changelog
   * 3. Publish code
   * 4. Create a release
   */
  async shipit(options: IShipItCommandOptions) {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'shipit'");
    this.hooks.beforeShipIt.call();

    const version = await this.getVersion();

    if (version === '') {
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

      this.logger.log.warn(
        `Published version would be ${inc(current, version as ReleaseType)}`
      );
    }

    await this.hooks.afterShipIt.promise(newVersion, commitsInRelease);
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

  private async getCurrentVersion(lastRelease: string) {
    this.hooks.getPreviousVersion.tap('None', () => {
      this.logger.veryVerbose.info(
        'No previous release found, using 0.0.0 as previous version.'
      );
      return this.prefixRelease('0.0.0');
    });

    const lastVersion = await this.hooks.getPreviousVersion.promise(
      this.prefixRelease
    );

    if (lastRelease.match(/\d+\.\d+\.\d+/) && gt(lastRelease, lastVersion)) {
      this.logger.veryVerbose.info('Using latest release as previous version');
      return lastRelease;
    }

    return lastVersion;
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
    useVersion,
    slack
  }: IReleaseCommandOptions = {}) {
    if (!this.release || !this.git) {
      throw this.createErrorMessage();
    }

    let lastRelease = await this.git.getLatestRelease();

    // Find base commit or latest release to generate the changelog to HEAD (new tag)
    this.logger.veryVerbose.info(`Using ${lastRelease} as previous release.`);

    if (lastRelease.match(/\d+\.\d+\.\d+/)) {
      lastRelease = this.prefixRelease(lastRelease);
    }

    this.logger.log.info('Last used release:', lastRelease);

    const commitsInRelease = await this.release.getCommitsInRelease(
      lastRelease
    );
    const releaseNotes = await this.release.generateReleaseNotes(lastRelease);

    this.logger.log.info(`Using release notes:\n${releaseNotes}`);

    const version = useVersion || (await this.getCurrentVersion(lastRelease));

    if (!version) {
      this.logger.log.error('Could not calculate next version from last tag.');
      return;
    }

    const prefixed = this.prefixRelease(version);
    this.logger.log.info(`Publishing ${prefixed} to GitHub.`);

    if (!dryRun) {
      await this.git.publish(releaseNotes, prefixed);

      if (slack || (this.config && this.config.slack)) {
        this.logger.log.info('Posting release to slack');
        await this.release.postToSlack(releaseNotes, prefixed);
      }
    } else {
      this.logger.verbose.info('Release dry run complete.');
    }

    await this.hooks.afterRelease.promise(prefixed, commitsInRelease);

    return prefixed;
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
      const packageAuthor = await this.hooks.getAuthor.promise();

      email = packageAuthor ? packageAuthor.email : email;
      name = packageAuthor ? packageAuthor.name : name;

      if (email) {
        await execPromise('git', ['config', 'user.email', `"${email}"`]);
      }

      if (name) {
        await execPromise('git', ['config', 'user.name', `"${name}"`]);
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
