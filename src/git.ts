import GHub from '@octokit/rest';
import gitlogNode, { ICommit } from 'gitlog';
import { promisify } from 'util';

import { Memoize } from 'typescript-memoize';

import { defaultLabelsDescriptions } from './github-release';
import execPromise from './utils/exec-promise';
import { dummyLog, ILogger } from './utils/logger';
import settingsUrl from './utils/settings-url';

const gitlog = promisify(gitlogNode);

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>;

export type IPRInfo = Omit<GHub.ReposCreateStatusParams, 'owner' | 'repo'>;

export interface IGitHubOptions {
  owner: string;
  repo: string;
  baseUrl?: string;
  token?: string;
}

export function getRandomColor() {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
}

class GitHubAPIError extends Error {
  constructor(api: string, args: object, origError: Error) {
    super(
      `Error calling github: ${api}\n\twith: ${JSON.stringify(args)}.\n\t${
        origError.message
      }`
    );
  }
}

const makeCommentIdentifier = (context: string) =>
  `<!-- GITHUB_RELEASE COMMENT: ${context} -->`;

export default class GitHub {
  public readonly ghub: GHub;
  public readonly baseUrl: string;
  public readonly options: IGitHubOptions;
  private readonly logger: ILogger;

  constructor(options: IGitHubOptions, logger: ILogger = dummyLog()) {
    this.logger = logger;
    this.options = options;
    this.baseUrl = this.options.baseUrl || 'https://api.github.com';

    this.logger.veryVerbose.info(`Initializing GitHub with: ${this.baseUrl}`);
    this.ghub = new GHub({
      baseUrl: this.baseUrl,
      headers: {
        accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
  }

  @Memoize()
  public async authenticate(authToken?: string): Promise<void> {
    if (authToken === undefined && this.options.token === undefined) {
      throw new Error(
        `Authentication needs a GitHub token. Try setting up an access token ${settingsUrl(
          this.baseUrl
        )}`
      );
    }

    const token = authToken || this.options.token;

    this.logger.veryVerbose.info('Authenticating with GitHub.');

    this.ghub.authenticate({
      type: 'token',
      token: token!
    });

    this.logger.veryVerbose.info('Successfully authenticated with GitHub.');

    return Promise.resolve();
  }

  public async getLatestRelease(): Promise<string> {
    await this.authenticate();

    const args = {
      owner: this.options.owner,
      repo: this.options.repo
    };

    try {
      this.logger.verbose.info('Getting latest release using:\n', args);

      const latestRelease = await this.ghub.repos.getLatestRelease(args);

      this.logger.veryVerbose.info(
        'Got response for "getLatestRelease":\n',
        latestRelease
      );
      this.logger.verbose.info('Got latest release:\n', latestRelease.data);

      return latestRelease.data.tag_name;
    } catch (e) {
      if (e.status === 404) {
        this.logger.verbose.info(
          "Couldn't find latest release on GitHub, using first commit."
        );
        return this.getFirstCommit();
      }

      throw e;
    }
  }

  public async getFirstCommit(): Promise<string> {
    const list = await execPromise('git', ['rev-list', 'HEAD']);
    return list.split('\n').pop() as string;
  }

  public async getSha(): Promise<string> {
    const result = await execPromise('git', ['rev-parse', 'HEAD']);

    this.logger.verbose.info(`Got commit SHA from HEAD: ${result}`);

    return result;
  }

  public async getLabels(prNumber: number) {
    this.logger.verbose.info(`Getting labels for PR: ${prNumber}`);

    await this.authenticate();

    const args = {
      owner: this.options.owner,
      repo: this.options.repo,
      number: prNumber
    };

    this.logger.verbose.info('Getting issue labels using:', args);

    try {
      const labels = await this.ghub.issues.listLabelsOnIssue(args);
      this.logger.veryVerbose.info(
        'Got response for "listLabelsOnIssue":\n',
        labels
      );
      this.logger.verbose.info('Found labels on PR:\n', labels.data);

      return labels.data.map(l => l.name);
    } catch (e) {
      throw new GitHubAPIError('listLabelsOnIssue', args, e);
    }
  }

  public async getProjectLabels() {
    this.logger.verbose.info(
      `Getting labels for project: ${this.options.repo}`
    );

    await this.authenticate();

    const args = {
      owner: this.options.owner,
      repo: this.options.repo
    };

    try {
      const labels = await this.ghub.issues.listLabelsForRepo(args);
      this.logger.veryVerbose.info(
        'Got response for "getProjectLabels":\n',
        labels
      );
      this.logger.verbose.info('Found labels on project:\n', labels.data);

      return labels.data.map(l => l.name);
    } catch (e) {
      throw new GitHubAPIError('getProjectLabels', args, e);
    }
  }

  public async getGitLog(start: string, end = 'HEAD'): Promise<ICommit[]> {
    const log = await gitlog({
      repo: process.cwd(),
      number: Number.MAX_SAFE_INTEGER,
      fields: ['hash', 'authorName', 'authorEmail', 'rawBody'],
      branch: `${start.trim()}..${end.trim()}`
    });

    return log.map(commit => ({
      hash: commit.hash,
      authorName: commit.authorName,
      authorEmail: commit.authorEmail,
      subject: commit.rawBody!
    }));
  }

  @Memoize()
  public async getUserByEmail(email: string) {
    await this.authenticate();

    const search = (await this.ghub.search.users({
      q: `in:email ${email}`
    })).data;

    return search && search.items.length > 0
      ? search.items[0]
      : { login: email };
  }

  @Memoize()
  public async getUserByUsername(username: string) {
    await this.authenticate();

    return (await this.ghub.users.getByUsername({
      username
    })).data;
  }

  public async getPullRequest(pr: number) {
    this.logger.verbose.info(`Getting Pull Request: ${pr}`);

    await this.authenticate();

    const args = {
      owner: this.options.owner,
      repo: this.options.repo,
      number: pr
    };

    this.logger.verbose.info('Getting pull request info using:', args);

    const result = await this.ghub.pulls.get(args);

    this.logger.veryVerbose.info('Got pull request data\n', result);
    this.logger.verbose.info('Got pull request info');

    return result;
  }

  public async createStatus(prInfo: IPRInfo) {
    await this.authenticate();

    const args = {
      ...prInfo,
      owner: this.options.owner,
      repo: this.options.repo
    };

    this.logger.verbose.info('Creating status using:\n', args);

    const result = await this.ghub.repos.createStatus(args);

    this.logger.veryVerbose.info('Got response from createStatues\n', result);
    this.logger.verbose.info('Created status on GitHub.');

    return result;
  }

  public async createLabel(label: string, name: string) {
    await this.authenticate();

    this.logger.verbose.info(`Creating "${label}" label :\n${name}`);

    const result = await this.ghub.issues.createLabel({
      name,
      owner: this.options.owner,
      repo: this.options.repo,
      color: getRandomColor(),
      description: defaultLabelsDescriptions.get(label)
    });

    this.logger.veryVerbose.info('Got response from createLabel\n', result);
    this.logger.verbose.info('Created label on GitHub.');

    return result;
  }

  public async getProject() {
    this.logger.verbose.info('Getting project from GitHub');

    await this.authenticate();

    const result = (await this.ghub.repos.get({
      owner: this.options.owner,
      repo: this.options.repo
    })).data;

    this.logger.veryVerbose.info('Got response from repos\n', result);
    this.logger.verbose.info('Got project information.');

    return result;
  }

  public async getPullRequests(options?: Partial<GHub.PullsListParams>) {
    this.logger.verbose.info('Getting pull requests...');

    await this.authenticate();

    const result = (await this.ghub.pulls.list({
      owner: this.options.owner.toLowerCase(),
      repo: this.options.repo.toLowerCase(),
      ...options
    })).data;

    this.logger.veryVerbose.info('Got response from pull requests', result);
    this.logger.verbose.info('Got pull request');

    return result;
  }

  public async getCommitsForPR(pr: number) {
    this.logger.verbose.info(`Getting commits for PR #${pr}`);

    await this.authenticate();

    const result = (await this.ghub.pulls.listCommits({
      owner: this.options.owner.toLowerCase(),
      repo: this.options.repo.toLowerCase(),
      number: pr
    })).data;

    this.logger.veryVerbose.info(`Got response from PR #${pr}\n`, result);
    this.logger.verbose.info(`Got commits for PR #${pr}.`);

    return result;
  }

  public async createComment(message: string, pr: number, context: string) {
    const commentIdentifier = makeCommentIdentifier(context);

    this.logger.verbose.info('Using comment identifier:', commentIdentifier);

    await this.authenticate();

    this.logger.verbose.info('Getting previous comments on:', pr);

    const comments = await this.ghub.issues.listComments({
      owner: this.options.owner,
      repo: this.options.repo,
      number: pr
    });

    this.logger.veryVerbose.info('Got PR comments\n', comments);

    const oldMessage = comments.data.find(comment =>
      comment.body.includes(commentIdentifier)
    );

    if (oldMessage) {
      this.logger.verbose.info('Found previous message from same scope.');
      this.logger.verbose.info('Deleting previous comment');

      await this.ghub.issues.deleteComment({
        owner: this.options.owner,
        repo: this.options.repo,
        comment_id: oldMessage.id
      });

      this.logger.verbose.info('Successfully deleted previous comment');
    }

    this.logger.verbose.info('Creating new comment');

    const result = await this.ghub.issues.createComment({
      owner: this.options.owner,
      repo: this.options.repo,
      number: pr,
      body: `${commentIdentifier}\n${message}`
    });

    this.logger.veryVerbose.info(
      'Got response from creating comment\n',
      result
    );
    this.logger.verbose.info('Successfully posted comment to PR');

    return result;
  }

  public async publish(releaseNotes: string, tag: string) {
    this.logger.verbose.info('Creating release on GitHub for tag:', tag);

    await this.authenticate();

    const result = await this.ghub.repos.createRelease({
      owner: this.options.owner,
      repo: this.options.repo,
      tag_name: tag,
      body: releaseNotes
    });

    this.logger.veryVerbose.info('Got response from createRelease\n', result);
    this.logger.verbose.info('Created GitHub release.');

    return result;
  }
}
