#!/usr/bin/env node

import cosmiconfig from 'cosmiconfig';
import { gt } from 'semver';

import { ArgsType } from './cli/args';
import { IPRInfo } from './git';
import GitHubRelease, {
  defaultChangelogTitles,
  defaultLabels,
  IGitHubReleaseOptions,
  VersionLabel
} from './github-release';

import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';
import init from './init';
import NpmPlugin from './plugins/npm';
import SEMVER from './semver';
import execPromise from './utils/exec-promise';
import getGitHubToken from './utils/github-token';
import createLog, { ILogger } from './utils/logger';

interface IAuthor {
  name?: string;
  email?: string;
}

interface IRepository {
  owner?: string;
  repo?: string;
  token?: string;
}

interface IAutoHooks {
  beforeRun: SyncHook<[IGitHubReleaseOptions]>;
  getAuthor: AsyncSeriesBailHook<[], IAuthor>;
  getPreviousVersion: AsyncSeriesBailHook<
    [(release: string) => string],
    string
  >;
  getRepository: AsyncSeriesBailHook<[], IRepository>;
  publish: AsyncSeriesHook<[SEMVER]>;
}

export interface IPlugin {
  name: string;
  apply(auto: AutoRelease): void;
}

export class AutoRelease {
  public hooks: IAutoHooks;
  public logger: ILogger;
  public args: ArgsType;
  public plugins: IPlugin[];

  public githubRelease?: GitHubRelease;
  public semVerLabels?: Map<VersionLabel, string>;

  constructor({
    plugins = [new NpmPlugin()],
    ...args
  }: ArgsType & { plugins?: IPlugin[] }) {
    this.args = args;
    this.plugins = plugins;
    this.logger = createLog(
      args.veryVerbose ? 'veryVerbose' : args.verbose ? 'verbose' : undefined
    );

    this.hooks = {
      beforeRun: new SyncHook(['config']),
      getAuthor: new AsyncSeriesBailHook([]),
      getPreviousVersion: new AsyncSeriesBailHook(['prefixRelease']),
      getRepository: new AsyncSeriesBailHook([]),
      publish: new AsyncSeriesHook(['version'])
    };
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
      this.semVerLabels = {
        ...defaultLabels,
        ...rawConfig.labels
      };
    }

    this.logger.verbose.success(
      'Using SEMVER labels:',
      '\n',
      this.semVerLabels
    );

    const skipReleaseLabels = rawConfig.skipReleaseLabels || [];

    if (
      this.semVerLabels &&
      !skipReleaseLabels.includes(this.semVerLabels.get('skip-release')!)
    ) {
      skipReleaseLabels.push(this.semVerLabels.get('skip-release')!);
    }

    this.plugins.forEach(plugin => {
      this.logger.verbose.info(`Using ${plugin.name} Plugin...`);
      plugin.apply(this);
    });

    const config = {
      ...rawConfig,
      ...this.args,
      skipReleaseLabels,
      slack:
        typeof this.args.slack === 'string' ? this.args.slack : rawConfig.slack
    };

    this.hooks.beforeRun.call(config);

    const repository = await this.getRepo();
    const token = repository.token || (await getGitHubToken(config.githubApi));
    this.githubRelease = new GitHubRelease(
      { ...repository, token },
      config,
      this.logger
    );
  }

  public async init() {
    await init(this.args.onlyLabels);
  }

  public async createLabels() {
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
      ])
    );
  }

  public async label() {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'label'");
    let labels: string[] = [];

    if (!this.args.pr) {
      const pulls = await this.githubRelease.getPullRequests({
        state: 'closed'
      });
      const lastMerged = pulls.find(pull => !!pull.merged_at);

      if (lastMerged) {
        labels = lastMerged.labels.map(label => label.name);
      }
    } else {
      labels = await this.githubRelease.getLabels(this.args.pr);
    }

    console.log(labels.join('\n'));
  }

  public async pr() {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'pr'");

    if (!this.args.sha && this.args.pr) {
      this.logger.verbose.info('Getting commit SHA from PR.');
      const res = await this.githubRelease.getPullRequest(this.args.pr);
      this.args.sha = res.data.head.sha;
    } else if (!this.args.sha) {
      this.logger.verbose.info('No PR found, getting commit SHA from HEAD.');
      this.args.sha = await this.githubRelease.getSha();
    }

    this.logger.verbose.info('Found PR SHA:', this.args.sha);

    this.args.target_url = this.args.url;
    delete this.args.url;

    if (!this.args.dryRun) {
      await this.githubRelease.createStatus(this.args as IPRInfo);
    } else {
      this.logger.verbose.info('`pr` dry run complete.');
    }

    this.logger.verbose.success('Finished `pr` command');
  }

  public async prCheck() {
    if (!this.githubRelease || !this.semVerLabels) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info(
      `Using command: 'pr-check' for '${this.args.url}'`
    );

    this.args.target_url = this.args.url;
    delete this.args.url;

    let msg;

    try {
      const res = await this.githubRelease.getPullRequest(this.args.pr!);
      this.args.sha = res.data.head.sha;

      const labels = await this.githubRelease.getLabels(this.args.pr!);
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

    if (!this.args.dryRun) {
      await this.githubRelease.createStatus({
        ...this.args,
        ...msg
      } as IPRInfo);

      this.logger.log.success('Posted status to Pull Request.');
    } else {
      this.logger.verbose.info('`pr-check` dry run complete.');
    }

    this.logger.verbose.success('Finished `pr-check` command');
  }

  public async comment() {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'comment'");

    await this.githubRelease.createComment(
      this.args.message!,
      this.args.pr!,
      this.args.context || undefined
    );

    this.logger.log.success(`Commented on PR #${this.args.pr}`);
  }

  public async version() {
    this.logger.verbose.info("Using command: 'version'");
    const bump = await this.getVersion();
    console.log(bump);
  }

  public async changelog() {
    this.logger.verbose.info("Using command: 'changelog'");
    await this.makeChangelog();
  }

  public async release() {
    this.logger.verbose.info("Using command: 'release'");
    await this.makeRelease();
  }

  public async shipit() {
    this.logger.verbose.info("Using command: 'shipit'");

    const version = await this.getVersion();

    if (version === '') {
      return;
    }

    await this.makeChangelog();
    this.hooks.publish.promise(version);
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

  private async makeChangelog() {
    if (!this.githubRelease) {
      throw this.createErrorMessage();
    }

    await this.setGitUser();

    const lastRelease =
      this.args.from || (await this.githubRelease.getLatestRelease());
    const releaseNotes = await this.githubRelease.generateReleaseNotes(
      lastRelease,
      this.args.to || undefined
    );

    this.logger.log.info('New Release Notes\n', releaseNotes);

    if (!this.args.dryRun) {
      const currentVersion = await this.getCurrentVersion(lastRelease);

      await this.githubRelease.addToChangelog(
        releaseNotes,
        lastRelease,
        currentVersion,
        this.args.message || undefined
      );
    } else {
      this.logger.verbose.info('`changelog` dry run complete.');
    }
  }

  private async makeRelease() {
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

    const version =
      this.args.useVersion || (await this.getCurrentVersion(lastRelease));

    if (!version) {
      this.logger.log.error('Could not calculate next version from last tag.');
      return;
    }

    const prefixed = this.prefixRelease(version);
    this.logger.log.info(`Publishing ${prefixed} to GitHub.`);

    if (!this.args.dryRun) {
      await this.githubRelease.publish(releaseNotes, prefixed);

      if (this.args.slack) {
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
    try {
      // If these values are not set git config will exit with an error
      await execPromise('git', ['config', 'user.email']);
      await execPromise('git', ['config', 'user.name']);
    } catch (error) {
      this.hooks.getAuthor.tap('Arguments', () =>
        this.githubRelease ? (this.githubRelease.releaseOptions as IAuthor) : {}
      );

      const { name, email } = await this.hooks.getAuthor.promise();

      if (email) {
        await execPromise('git', ['config', 'user.email', `"${email}"`]);
      }

      if (name) {
        await execPromise('git', ['config', 'user.name', `"${name}"`]);
      }
    }
  }

  private async getRepo() {
    this.hooks.getRepository.tap('None', () =>
      this.githubRelease
        ? (this.githubRelease.releaseOptions as IRepository)
        : {}
    );
    return this.hooks.getRepository.promise();
  }
}

export async function run(args: ArgsType) {
  const auto = new AutoRelease(args);

  await auto.loadConfig();

  switch (args.command) {
    case 'init':
      auto.init();
      break;
    case 'create-labels':
      auto.createLabels();
      break;
    case 'label':
      auto.label();
      break;
    case 'pr-check':
      auto.prCheck();
      break;
    case 'pr':
      auto.pr();
      break;
    case 'comment':
      auto.comment();
      break;
    case 'version':
      auto.version();
      break;
    case 'release':
      auto.release();
      break;
    case 'shipit':
      auto.shipit();
      break;
    default:
      throw new Error(`idk what i'm doing.`);
  }
}

export default async function main(args: ArgsType) {
  try {
    await run(args);
  } catch (error) {
    console.log(error);
  }
}

// Plugin Utils

export { ILogger } from './utils/logger';
export { default as SEMVER } from './semver';
export { default as execPromise } from './utils/exec-promise';
