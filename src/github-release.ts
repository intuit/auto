import GHub from '@octokit/rest';
import * as fs from 'fs';
import { ICommit } from 'gitlog';
import { inc, ReleaseType } from 'semver';
import signale from 'signale';
import { promisify } from 'util';

import Github, { IGithubOptions, IPRInfo } from './git';
import generateReleaseNotes, {
  IExtendedCommit,
  normalizeCommits
} from './log-parse';
import SEMVER, { calculateSemVerBump, IVersionLabels } from './semver';
import exec from './utils/exec-promise';
import getGithubToken from './utils/github-token';
import { dummyLog } from './utils/logger';
import getConfigFromPackageJson from './utils/package-config';
import postToSlack from './utils/slack';

export type VersionLabel =
  | SEMVER.major
  | SEMVER.minor
  | SEMVER.patch
  | 'skip-release'
  | 'release'
  | 'prerelease';

export const defaultLabels = new Map<VersionLabel, string>();
defaultLabels.set(SEMVER.major, 'major');
defaultLabels.set(SEMVER.minor, 'minor');
defaultLabels.set(SEMVER.patch, 'patch');
defaultLabels.set('skip-release', 'skip-release');
defaultLabels.set('release', 'release');
defaultLabels.set('prerelease', 'prerelease');

export const defaultChangelogTitles = {
  major: '💥  Breaking Change',
  minor: '🚀  Enhancement',
  patch: '🐛  Bug Fix',
  internal: '🏠  Internal',
  documentation: '📝  Documentation'
};

export const defaultLabelsDescriptions = new Map<string, string>();
defaultLabelsDescriptions.set(SEMVER.major, 'create a major release');
defaultLabelsDescriptions.set(SEMVER.minor, 'create a minor release');
defaultLabelsDescriptions.set(SEMVER.patch, 'create a patch release');
defaultLabelsDescriptions.set('skip-release', 'do not create a release');
defaultLabelsDescriptions.set(
  'release',
  'publish a release when this pr is merged'
);
defaultLabelsDescriptions.set('prerelease', 'create pre release');
defaultLabelsDescriptions.set(
  'internal',
  'changes are internal to the project'
);
defaultLabelsDescriptions.set(
  'documentation',
  'changes only effect documentation'
);

export interface ILogger {
  log: signale.Signale<signale.DefaultMethods>;
  verbose: signale.Signale<signale.DefaultMethods>;
  veryVerbose: signale.Signale<signale.DefaultMethods>;
}

export interface IGithubReleaseOptions {
  labels?: IVersionLabels;
  logger: ILogger;
  jira?: string;
  slack?: string;
  githubApi?: string;
  name?: string;
  email?: string;
  changelogTitles?: {
    [label: string]: string;
  };
}

export interface IOptionalGithubOptions {
  owner?: string;
  repo?: string;
  baseUrl?: string;
  token?: string;
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export default class GithubRelease {
  private readonly github: Promise<Github>;
  private readonly userLabels: IVersionLabels;
  private readonly changelogTitles: { [label: string]: string };
  private readonly logger: ILogger;

  private readonly jira?: string;
  private readonly githubApi: string;
  private readonly slack?: string;

  constructor(
    options?: IOptionalGithubOptions,
    releaseOptions: IGithubReleaseOptions = { logger: dummyLog() }
  ) {
    this.jira = releaseOptions.jira;
    this.githubApi = releaseOptions.githubApi || 'https://api.github.com';
    this.slack = releaseOptions.slack;
    this.userLabels = releaseOptions.labels || new Map();
    this.changelogTitles = releaseOptions.changelogTitles || {};
    this.logger = releaseOptions.logger;

    if (options && options.owner && options.repo && options.token) {
      this.logger.verbose.info('Options contain repo information.');

      const args = {
        owner: options.owner,
        repo: options.repo,
        logger: this.logger,
        ...options
      };

      if (releaseOptions && this.githubApi) {
        args.baseUrl = this.githubApi;
      }

      this.logger.verbose.info('Initializing Github API with:\n', args);
      this.github = Promise.resolve(new Github(args));
    } else {
      this.logger.verbose.info('Getting repo information from package.json');

      this.github = getConfigFromPackageJson().then(async gOptions => {
        const token = await getGithubToken(this.githubApi);

        const finalOptions: IGithubReleaseOptions & IGithubOptions = {
          ...options,
          ...gOptions,
          logger: this.logger,
          token
        };

        if (releaseOptions && this.githubApi) {
          finalOptions.baseUrl = this.githubApi;
        }

        finalOptions.owner =
          options && options.owner ? options.owner : gOptions.owner;
        finalOptions.repo =
          options && options.repo ? options.repo : gOptions.repo;

        this.logger.verbose.info(
          'Initializing Github API with:\n',
          finalOptions
        );

        return new Github(finalOptions);
      });
    }
  }

  public async generateReleaseNotes(
    from: string,
    to = 'HEAD'
  ): Promise<string> {
    const client = await this.github;
    const commits = await this.getCommits(from, to);
    const project = await client.getProject();

    await Promise.all(
      commits.map(async commit => {
        commit.packages = await client.changedPackages(commit.hash);
      })
    );

    return generateReleaseNotes(commits, {
      owner: client.options.owner,
      repo: client.options.repo,
      baseUrl: project.data.html_url,
      jira: this.jira,
      logger: this.logger,
      changelogTitles: {
        ...defaultChangelogTitles,
        ...this.changelogTitles
      }
    });
  }

  public async addToChangelog(
    releaseNotes: string,
    lastRelease: string,
    currentVersion: string,
    noVersionPrefix = true,
    message = 'Update CHANGELOG.md [skip ci]'
  ) {
    this.logger.verbose.info('Adding new changes to changelog.');

    let version;

    if (lastRelease.match(/\d+\.\d+\.\d+/)) {
      version = await this.calcNextVersion(lastRelease);
    } else {
      const bump = await this.getSemverBump(lastRelease);
      version = inc(currentVersion, bump as ReleaseType);
    }

    this.logger.verbose.info('Calculated next version to be:', version);

    const date = new Date().toDateString();
    const prefixed =
      noVersionPrefix || (version && version.startsWith('v'))
        ? version
        : `v${version}`;

    let newChangelog = `# ${prefixed} (${date})\n\n${releaseNotes}`;

    if (fs.existsSync('CHANGELOG.md')) {
      this.logger.verbose.info('Old changelog exists, prepending changes.');
      const oldChangelog = await readFile('CHANGELOG.md', 'utf8');
      newChangelog = `${newChangelog}\n\n---\n\n${oldChangelog}`;
    }

    await writeFile('CHANGELOG.md', newChangelog);
    this.logger.verbose.info('Wrote new changelog to filesystem.');

    await exec('git add CHANGELOG.md');
    await exec(`git commit -m '${message}' --no-verify`);
    this.logger.verbose.info('Commited new changelog.');
  }

  public async getCommits(
    from: string,
    to = 'HEAD'
  ): Promise<IExtendedCommit[]> {
    const client = await this.github;

    this.logger.verbose.info(`Getting commits from ${from} to ${to}`);

    const gitlog = await client.getGitLog(from, to);

    this.logger.veryVerbose.info('Got gitlog:\n', gitlog);

    const commits = await this.addLabelsToCommits(gitlog);

    this.logger.veryVerbose.info('Added labels to commits:\n', commits);

    await Promise.all(
      commits.map(async commit => {
        let resolvedAuthors = [];

        if (commit.pullRequest) {
          const prCommits = await client.getCommitsForPR(
            Number(commit.pullRequest.number)
          );

          if (!prCommits) {
            return;
          }

          resolvedAuthors = await Promise.all(
            prCommits.map(async prCommit => {
              if (prCommit && prCommit.author) {
                return client.getUserByUsername(prCommit.author.login);
              }
            })
          );
        } else if (commit.authorEmail) {
          const author = await client.getUserByEmail(commit.authorEmail);
          resolvedAuthors.push(author);
        }

        commit.authors = resolvedAuthors.map(author => ({
          ...author,
          username: author ? author.login : undefined
        }));

        commit.authors.map(author => {
          this.logger.veryVerbose.info(`Found author: ${author.username}`);
        });
      })
    );

    return commits;
  }

  public async publish(releaseNotes: string, tag: string) {
    const client = await this.github;
    return client.publish(releaseNotes, tag);
  }

  public async getLabels(pr: number) {
    const client = await this.github;
    return client.getLabels(pr);
  }

  public async createStatus(prInfo: IPRInfo) {
    const client = await this.github;
    return client.createStatus(prInfo);
  }

  public async getSha() {
    const client = await this.github;
    return client.getSha();
  }

  public async getLatestRelease(): Promise<string> {
    const client = await this.github;
    return client.getLatestRelease();
  }

  public async getPullRequest(pr: number) {
    const client = await this.github;
    return client.getPullRequest(pr);
  }

  public async createComment(message: string, pr: number, context = 'default') {
    const client = await this.github;
    return client.createComment(message, pr, context);
  }

  public async getPullRequests(options?: Partial<GHub.PullsListParams>) {
    const client = await this.github;
    return client.getPullRequests(options);
  }

  public async addLabelsToProject(
    labels: Map<string, string>,
    onlyPublishWithReleaseLabel?: boolean
  ) {
    const client = await this.github;
    const oldLabels = await client.getProjectLabels();
    const labelsToCreate = [...labels.entries()].filter(
      ([versionLabel, customLabel]) => {
        if (oldLabels && oldLabels.includes(customLabel)) {
          return;
        }

        if (versionLabel === 'release' && !onlyPublishWithReleaseLabel) {
          return;
        }

        if (versionLabel === 'skip-release' && onlyPublishWithReleaseLabel) {
          return;
        }

        return true;
      }
    );

    await Promise.all(
      labelsToCreate.map(async ([versionLabel, customLabel]) => {
        await client.createLabel(versionLabel, customLabel);
      })
    );

    const repoMetadata = await client.getRepoMetadata();

    const justLabelNames = labelsToCreate.map(([name]) => name);
    this.logger.log.log(`Created labels: ${justLabelNames}`);
    this.logger.log.log(
      `\nYou can see these, and more at ${repoMetadata.html_url}/labels`
    );
  }

  public async getSemverBump(
    from: string,
    to = 'HEAD',
    onlyPublishWithReleaseLabel = false,
    skipReleaseLabels: string[] = []
  ): Promise<SEMVER> {
    const commits = await this.getCommits(from, to);
    const labels = commits.map(commit => commit.labels);
    const options = { onlyPublishWithReleaseLabel, skipReleaseLabels };
    const versionLabels = new Map([...defaultLabels, ...this.userLabels]);

    this.logger.verbose.info('Calculating SEMVER bump using:\n', {
      labels,
      versionLabels,
      options
    });

    const result = calculateSemVerBump(labels, versionLabels, options);

    this.logger.verbose.success('Calculated SEMVER bump:', result);

    return result;
  }

  public async postToSlack(releaseNotes: string, tag: string) {
    if (!this.slack) {
      throw new Error('Slack url must be set to post a message to slack.');
    }

    const client = await this.github;
    const project = await client.getProject();

    this.logger.verbose.info('Posting release notes to slack.');

    await postToSlack(releaseNotes, {
      tag,
      owner: client.options.owner,
      repo: client.options.repo,
      baseUrl: project.data.html_url,
      slackUrl: this.slack
    });

    this.logger.verbose.info('Posted release notes to slack.');
  }

  public async calcNextVersion(lastTag: string) {
    const bump = await this.getSemverBump(lastTag);
    return inc(lastTag, bump as ReleaseType);
  }

  private async addLabelsToCommits(commits: ICommit[]) {
    if (!commits) {
      return [];
    }

    const eCommits = normalizeCommits(commits);

    await Promise.all(
      eCommits.map(async commit => {
        if (!commit.pullRequest) {
          commit.labels = [];
        } else {
          commit.labels = await this.getLabels(
            parseInt(commit.pullRequest.number, 10)
          );
        }
      })
    );

    return eCommits;
  }
}
