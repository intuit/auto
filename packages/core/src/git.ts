import { enterpriseCompatibility } from "@octokit/plugin-enterprise-compatibility";
import path from "path";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { gitlogPromise as gitlog } from "gitlog";
import { HttpsProxyAgent } from "https-proxy-agent";
import tinyColor from "tinycolor2";
import endent from "endent";
import on from "await-to-js";
import join from "url-join";
import { gt, lt } from "semver";
import prettyMs from "pretty-ms";

import { Memoize as memoize } from "typescript-memoize";

import { ILabelDefinition } from "./semver";
import verifyAuth from "./utils/verify-auth";
import execPromise from "./utils/exec-promise";
import { dummyLog, ILogger } from "./utils/logger";
import { ICommit } from "./log-parse";
import { buildSearchQuery, ISearchQuery } from "./match-sha-to-pr";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>;

export type IPRInfo = Omit<
  RestEndpointMethodTypes["repos"]["createCommitStatus"]["parameters"],
  "owner" | "repo"
>;

export interface IGitOptions {
  /** Github repo owner (user) */
  owner: string;
  /** GitHub project to operate on */
  repo: string;
  /** The URL to the GitHub (public or enterprise) the project is using */
  baseUrl?: string;
  /** The main branch of the repo */
  baseBranch: string;
  /** The URL to the GitHub graphql API (public or enterprise) the project is using */
  graphqlBaseUrl?: string;
  /** A token to auth to GitHub with */
  token?: string;
  /** An optional proxy agent to route requests through */
  agent?: HttpsProxyAgent;
}

/** An error originating from the GitHub */
class GitAPIError extends Error {
  /** Extend the base error */
  constructor(
    api: string,
    args: Record<string, unknown> | unknown[],
    origError: Error
  ) {
    super(
      `Error calling github: ${api}\n\twith: ${JSON.stringify(args)}.\n\t${
        origError.message
      }`
    );
  }
}

const taggedPackageRegex = /(\S+)@(\S+)/;

/**
 * Extract a version from a tag.
 *
 * Supports tags like:
 *
 * - 1.2.3
 * - 1.2.3-beta.0
 * - package@1.2.3-beta.0
 * - @scope/package@1.2.3-beta.0
 */
function getVersionFromTag(tag: string) {
  if (taggedPackageRegex.test(tag)) {
    const [, , version] = tag.match(taggedPackageRegex)!;
    return version;
  }

  return tag;
}

export const automatedCommentIdentifier = "<!-- GITHUB_RELEASE";

/** Make a comment to build automation in PRs off of. */
const makeIdentifier = (type: string, context: string) =>
  `${automatedCommentIdentifier} ${type}: ${context} -->`;

/** Make an identifier for `auto comment` */
const makeCommentIdentifier = (context: string) =>
  makeIdentifier("COMMENT", context);

/** Make an identifier for `auto pr-body` */
const makePrBodyIdentifier = (context: string) =>
  makeIdentifier("PR BODY", context);

interface ThrottleOpts {
  /** The request object */
  request: { /** What retry we are on */ retryCount: number };
  /** API method that was throttled */
  method: string;
  /** URL that was throttled */
  url: string;
}

/**
 * A class to interact with the local git instance and the git remote.
 * currently it only interfaces with GitHub.
 */
export default class Git {
  /** An octokit instance to use to interact with GitHub */
  readonly github: Octokit;
  /** Options the git client was initialized with */
  readonly options: IGitOptions;

  /** The GitHub api to communicate with through octokit */
  private readonly baseUrl: string;
  /** The GitHub graphql api to communicate with through octokit */
  private readonly graphqlBaseUrl: string;
  /** A logger that uses log levels */
  private readonly logger: ILogger;

  /** Initialize the git interface and auth with GitHub */
  constructor(options: IGitOptions, logger: ILogger = dummyLog()) {
    this.logger = logger;
    this.options = options;
    this.baseUrl = this.options.baseUrl || "https://api.github.com";
    this.graphqlBaseUrl = this.options.baseUrl
      ? this.options.graphqlBaseUrl || join(new URL(this.baseUrl).origin, "api")
      : this.baseUrl;
    this.logger.veryVerbose.info(`Initializing GitHub with: ${this.baseUrl}`);
    const GitHub = Octokit.plugin(enterpriseCompatibility, retry, throttling);
    this.github = new GitHub({
      baseUrl: this.baseUrl,
      auth: this.options.token,
      previews: ["symmetra-preview"],
      request: { agent: this.options.agent },
      throttle: {
        /** Add a wait once rate limit is hit */
        onRateLimit: (retryAfter: number, opts: ThrottleOpts) => {
          this.logger.log.warn(
            `Request quota exhausted for request ${opts.method} ${opts.url}`
          );

          if (opts.request.retryCount < 5) {
            this.logger.log.log(
              `Retrying after ${prettyMs(retryAfter * 1000)}!`
            );
            return true;
          }
        },
        /** wait after abuse */
        onAbuseLimit: (retryAfter: number, opts: ThrottleOpts) => {
          this.logger.log.error(
            `Went over abuse rate limit ${opts.method} ${
              opts.url
            }, retrying in ${prettyMs(retryAfter * 1000)}.`
          );
          return true;
        },
      },
    });
    this.github.hook.error("request", (error) => {
      if (error) {
        // narrow down the type
        if ("headers" in error && error.request.headers.authorization) {
          delete error.request.headers.authorization;
        }
      }

      throw error;
    });
  }

  /** Verify the write access authorization to remote repository with push dry-run. */
  async verifyAuth(url: string) {
    return verifyAuth(url, this.options.baseBranch);
  }

  /** Get the "Latest Release" from GitHub */
  @memoize()
  async getLatestReleaseInfo() {
    const latestRelease = await this.github.repos.getLatestRelease({
      owner: this.options.owner,
      repo: this.options.repo,
    });

    return latestRelease.data;
  }

  /** Get the "Latest Release" or the first commit SHA as a fallback */
  @memoize()
  async getLatestRelease(): Promise<string> {
    try {
      const latestRelease = await this.getLatestReleaseInfo();

      this.logger.veryVerbose.info(
        'Got response for "getLatestRelease":\n',
        latestRelease
      );
      this.logger.verbose.info("Got latest release:\n", latestRelease);

      return latestRelease.tag_name;
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

  /** Get the date a commit sha was created */
  async getCommitDate(sha: string): Promise<string> {
    const date = await execPromise("git", ["show", "-s", "--format=%ci", sha]);
    const [day, time, timezone] = date.split(" ");

    return `${day}T${time}${timezone}`;
  }

  /** Get the first commit for the repo */
  async getFirstCommit(): Promise<string> {
    const list = await execPromise("git", [
      "rev-list",
      "--max-parents=0",
      "HEAD",
    ]);
    return list.split("\n").pop() as string;
  }

  /** Get the SHA of the latest commit */
  async getSha(short?: boolean): Promise<string> {
    const result = await execPromise("git", [
      "rev-parse",
      short && "--short",
      "HEAD",
    ]);

    this.logger.verbose.info(`Got commit SHA from HEAD: ${result}`);

    return result;
  }

  /** Get the SHA of the latest commit */
  async shaExists(sha?: string): Promise<boolean> {
    try {
      await execPromise("git", ["rev-parse", "--verify", sha]);
      return true;
    } catch (error) {
      return false;
    }
  }

  /** Get the labels for a PR */
  async getLabels(prNumber: number): Promise<string[]> {
    this.logger.verbose.info(`Getting labels for PR: ${prNumber}`);

    const args: RestEndpointMethodTypes["issues"]["listLabelsOnIssue"]["parameters"] = {
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: prNumber,
    };

    this.logger.verbose.info("Getting issue labels using:", args);

    try {
      const labels = await this.github.issues.listLabelsOnIssue(args);
      this.logger.veryVerbose.info(
        'Got response for "listLabelsOnIssue":\n',
        labels
      );
      this.logger.verbose.info("Found labels on PR:\n", labels.data);

      return labels.data.map((l) => l.name);
    } catch (e) {
      throw new GitAPIError("listLabelsOnIssue", args, e);
    }
  }

  /** Get all the information about a PR or issue */
  @memoize()
  async getPr(prNumber: number) {
    this.logger.verbose.info(`Getting info for PR: ${prNumber}`);

    const args: RestEndpointMethodTypes["issues"]["get"]["parameters"] = {
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: prNumber,
    };

    this.logger.verbose.info("Getting issue info using:", args);

    try {
      const info = await this.github.issues.get(args);
      this.logger.veryVerbose.info('Got response for "issues.get":\n', info);
      return info;
    } catch (e) {
      throw new GitAPIError("getPr", args, e);
    }
  }

  /** Get information about specific commit */
  @memoize()
  async getCommit(sha: string) {
    this.logger.verbose.info(`Getting info for commit: ${sha}`);

    try {
      const info = await this.github.repos.getCommit({
        owner: this.options.owner,
        repo: this.options.repo,
        ref: sha,
      });
      this.logger.veryVerbose.info(
        'Got response for "repos.getCommit":\n',
        info
      );
      return info;
    } catch (e) {
      throw new GitAPIError("getCommit", [], e);
    }
  }

  /** Get the labels for a the project */
  async getProjectLabels() {
    this.logger.verbose.info(
      `Getting labels for project: ${this.options.repo}`
    );

    const args = {
      owner: this.options.owner,
      repo: this.options.repo,
    };

    try {
      const labels = await this.github.paginate(
        this.github.issues.listLabelsForRepo,
        args
      );

      this.logger.veryVerbose.info(
        'Got response for "getProjectLabels":\n',
        labels
      );
      this.logger.verbose.info("Found labels on project:\n", labels);

      return labels.map((l) => l.name);
    } catch (e) {
      throw new GitAPIError("getProjectLabels", args, e);
    }
  }

  /** Get the git log for a range of commits */
  @memoize()
  async getGitLog(start: string, end = "HEAD"): Promise<ICommit[]> {
    try {
      const first = await this.getFirstCommit();
      // This "shaExists" is just so we don't have to refactor all the tests
      // in auto.test.ts. If the SHA doesn't really exist then the call to
      // gitlog will fail too.
      const startSha = (await this.shaExists(start))
        ? await execPromise("git", ["rev-parse", start])
        : "";

      const log = await gitlog({
        repo: process.cwd(),
        number: Number.MAX_SAFE_INTEGER,
        fields: ["hash", "authorName", "authorEmail", "rawBody"],
        // If start === firstCommit then we want to include that commit in the changelog
        // Otherwise it was that last release and should not be included in the release.
        branch: first === startSha ? end : `${start.trim()}..${end.trim()}`,
        execOptions: { maxBuffer: Infinity },
        includeMergeCommitFiles: true,
      });

      return log
        .map((commit) => ({
          hash: commit.hash,
          authorName: commit.authorName,
          authorEmail: commit.authorEmail,
          subject: commit.rawBody!,
          files: (commit.files || []).map((file) => path.resolve(file)),
        }))
        .reduce<ICommit[]>((all, commit) => {
          // The -m option will list a commit for each merge parent. This
          // means two items will have the same hash. We are using -m to get all the changed files
          // in a merge commit. The following code combines these repeated hashes into
          // one commit
          const current = all.find((c) => c.hash === commit.hash);

          if (current) {
            current.files = [...current.files, ...commit.files];
          } else {
            all.push(commit);
          }

          return all;
        }, []);
    } catch (error) {
      console.log(error);
      const tag = error.match(/ambiguous argument '(\S+)\.\.\S+'/);

      if (tag) {
        this.logger.log.error(
          endent`
            Missing tag "${tag[1]}" so the command could not run.

            To fix this run the following command:

            git fetch --tags\n
          `
        );
        process.exit(1);
      }

      throw new Error(error);
    }
  }

  /** Get the GitHub user for an email. Will not work if they do not have their email set to "public". */
  @memoize()
  async getUserByEmail(email: string) {
    try {
      const search = (
        await this.github.search.users({
          q: `in:email ${email}`,
        })
      ).data;

      return search?.items.length > 0 ? search.items[0] : {};
    } catch (error) {
      this.logger.verbose.warn(`Could not find user by email: ${email}`);
    }
  }

  /** Get the users associated with the GH_TOKEN */
  @memoize()
  async getUser() {
    const [, user] = (await on(this.github.users.getAuthenticated())) || {};
    return user?.data;
  }

  /** Get collaborator permission level to the repo. */
  @memoize()
  async getTokenPermissionLevel() {
    const user = await this.getUser();

    if (!user) {
      return {
        permission: "none",
      };
    }

    try {
      const { permission } = (
        await this.github.repos.getCollaboratorPermissionLevel({
          owner: this.options.owner,
          repo: this.options.repo,
          username: user.login,
        })
      ).data;

      return { permission, user };
    } catch (error) {
      this.logger.verbose.error(`Could not get permissions for token`);
      return { permission: "read", user };
    }
  }

  /** Get the GitHub user for a username */
  @memoize()
  async getUserByUsername(username: string) {
    try {
      const user = await this.github.users.getByUsername({
        username,
      });

      if (user.status !== 200) {
        return;
      }

      return user.data;
    } catch (error) {
      this.logger.verbose.warn(`Could not find user by username: ${username}`);
    }
  }

  /** Get all the information about a PR or issue */
  @memoize()
  async getPullRequest(pr: number) {
    this.logger.verbose.info(`Getting Pull Request: ${pr}`);

    const args: RestEndpointMethodTypes["pulls"]["get"]["parameters"] = {
      owner: this.options.owner,
      repo: this.options.repo,
      pull_number: pr,
    };

    this.logger.verbose.info("Getting pull request info using:", args);

    const result = await this.github.pulls.get(args);

    this.logger.veryVerbose.info("Got pull request data\n", result);
    this.logger.verbose.info("Got pull request info");

    return result;
  }

  /** Search to GitHub project's issue and pull requests */
  @memoize()
  async searchRepo(
    options: RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["parameters"]
  ) {
    const repo = `repo:${this.options.owner}/${this.options.repo}`;
    options.q = `${repo} ${options.q}`;

    this.logger.verbose.info("Searching repo using:\n", options);

    const result = await this.github.search.issuesAndPullRequests(options);

    this.logger.veryVerbose.info("Got response from search\n", result);
    this.logger.verbose.info("Searched repo on GitHub.");

    return result.data;
  }

  /** Run a graphql query on the GitHub project */
  @memoize()
  async graphql<T>(query: string) {
    this.logger.verbose.info("Querying Github using GraphQL:\n", query);

    const data = await this.github.graphql<T>(query, {
      baseUrl: this.graphqlBaseUrl,
      request: { agent: this.options.agent },
      headers: {
        authorization: `token ${this.options.token}`,
      },
    });

    this.logger.veryVerbose.info("Got response from query\n", data);
    return data;
  }

  /** Create a status (or checkmark) on a commit */
  async createStatus(prInfo: IPRInfo) {
    const args = {
      ...prInfo,
      owner: this.options.owner,
      repo: this.options.repo,
    };

    this.logger.verbose.info("Creating status using:\n", args);

    const result = await this.github.repos.createCommitStatus(
      args as RestEndpointMethodTypes["repos"]["createCommitStatus"]["parameters"]
    );

    this.logger.veryVerbose.info("Got response from createStatues\n", result);
    this.logger.verbose.info("Created status on GitHub.");

    return result;
  }

  /** Add a label to the project */
  async createLabel(label: ILabelDefinition) {
    this.logger.verbose.info(
      `Creating "${label.releaseType || "general"}" label :\n${label.name}`
    );

    const color = label.color
      ? tinyColor(label.color).toString("hex6")
      : tinyColor.random().toString("hex6");
    const result = await this.github.issues.createLabel({
      name: label.name,
      owner: this.options.owner,
      repo: this.options.repo,
      color: color.replace("#", ""),
      description: label.description,
    });

    this.logger.veryVerbose.info("Got response from createLabel\n", result);
    this.logger.verbose.info("Created label on GitHub.");

    return result;
  }

  /** Update a label on the project */
  async updateLabel(label: ILabelDefinition) {
    this.logger.verbose.info(
      `Updating "${label.releaseType || "generic"}" label :\n${label.name}`
    );

    const color = label.color
      ? tinyColor(label.color).toString("hex6")
      : tinyColor.random().toString("hex6");
    const result = await this.github.issues.updateLabel({
      current_name: label.name,
      name: label.name,
      owner: this.options.owner,
      repo: this.options.repo,
      color: color.replace("#", ""),
      description: label.description,
    });

    this.logger.veryVerbose.info("Got response from updateLabel\n", result);
    this.logger.verbose.info("Updated label on GitHub.");

    return result;
  }

  /** Add a label to and issue or pull request */
  async addLabelToPr(pr: number, label: string) {
    this.logger.verbose.info(`Creating "${label}" label to PR ${pr}`);

    const result = await this.github.issues.addLabels({
      issue_number: pr,
      owner: this.options.owner,
      repo: this.options.repo,
      labels: [label],
    });

    this.logger.veryVerbose.info("Got response from addLabels\n", result);
    this.logger.verbose.info("Added labels on Pull Request.");

    return result;
  }

  /** Add a label to and issue or pull request */
  async removeLabel(pr: number, label: string) {
    this.logger.verbose.info(`Removing "${label}" from #${pr}`);

    const result = await this.github.issues.removeLabel({
      issue_number: pr,
      owner: this.options.owner,
      repo: this.options.repo,
      name: label,
    });

    this.logger.veryVerbose.info("Got response from removeLabel\n", result);
    this.logger.verbose.info("Removed label on Pull Request.");

    return result;
  }

  /** Lock an issue */
  async lockIssue(issue: number) {
    this.logger.verbose.info(`Locking #${issue} issue...`);

    const result = await this.github.issues.lock({
      issue_number: issue,
      owner: this.options.owner,
      repo: this.options.repo,
    });

    this.logger.veryVerbose.info("Got response from lock\n", result);
    this.logger.verbose.info("Locked issue.");

    return result;
  }

  /** Get information about the GitHub project */
  @memoize()
  async getProject() {
    this.logger.verbose.info("Getting project from GitHub");

    const result = (
      await this.github.repos.get({
        owner: this.options.owner,
        repo: this.options.repo,
      })
    ).data;

    this.logger.veryVerbose.info("Got response from repos\n", result);
    this.logger.verbose.info("Got project information.");

    return result;
  }

  /** Get all the pull requests for a project */
  async getPullRequests(
    options?: Partial<RestEndpointMethodTypes["pulls"]["list"]["parameters"]>
  ) {
    this.logger.verbose.info("Getting pull requests...");

    const result = (
      await this.github.pulls.list({
        owner: this.options.owner.toLowerCase(),
        repo: this.options.repo.toLowerCase(),
        ...options,
      })
    ).data;

    this.logger.veryVerbose.info("Got response from pull requests", result);
    this.logger.verbose.info("Got pull request");

    return result;
  }

  /** Get all the commits for a PR */
  @memoize()
  async getCommitsForPR(pr: number) {
    this.logger.verbose.info(`Getting commits for PR #${pr}`);

    const result = await this.github.paginate(this.github.pulls.listCommits, {
      owner: this.options.owner.toLowerCase(),
      repo: this.options.repo.toLowerCase(),
      pull_number: pr,
    });

    this.logger.veryVerbose.info(`Got response from PR #${pr}\n`, result);
    this.logger.verbose.info(`Got commits for PR #${pr}`);

    return result;
  }

  /** Find a comment that is using the context in a PR */
  async getCommentId(pr: number, context = "default") {
    const commentIdentifier = makeCommentIdentifier(context);

    this.logger.verbose.info("Getting previous comments on:", pr);

    const comments = await this.github.issues.listComments({
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: pr,
    });

    this.logger.veryVerbose.info("Got PR comments\n", comments);

    const oldMessage = comments.data.find((comment) =>
      comment.body?.includes(commentIdentifier)
    );

    if (!oldMessage) {
      return -1;
    }

    this.logger.verbose.info("Found previous message from same scope.");
    return oldMessage.id;
  }

  /** Delete a comment on an issue or pull request */
  async deleteComment(pr: number, context = "default") {
    const commentId = await this.getCommentId(pr, context);

    if (commentId === -1) {
      return;
    }

    this.logger.verbose.info(`Deleting comment: ${commentId}`);
    await this.github.issues.deleteComment({
      owner: this.options.owner,
      repo: this.options.repo,
      comment_id: commentId,
    });
    this.logger.verbose.info(`Successfully deleted comment: ${commentId}`);
  }

  /** Create a comment on an issue or pull request */
  async createComment(message: string, pr: number, context = "default") {
    const commentIdentifier = makeCommentIdentifier(context);

    this.logger.verbose.info("Using comment identifier:", commentIdentifier);
    await this.deleteComment(pr, context);
    this.logger.verbose.info("Creating new comment");
    const result = await this.github.issues.createComment({
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: pr,
      body: `${commentIdentifier}\n${message}`,
    });

    this.logger.veryVerbose.info(
      "Got response from creating comment\n",
      result
    );
    this.logger.verbose.info("Successfully posted comment to PR");

    return result;
  }

  /** Edit a comment on an issue or pull request */
  async editComment(message: string, pr: number, context = "default") {
    const commentIdentifier = makeCommentIdentifier(context);

    this.logger.verbose.info("Using comment identifier:", commentIdentifier);
    const commentId = await this.getCommentId(pr, context);
    if (commentId === -1) {
      return this.createComment(message, pr, context);
    }

    this.logger.verbose.info("Editing comment");
    const result = await this.github.issues.updateComment({
      owner: this.options.owner,
      repo: this.options.repo,
      comment_id: commentId,
      body: `${commentIdentifier}\n${message}`,
    });

    this.logger.veryVerbose.info("Got response from editing comment\n", result);
    this.logger.verbose.info("Successfully edited comment on PR");

    return result;
  }

  /** Create a comment on a pull request body */
  async addToPrBody(message: string, pr: number, context = "default") {
    const id = makePrBodyIdentifier(context);

    this.logger.verbose.info("Using PR body identifier:", id);
    this.logger.verbose.info("Getting previous pr body on:", pr);

    const issue = await this.github.issues.get({
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: pr,
    });

    this.logger.veryVerbose.info("Got PR description\n", issue.data.body);
    const regex = new RegExp(`(${id})\\s*([\\S\\s]*)\\s*(${id})`);
    let body = issue.data.body;

    if (!body) {
      body = message ? `\n${id}\n${message}\n${id}\n` : "";
    } else if (body.match(regex)) {
      this.logger.verbose.info("Found previous message from same scope.");
      this.logger.verbose.info("Replacing pr body comment");
      body = body.replace(regex, message ? `$1\n${message}\n$3` : "");
    } else {
      body += message ? `\n${id}\n${message}\n${id}\n` : "";
    }

    this.logger.verbose.info("Creating new pr body");

    const result = await this.github.issues.update({
      owner: this.options.owner,
      repo: this.options.repo,
      issue_number: pr,
      body,
    });

    this.logger.veryVerbose.info("Got response from updating body\n", result);
    this.logger.verbose.info(`Successfully updated body of PR #${pr}`);

    return result;
  }

  /** Create a release for the GitHub project */
  async publish(
    releaseNotes: string,
    tag: string,
    prerelease = false,
    fallbackCommit?: string
  ) {
    this.logger.verbose.info("Creating release on GitHub for tag:", tag);

    const result = await this.github.repos.createRelease({
      owner: this.options.owner,
      repo: this.options.repo,
      tag_name: tag,
      target_commitish: fallbackCommit,
      name: tag,
      body: releaseNotes,
      prerelease,
    });

    this.logger.veryVerbose.info("Got response from createRelease\n", result);
    this.logger.verbose.info("Created GitHub release.");

    return result;
  }

  /** Get the latest tag in the git tree */
  async getLatestTagInBranch(since?: string) {
    return execPromise("git", ["describe", "--tags", "--abbrev=0", since]);
  }

  /** Get the tag before latest in the git tree */
  async getPreviousTagInBranch() {
    const latest = await this.getLatestTagInBranch();
    return this.getLatestTagInBranch(`${latest}^1`);
  }

  /** Get all the tags for a given branch. */
  async getTags(branch: string) {
    try {
      const tags = await execPromise("git", [
        "tag",
        "--sort='creatordate'",
        "--merged",
        branch,
      ]);

      return tags
        .split("\n")
        .map((tag) => tag.trim())
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  /** Get the a tag that isn't in the base branch */
  async getTagNotInBaseBranch(
    branch: string,
    options: {
      /** Return the first tag not in baseBrach, defaults to last tag. */
      first?: boolean;
    } = {}
  ) {
    const baseBranch = (await this.shaExists(
      `origin/${this.options.baseBranch}`
    ))
      ? `origin/${this.options.baseBranch}`
      : this.options.baseBranch;
    const baseTags = (await this.getTags(baseBranch)).reverse();
    let branchTags = (await this.getTags(`heads/${branch}`)).reverse();
    const branchTagsWithPrereleaseSuffix = branchTags.filter(
      (tag) => tag.indexOf(`-${branch.toLowerCase()}`) >= 0
    );

    if (branchTagsWithPrereleaseSuffix.length) {
      branchTags = branchTagsWithPrereleaseSuffix;
    }

    const comparator = options.first ? lt : gt;
    let firstGreatestUnique: string | undefined;

    branchTags.forEach((tag) => {
      const tagVersion = getVersionFromTag(tag);
      const greatestVersion = firstGreatestUnique
        ? getVersionFromTag(firstGreatestUnique)
        : undefined;

      if (
        !baseTags.includes(tag) &&
        (!greatestVersion || comparator(tagVersion, greatestVersion))
      ) {
        firstGreatestUnique = tag;
      }
    });

    this.logger.verbose.info("Tags found in base branch:", baseTags);
    this.logger.verbose.info("Tags found in branch:", branchTags);
    this.logger.verbose.info(
      `${options.first ? "First" : "Latest"} tag in branch:`,
      firstGreatestUnique || "Not Found"
    );

    return firstGreatestUnique;
  }

  /** Get the last tag that isn't in the base branch */
  async getLastTagNotInBaseBranch(branch: string) {
    return this.getTagNotInBaseBranch(branch);
  }

  /** Determine the pull request for a commit hash */
  async matchCommitToPr(sha: string) {
    const query = buildSearchQuery(this.options.owner, this.options.repo, [
      sha,
    ]);

    if (!query) {
      return;
    }

    const key = `hash_${sha}`;
    const result = await this.graphql<ISearchQuery>(query);

    if (!result || !result[key] || !result[key].edges[0]) {
      return;
    }

    const pr = result[key].edges[0].node;

    return {
      ...pr,
      labels: pr.labels ? pr.labels.edges.map((edge) => edge.node.name) : [],
    };
  }
}
