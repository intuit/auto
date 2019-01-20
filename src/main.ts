#!/usr/bin/env node

import cosmiconfig from 'cosmiconfig';
import envCi from 'env-ci';
import { gt } from 'semver';

import {
  ArgsType,
  IChangelogOptions,
  ICommentCommandOptions,
  ICreateLabelsCommandOptions,
  IInitCommandOptions,
  ILabelCommandOptions,
  IPRCheckCommandOptions,
  IPRCommandOptions,
  IReleaseOptions
} from './cli/args';
import { IPRInfo } from './git';
import GitHubRelease, {
  defaultChangelogTitles,
  defaultLabels,
  IGitHubReleaseOptions,
  VersionLabel
} from './github-release';

import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';
import init from './init';
import LogParse from './log-parse';
import SEMVER from './semver';
import execPromise from './utils/exec-promise';
import getGitHubToken from './utils/github-token';
import loadPlugin, { IPlugin } from './utils/load-plugins';
import createLog, { ILogger } from './utils/logger';
import { makeHooks } from './utils/make-hooks';

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
  beforeRun: SyncHook<[IGitHubReleaseOptions]>;
  beforeShipIt: SyncHook<[]>;
  getAuthor: AsyncSeriesBailHook<[], IAuthor>;
  getPreviousVersion: AsyncSeriesBailHook<
    [(release: string) => string],
    string
  >;
  getRepository: AsyncSeriesBailHook<[], IRepository | void>;
  publish: AsyncSeriesHook<[SEMVER]>;
  onCreateGitHubRelease: SyncHook<[GitHubRelease]>;
  onCreateLogParse: SyncHook<[LogParse]>;
}

export class AutoRelease {
  public hooks: IAutoHooks;
  public logger: ILogger;
  public args: ArgsType;

  public githubRelease?: GitHubRelease;
  public semVerLabels?: Map<VersionLabel, string>;

  constructor(args: ArgsType) {
    this.args = args;
    this.logger = createLog(
      args.veryVerbose ? 'veryVerbose' : args.verbose ? 'verbose' : undefined
    );
    this.hooks = makeHooks();
  }

  public async loadConfig() {
    const explorer = cosmiconfig('auto');
    const result = await explorer.search();

    let rawConfig: cosmiconfig.Config = {};

    if (result && result.config) {
      rawConfig = result.config;
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

    this.githubRelease = new GitHubRelease(
      { owner: config.owner, repo: config.repo, ...repository, token },
      config,
      this.logger
    );
    this.hooks.onCreateGitHubRelease.tap(
      'Link onCreateLogParse',
      githubRelease => {
        githubRelease.hooks.onCreateLogParse.tap(
          'Link onCreateLogParse',
          logParse => this.hooks.onCreateLogParse.call(logParse)
        );
      }
    );
    this.hooks.onCreateGitHubRelease.call(this.githubRelease);
  }

  public async init(options: IInitCommandOptions = {}) {
    await init(options, this.logger);
  }

  public async createLabels(options: ICreateLabelsCommandOptions = {}) {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    await this.githubRelease.addLabelsToProject(
      new Map([
        ...this.semVerLabels,
        ...new Map(
          [
            ...Object.keys(defaultChangelogTitles),
            ...Object.keys(
              this.githubRelease.releaseOptions.changelogTitles || {}
            )
          ].map((label): [string, string] => [label, label])
        )
      ]),
      options
    );
  }

  public async label({ pr }: ILabelCommandOptions = {}) {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'label'");
    let labels: string[] = [];

    if (!pr) {
      const pulls = await this.githubRelease.getPullRequests({
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
      labels = await this.githubRelease.getLabels(pr);
    }

    if (labels.length) {
      console.log(labels.join('\n'));
    }
  }

  public async pr({ dryRun, pr, url, ...options }: IPRCommandOptions) {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    let { sha } = options;
    this.logger.verbose.info("Using command: 'pr'");

    if (!sha && pr) {
      this.logger.verbose.info('Getting commit SHA from PR.');
      const res = await this.githubRelease.getPullRequest(pr);
      sha = res.data.head.sha;
    } else if (!sha) {
      this.logger.verbose.info('No PR found, getting commit SHA from HEAD.');
      sha = await this.githubRelease.getSha();
    }

    this.logger.verbose.info('Found PR SHA:', sha);

    // tslint:disable-next-line variable-name
    const target_url = url;

    if (!dryRun) {
      await this.githubRelease.createStatus({
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

  public async prCheck({
    dryRun,
    pr,
    url,
    ...options
  }: IPRCheckCommandOptions) {
    if (!this.githubRelease || !this.semVerLabels) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info(`Using command: 'pr-check' for '${url}'`);

    // tslint:disable-next-line variable-name
    const target_url = url;
    let msg;
    let sha;

    try {
      const res = await this.githubRelease.getPullRequest(pr);
      sha = res.data.head.sha;

      const labels = await this.githubRelease.getLabels(pr);
      const labelTexts = [...this.semVerLabels.values()];
      const releaseTag = labels.find(l => l === 'release');

      const skipReleaseTag = labels.find(
        l =>
          !!this.githubRelease &&
          this.githubRelease.releaseOptions.skipReleaseLabels.includes(l)
      );
      const semverTag = labels.find(
        l =>
          labelTexts.includes(l) &&
          !!this.githubRelease &&
          !this.githubRelease.releaseOptions.skipReleaseLabels.includes(l) &&
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
      await this.githubRelease.createStatus({
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

  public async comment({
    message,
    pr,
    context = 'default',
    dryRun
  }: ICommentCommandOptions) {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'comment'");

    if (dryRun) {
      this.logger.log.info(
        `Would have commented on ${pr} under "${context}" context:\n\n${message}`
      );
    } else {
      await this.githubRelease.createComment(message, pr, context);
      this.logger.log.success(`Commented on PR #${pr}`);
    }
  }

  public async version() {
    this.logger.verbose.info("Using command: 'version'");
    const bump = await this.getVersion();
    console.log(bump);
  }

  public async changelog(options?: IChangelogOptions) {
    this.logger.verbose.info("Using command: 'changelog'");
    await this.makeChangelog(options);
  }

  public async release(options: IReleaseOptions) {
    this.logger.verbose.info("Using command: 'release'");
    await this.makeRelease(options);
  }

  public async shipit() {
    this.logger.verbose.info("Using command: 'shipit'");
    this.hooks.beforeShipIt.call();

    const version = await this.getVersion();

    if (version === '') {
      return;
    }

    await this.makeChangelog();
    await this.hooks.publish.promise(version);
    await this.makeRelease();
  }

  private async getVersion() {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    const lastRelease = await this.githubRelease.getLatestRelease();
    return this.githubRelease.getSemverBump(lastRelease);
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
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    await this.setGitUser();

    const lastRelease = from || (await this.githubRelease.getLatestRelease());
    const releaseNotes = await this.githubRelease.generateReleaseNotes(
      lastRelease,
      to || undefined
    );

    this.logger.log.info('New Release Notes\n', releaseNotes);

    if (!dryRun) {
      const currentVersion = await this.getCurrentVersion(lastRelease);

      await this.githubRelease.addToChangelog(
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
  }: IReleaseOptions = {}) {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    let lastRelease = await this.githubRelease.getLatestRelease();

    // Find base commit or latest release to generate the changelog to HEAD (new tag)
    this.logger.veryVerbose.info(`Using ${lastRelease} as previous release.`);

    if (lastRelease.match(/\d+\.\d+\.\d+/)) {
      lastRelease = this.prefixRelease(lastRelease);
    }

    this.logger.log.info('Last used release:', lastRelease);

    const releaseNotes = await this.githubRelease.generateReleaseNotes(
      lastRelease
    );

    this.logger.log.info(`Using release notes:\n${releaseNotes}`);

    const version = useVersion || (await this.getCurrentVersion(lastRelease));

    if (!version) {
      this.logger.log.error('Could not calculate next version from last tag.');
      return;
    }

    const prefixed = this.prefixRelease(version);
    this.logger.log.info(`Publishing ${prefixed} to GitHub.`);

    if (!dryRun) {
      await this.githubRelease.publish(releaseNotes, prefixed);

      if (slack) {
        this.logger.log.info('Posting release to slack');
        await this.githubRelease.postToSlack(releaseNotes, prefixed);
      }
    } else {
      this.logger.verbose.info('Release dry run complete.');
    }
  }

  private readonly prefixRelease = (release: string) => {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    return this.githubRelease.releaseOptions.noVersionPrefix ||
      release.startsWith('v')
      ? release
      : `v${release}`;
  };

  private createErrorMessage() {
    return new Error(
      `AutoRelease is not initialized! Make sure the have run AutoRelease.loadConfig`
    );
  }

  private async setGitUser() {
    const { isCi } = envCi();

    try {
      // If these values are not set git config will exit with an error
      await execPromise('git', ['config', 'user.email']);
      await execPromise('git', ['config', 'user.name']);
    } catch (error) {
      if (!isCi) {
        this.logger.log.note(
          `Detected local environment, will not set git user. This happens automatically in a CI environment.

If a command fails manually run:

  - git config user.email your@email.com
  - git config user.name "Your Name"`
        );
        return;
      }

      if (!this.githubRelease) {
        return;
      }

      let { email, name } = this.githubRelease.releaseOptions;
      const packageAuthor = await this.hooks.getAuthor.promise();

      email = email || packageAuthor.email;
      name = name || packageAuthor.name;

      if (email) {
        await execPromise('git', ['config', 'user.email', `"${email}"`]);
      }

      if (name) {
        await execPromise('git', ['config', 'user.name', `"${name}"`]);
      }
    }
  }

  private async getRepo(config: IGitHubReleaseOptions) {
    if (config.owner && config.repo) {
      return config as IRepository;
    }

    return this.hooks.getRepository.promise();
  }

  private loadPlugins(config: IGitHubReleaseOptions) {
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

export async function run(args: ArgsType) {
  const auto = new AutoRelease(args);

  switch (args.command) {
    case 'init':
      await auto.init(args as IInitCommandOptions);
      break;
    case 'create-labels':
      await auto.loadConfig();
      await auto.createLabels(args as ICreateLabelsCommandOptions);
      break;
    case 'label':
      await auto.loadConfig();
      await auto.label(args as ILabelCommandOptions);
      break;
    case 'pr-check':
      await auto.loadConfig();
      await auto.prCheck(args as IPRCheckCommandOptions);
      break;
    case 'pr':
      await auto.loadConfig();
      await auto.pr(args as IPRCommandOptions);
      break;
    case 'comment':
      await auto.loadConfig();
      await auto.comment(args as ICommentCommandOptions);
      break;
    case 'version':
      await auto.loadConfig();
      await auto.version();
      break;
    case 'changelog':
      await auto.loadConfig();
      await auto.changelog(args as IChangelogOptions);
      break;
    case 'release':
      await auto.loadConfig();
      await auto.release(args as IReleaseOptions);
      break;
    case 'shipit':
      await auto.loadConfig();
      await auto.shipit();
      break;
    default:
      throw new Error(`idk what i'm doing.`);
  }
}

export default async function main(args: ArgsType) {
  try {
    await run(args);
  } catch (error) {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

// Plugin Utils

export { ILogger } from './utils/logger';
export { IPlugin } from './utils/load-plugins';
export { default as SEMVER } from './semver';
export { default as execPromise } from './utils/exec-promise';
