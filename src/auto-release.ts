import cosmiconfig from 'cosmiconfig';
import merge from 'deepmerge';
import env from 'dotenv';
import isCI from 'is-ci';
import { gt, inc, ReleaseType } from 'semver';
import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';

import {
  ArgsType,
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
import Git, { IGitOptions, IPRInfo } from './git';
import init from './init';
import LogParse from './log-parse';
import { execPromise } from './main';
import Release, {
  defaultChangelogTitles,
  defaultLabels,
  IReleaseOptions,
  VersionLabel
} from './release';
import SEMVER from './semver';
import getGitHubToken from './utils/github-token';
import loadPlugin, { IPlugin } from './utils/load-plugins';
import createLog, { ILogger } from './utils/logger';
import { makeHooks } from './utils/make-hooks';
import tryRequire from './utils/try-require';

type ConfigLoader = () => cosmiconfig.Config;

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
  beforeRun: SyncHook<[IReleaseOptions]>;
  beforeShipIt: SyncHook<[]>;
  getAuthor: AsyncSeriesBailHook<[], IAuthor | void>;
  getPreviousVersion: AsyncSeriesBailHook<
    [(release: string) => string],
    string
  >;
  getRepository: AsyncSeriesBailHook<[], IRepository | void>;
  publish: AsyncSeriesHook<[SEMVER]>;
  onCreateRelease: SyncHook<[Release]>;
  onCreateLogParse: SyncHook<[LogParse]>;
  onCreateChangelog: SyncHook<[Changelog]>;
}

export default class AutoRelease {
  hooks: IAutoHooks;
  logger: ILogger;
  args: ArgsType;

  release?: Release;
  git?: Git;
  semVerLabels?: Map<VersionLabel, string>;

  constructor(args: ArgsType) {
    this.args = args;
    this.logger = createLog(
      args.veryVerbose ? 'veryVerbose' : args.verbose ? 'verbose' : undefined
    );
    this.hooks = makeHooks();

    this.hooks.onCreateRelease.tap('Link onCreateChangelog', release => {
      release.hooks.onCreateChangelog.tap('Link onCreateChangelog', changelog =>
        this.hooks.onCreateChangelog.call(changelog)
      );
    });
    this.hooks.onCreateRelease.tap('Link onCreateLogParse', release => {
      release.hooks.onCreateLogParse.tap('Link onCreateLogParse', logParse =>
        this.hooks.onCreateLogParse.call(logParse)
      );
    });

    env.config();
  }

  /**
   * Loads a config from a path, package name, or special `auto-config` pattern
   *
   * ex: auto-config-MY_CONFIG
   * ex: @MY_CONFIG/auto-config
   *
   * @param extend Path or name of config to find
   */
  loadExtendConfig(extend: string) {
    let config: cosmiconfig.Config | ConfigLoader = tryRequire(extend);

    if (!config) {
      config = tryRequire(`${extend}/auto-config`);
    }

    if (!config) {
      config = tryRequire(`auto-config-${extend}`);
    }

    if (typeof config === 'function') {
      return (config as ConfigLoader)();
    }

    return config || {};
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig() {
    const explorer = cosmiconfig('auto');
    const result = await explorer.search();

    let rawConfig: cosmiconfig.Config = {};

    if (result && result.config) {
      rawConfig = result.config;
    }

    if (rawConfig.extends) {
      rawConfig = merge(rawConfig, this.loadExtendConfig(rawConfig.extends));
    }

    this.logger.verbose.success(
      'Loaded `auto-release` with config:',
      rawConfig
    );

    this.semVerLabels = defaultLabels;

    if (rawConfig.labels) {
      this.semVerLabels = new Map<VersionLabel, string>([
        ...defaultLabels,
        ...(Object.entries(rawConfig.labels) as [VersionLabel, string][])
      ]);
    }

    this.logger.verbose.success(
      'Using SEMVER labels:',
      '\n',
      this.semVerLabels
    );

    const skipReleaseLabels = rawConfig.skipReleaseLabels || [];

    if (!skipReleaseLabels.includes(this.semVerLabels.get('skip-release')!)) {
      skipReleaseLabels.push(this.semVerLabels.get('skip-release')!);
    }

    const config = {
      ...rawConfig,
      ...this.args,
      versionLabels: this.semVerLabels,
      skipReleaseLabels
    };

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
      baseUrl: config.githubApi || 'https://api.github.com'
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
    if (!this.release) {
      throw this.createErrorMessage();
    }

    await this.release.addLabelsToProject(
      new Map([
        ...this.semVerLabels,
        ...new Map(
          [
            ...Object.keys(defaultChangelogTitles),
            ...Object.keys(this.release.options.changelogTitles || {})
          ].map((label): [string, string] => [label, label])
        )
      ]),
      options
    );
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
    this.logger.verbose.info("Using command: 'pr'");

    if (!sha && pr) {
      this.logger.verbose.info('Getting commit SHA from PR.');
      const res = await this.git.getPullRequest(pr);
      sha = res.data.head.sha;
    } else if (!sha) {
      this.logger.verbose.info('No PR found, getting commit SHA from HEAD.');
      sha = await this.git.getSha();
    }

    this.logger.verbose.info('Found PR SHA:', sha);

    // tslint:disable-next-line variable-name
    const target_url = url;

    if (!dryRun) {
      await this.git.createStatus({
        ...options,
        sha,
        target_url
      });

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
    let msg;
    let sha;

    try {
      const res = await this.git.getPullRequest(pr);
      sha = res.data.head.sha;

      const labels = await this.git.getLabels(pr);
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

    this.logger.verbose.info('Posting comment to GitHub\n', msg);

    if (!dryRun) {
      await this.git.createStatus({
        ...options,
        ...msg,
        target_url,
        sha
      } as IPRInfo);

      this.logger.log.success('Posted status to Pull Request.');
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
      await this.git.createComment(message, pr, context);
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

  /**
   * Run the full workflow.
   *
   * 1. Calculate version
   * 2. Make changelog
   * 3. Publish code
   * 4. Create a release
   */
  async shipit(options: IShipItCommandOptions) {
    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'shipit'");
    this.hooks.beforeShipIt.call();

    const version = await this.getVersion();

    if (version === '') {
      return;
    }

    await this.makeChangelog(options);

    if (!options.dryRun) {
      await this.hooks.publish.promise(version);
    }

    await this.makeRelease(options);

    if (options.dryRun) {
      this.logger.log.warn(
        "The version reported in the line above hasn't been incremneted during `dry-run`"
      );

      const lastRelease = await this.git.getLatestRelease();
      const current = await this.getCurrentVersion(lastRelease);

      this.logger.log.warn(
        `Published version would be ${inc(current, version as ReleaseType)}`
      );
    }
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
        baseUrl: gitOptions.baseUrl
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

    if (!dryRun) {
      const currentVersion = await this.getCurrentVersion(lastRelease);

      await this.release.addToChangelog(
        releaseNotes,
        lastRelease,
        currentVersion,
        message
      );
    } else {
      this.logger.verbose.info('`changelog` dry run complete.');
    }
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

      if (slack) {
        this.logger.log.info('Posting release to slack');
        await this.release.postToSlack(releaseNotes, prefixed);
      }
    } else {
      this.logger.verbose.info('Release dry run complete.');
    }
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
      `AutoRelease is not initialized! Make sure the have run AutoRelease.loadConfig`
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
      if (!isCI) {
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
