import GHub from '@octokit/rest';
import * as fs from 'fs';
import { ICommit } from 'gitlog';
import { inc, ReleaseType } from 'semver';
import signale from 'signale';
import { promisify } from 'util';

import GitHub, { IPRInfo } from './git';
import generateReleaseNotes, {
  IExtendedCommit,
  normalizeCommits
} from './log-parse';
import SEMVER, { calculateSemVerBump, IVersionLabels } from './semver';
import exec from './utils/exec-promise';
import { dummyLog } from './utils/logger';
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

export interface IGitHubReleaseOptions {
  platform?: 'npm';
  labels?: {
    [label: string]: string;
  };
  logger: ILogger;
  jira?: string;
  slack?: string;
  githubApi?: string;
  name?: string;
  email?: string;
  skipReleaseLabels: string[];
  onlyPublishWithReleaseLabel?: boolean;
  'no-version-prefix'?: boolean;
  changelogTitles?: {
    [label: string]: string;
  };
}

export interface IOptionalGitHubOptions {
  owner?: string;
  repo?: string;
  baseUrl?: string;
  token?: string;
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export default class GitHubRelease {
  private readonly github: GitHub;
  private readonly releaseOptions: IGitHubReleaseOptions;
  private readonly userLabels: IVersionLabels;
  private readonly changelogTitles: { [label: string]: string };

  private readonly githubApi: string;

  constructor(
    options: IOptionalGitHubOptions,
    releaseOptions: IGitHubReleaseOptions = {
      logger: dummyLog(),
      skipReleaseLabels: []
    }
  ) {
    this.releaseOptions = releaseOptions;
    this.githubApi = releaseOptions.githubApi || 'https://api.github.com';
    this.changelogTitles = releaseOptions.changelogTitles || {};
    this.userLabels = new Map(Object.entries(releaseOptions.labels || {}) as [
      VersionLabel,
      string
    ][]);

    if (!options.owner || !options.repo || !options.token) {
      throw new Error('Must set owner, repo, and GitHub token.');
    }

    this.releaseOptions.logger.verbose.info(
      'Options contain repo information.'
    );

    const args = {
      owner: options.owner,
      repo: options.repo,
      logger: this.releaseOptions.logger,
      ...options
    };

    if (releaseOptions && this.githubApi) {
      args.baseUrl = this.githubApi;
    }

    // So that --verbose can be used on public CIs
    const tokenlessArgs = {
      ...args,
      token: args.token
        ? `[Token starting with ${args.token.substring(0, 4)}]`
        : undefined
    };

    this.releaseOptions.logger.verbose.info(
      'Initializing GitHub API with:\n',
      tokenlessArgs
    );
    this.github = new GitHub(args);
  }

  public async generateReleaseNotes(
    from: string,
    to = 'HEAD'
  ): Promise<string> {
    const commits = await this.getCommits(from, to);
    const project = await this.github.getProject();

    await Promise.all(
      commits.map(async commit => {
        commit.packages = await this.github.changedPackages(commit.hash);
      })
    );

    return generateReleaseNotes(commits, {
      owner: this.github.options.owner,
      repo: this.github.options.repo,
      baseUrl: project.data.html_url,
      jira: this.releaseOptions.jira,
      logger: this.releaseOptions.logger,
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
    message = 'Update CHANGELOG.md [skip ci]'
  ) {
    this.releaseOptions.logger.verbose.info('Adding new changes to changelog.');

    let version;

    if (lastRelease.match(/\d+\.\d+\.\d+/)) {
      version = await this.calcNextVersion(lastRelease);
    } else {
      const bump = await this.getSemverBump(lastRelease);
      version = inc(currentVersion, bump as ReleaseType);
    }

    this.releaseOptions.logger.verbose.info(
      'Calculated next version to be:',
      version
    );

    const date = new Date().toDateString();
    const prefixed =
      this.releaseOptions['no-version-prefix'] ||
      (version && version.startsWith('v'))
        ? version
        : `v${version}`;

    let newChangelog = `# ${prefixed} (${date})\n\n${releaseNotes}`;

    if (fs.existsSync('CHANGELOG.md')) {
      this.releaseOptions.logger.verbose.info(
        'Old changelog exists, prepending changes.'
      );
      const oldChangelog = await readFile('CHANGELOG.md', 'utf8');
      newChangelog = `${newChangelog}\n\n---\n\n${oldChangelog}`;
    }

    await writeFile('CHANGELOG.md', newChangelog);
    this.releaseOptions.logger.verbose.info(
      'Wrote new changelog to filesystem.'
    );

    await exec('git add CHANGELOG.md');
    await exec(`git commit -m '${message}' --no-verify`);
    this.releaseOptions.logger.verbose.info('Commited new changelog.');
  }

  public async getCommits(
    from: string,
    to = 'HEAD'
  ): Promise<IExtendedCommit[]> {
    this.releaseOptions.logger.verbose.info(
      `Getting commits from ${from} to ${to}`
    );

    const gitlog = await this.github.getGitLog(from, to);

    this.releaseOptions.logger.veryVerbose.info('Got gitlog:\n', gitlog);

    const commits = await this.addLabelsToCommits(gitlog);

    this.releaseOptions.logger.veryVerbose.info(
      'Added labels to commits:\n',
      commits
    );

    await Promise.all(
      commits.map(async commit => {
        let resolvedAuthors = [];

        if (commit.pullRequest) {
          const prCommits = await this.github.getCommitsForPR(
            Number(commit.pullRequest.number)
          );

          if (!prCommits) {
            return;
          }

          resolvedAuthors = await Promise.all(
            prCommits.map(async prCommit => {
              if (prCommit && prCommit.author) {
                return this.github.getUserByUsername(prCommit.author.login);
              }
            })
          );
        } else if (commit.authorEmail) {
          const author = await this.github.getUserByEmail(commit.authorEmail);
          resolvedAuthors.push(author);
        }

        commit.authors = resolvedAuthors.map(author => ({
          ...author,
          username: author ? author.login : undefined
        }));

        commit.authors.map(author => {
          this.releaseOptions.logger.veryVerbose.info(
            `Found author: ${author.username}`
          );
        });
      })
    );

    return commits;
  }

  public async publish(releaseNotes: string, tag: string) {
    return this.github.publish(releaseNotes, tag);
  }

  public async getLabels(pr: number) {
    return this.github.getLabels(pr);
  }

  public async createStatus(prInfo: IPRInfo) {
    return this.github.createStatus(prInfo);
  }

  public async getSha() {
    return this.github.getSha();
  }

  public async getLatestRelease(): Promise<string> {
    return this.github.getLatestRelease();
  }

  public async getPullRequest(pr: number) {
    return this.github.getPullRequest(pr);
  }

  public async createComment(message: string, pr: number, context = 'default') {
    return this.github.createComment(message, pr, context);
  }

  public async getPullRequests(options?: Partial<GHub.PullsListParams>) {
    return this.github.getPullRequests(options);
  }

  public async addLabelsToProject(labels: Map<string, string>) {
    const oldLabels = await this.github.getProjectLabels();
    const labelsToCreate = [...labels.entries()].filter(
      ([versionLabel, customLabel]) => {
        if (oldLabels && oldLabels.includes(customLabel)) {
          return;
        }

        if (
          versionLabel === 'release' &&
          !this.releaseOptions.onlyPublishWithReleaseLabel
        ) {
          return;
        }

        if (
          versionLabel === 'skip-release' &&
          this.releaseOptions.onlyPublishWithReleaseLabel
        ) {
          return;
        }

        return true;
      }
    );

    await Promise.all(
      labelsToCreate.map(async ([versionLabel, customLabel]) => {
        await this.github.createLabel(versionLabel, customLabel);
      })
    );

    const repoMetadata = await this.github.getRepoMetadata();

    const justLabelNames = labelsToCreate.map(([name]) => name);
    if (justLabelNames.length > 0) {
      this.releaseOptions.logger.log.log(
        `Created labels: ${justLabelNames.join(', ')}`
      );
    } else {
      this.releaseOptions.logger.log.log(
        'No labels were created, they must have already been present on your project.'
      );
    }
    this.releaseOptions.logger.log.log(
      `\nYou can see these, and more at ${repoMetadata.html_url}/labels`
    );
  }

  public async getSemverBump(from: string, to = 'HEAD'): Promise<SEMVER> {
    const commits = await this.getCommits(from, to);
    const labels = commits.map(commit => commit.labels);
    const {
      onlyPublishWithReleaseLabel,
      skipReleaseLabels
    } = this.releaseOptions;
    const options = { onlyPublishWithReleaseLabel, skipReleaseLabels };
    const versionLabels = new Map([...defaultLabels, ...this.userLabels]);

    this.releaseOptions.logger.verbose.info(
      'Calculating SEMVER bump using:\n',
      {
        labels,
        versionLabels,
        options
      }
    );

    const result = calculateSemVerBump(labels, versionLabels, options);

    this.releaseOptions.logger.verbose.success(
      'Calculated SEMVER bump:',
      result
    );

    return result;
  }

  public async postToSlack(releaseNotes: string, tag: string) {
    if (!this.releaseOptions.slack) {
      throw new Error('Slack url must be set to post a message to slack.');
    }

    const project = await this.github.getProject();

    this.releaseOptions.logger.verbose.info('Posting release notes to slack.');

    await postToSlack(releaseNotes, {
      tag,
      owner: this.github.options.owner,
      repo: this.github.options.repo,
      baseUrl: project.data.html_url,
      slackUrl: this.releaseOptions.slack
    });

    this.releaseOptions.logger.verbose.info('Posted release notes to slack.');
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
