import { RestEndpointMethodTypes } from "@octokit/rest";
import dotenv from "dotenv";
import envCi from "env-ci";
import fs from "fs";
import path from "path";
import link from "terminal-link";
import icons from "log-symbols";
import chalk from "chalk";
import parseAuthor from "parse-author";
import { gt, lte, compareBuild, inc, parse, ReleaseType, major } from "semver";
import {
  AsyncParallelHook,
  AsyncSeriesBailHook,
  SyncHook,
  SyncWaterfallHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
} from "tapable";
import endent from "endent";
import { parse as parseUrl, format } from "url";
import on from "await-to-js";

import createHttpsProxyAgent from "https-proxy-agent";
import {
  ApiOptions,
  IInfoOptions,
  ICanaryOptions,
  IChangelogOptions,
  ICommentOptions,
  ICreateLabelsOptions,
  ILabelOptions,
  IPRCheckOptions,
  IPRStatusOptions,
  IReleaseOptions,
  IShipItOptions,
  IVersionOptions,
  INextOptions,
  ILatestOptions,
  QuietOption,
  DryRunOption,
} from "./auto-args";
import Changelog from "./changelog";
import Config, { DEFAULT_PRERELEASE_BRANCHES } from "./config";
import Git, { IGitOptions, IPRInfo } from "./git";
import InteractiveInit from "./init";
import LogParse, { IExtendedCommit } from "./log-parse";
import Release, { getVersionMap } from "./release";
import SEMVER, {
  calculateSemVerBump,
  IVersionLabels,
  ILabelDefinition,
  preVersionMap,
} from "./semver";
import execPromise from "./utils/exec-promise";
import { loadPlugin, IPlugin, listPlugins } from "./utils/load-plugins";
import createLog, { ILogger, setLogLevel } from "./utils/logger";
import { makeHooks } from "./utils/make-hooks";
import { getCurrentBranch } from "./utils/get-current-branch";
import { buildSearchQuery, ISearchResult } from "./match-sha-to-pr";
import getRepository from "./utils/get-repository";
import {
  RepoInformation,
  AuthorInformation,
  AutoRc,
  LoadedAutoRc,
} from "./types";
import {
  validateAutoRc,
  validatePlugins,
  ValidatePluginHook,
  formatError,
} from "./validate-config";
import { omit } from "./utils/omit";
import { execSync } from "child_process";
import isBinary from "./utils/is-binary";
import { gitReset } from "./utils/git-reset";

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

type ShipitContext = "canary" | "next" | "latest" | "old";

interface ShipitInfo {
  /** The Version published when shipit ran */
  newVersion?: string;
  /** The commits released during shipit */
  commitsInRelease: IExtendedCommit[];
  /** The type of release made */
  context: ShipitContext;
}

/** Make a HTML detail */
const makeDetail = (summary: string, body: string) => endent`
  <details>
    <summary>${summary}</summary>
    <br />
    
    ${body}
  </details>
`;

export type ShipitRelease = "latest" | "old" | "next" | "canary";

interface BeforeShipitContext extends DryRunOption {
  /** The type of release that will be made when shipit runs. */
  releaseType: ShipitRelease;
}

interface NextContext extends DryRunOption {
  /** The bump to apply to the version */
  bump: SEMVER;
  /** The commits in the next release */
  commits: IExtendedCommit[];
  /** The release notes for all the commits in the next release */
  fullReleaseNotes: string;
  /** The release notes for the last change merged to the next release */
  releaseNotes: string;
}

type PublishResponse = RestEndpointMethodTypes["repos"]["createRelease"]["response"];

export interface IAutoHooks {
  /** Modify what is in the config. You must return the config in this hook. */
  modifyConfig: SyncWaterfallHook<[LoadedAutoRc]>;
  /** Validate what is in the config. You must return the config in this hook. */
  validateConfig: ValidatePluginHook;
  /** Happens before anything is done. This is a great place to check for platform specific secrets. */
  beforeRun: AsyncSeriesHook<[LoadedAutoRc]>;
  /** Happens before `shipit` is run. This is a great way to throw an error if a token or key is not present. */
  beforeShipIt: AsyncSeriesHook<[BeforeShipitContext]>;
  /** Ran before the `changelog` command commits the new release notes to `CHANGELOG.md`. */
  beforeCommitChangelog: AsyncSeriesHook<[ChangelogLifecycle]>;
  /** Ran after the `changelog` command adds the new release notes to `CHANGELOG.md`. */
  afterAddToChangelog: AsyncSeriesHook<[ChangelogLifecycle]>;
  /** Ran after the `shipit` command has run. */
  afterShipIt: AsyncParallelHook<
    [
      {
        /** The version published in the shipit run */
        newVersion: string | undefined;
        /** The commits the version was published for */
        commitsInRelease: IExtendedCommit[];
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
        response?: PublishResponse | PublishResponse[];
      }
    ]
  >;
  /** Override what happens when "releasing" code to a Github release */
  makeRelease: AsyncSeriesBailHook<
    [
      DryRunOption & {
        /** Commit to start calculating the version from */
        from: string;
        /** The version being released */
        newVersion: string;
        /** Whether the release being made is a prerelease */
        isPrerelease?: boolean;
        /** The generated release notes for the commits */
        fullReleaseNotes: string;
        /** The commits included in the release */
        commits: IExtendedCommit[];
      }
    ],
    PublishResponse | PublishResponse[] | void
  >;
  /** Get git author. Typically from a package distribution description file. */
  getAuthor: AsyncSeriesBailHook<[], Partial<AuthorInformation> | void>;
  /** Get the previous version. Typically from a package distribution description file. */
  getPreviousVersion: AsyncSeriesBailHook<[], string>;
  /** Get owner and repository. Typically from a package distribution description file. */
  getRepository: AsyncSeriesBailHook<
    [],
    (RepoInformation & TestingToken) | void
  >;
  /** Tap into the things the Release class makes. This isn't the same as `auto release`, but the main class that does most of the work. */
  onCreateRelease: SyncHook<[Release]>;
  /**
   * This is where you hook into the LogParse's hooks.
   * This hook is exposed for convenience during `this.hooks.onCreateRelease` and at the root `this.hooks`
   */
  onCreateLogParse: SyncHook<[LogParse]>;
  /**
   * This is where you hook into the changelog's hooks.
   * This hook is exposed for convenience during `this.hooks.onCreateRelease` and at the root `this.hooks`
   */
  onCreateChangelog: SyncHook<
    [
      Changelog,
      {
        /** The bump the changelog will make */
        bump: SEMVER | undefined;
      }
    ]
  >;
  /** Version the package. This is a good opportunity to `git tag` the release also.  */
  version: AsyncParallelHook<
    [
      DryRunOption &
        QuietOption & {
          /** The semver bump to apply */
          bump: SEMVER;
        }
    ]
  >;
  /** Ran after the package has been versioned. */
  afterVersion: AsyncParallelHook<[DryRunOption]>;
  /** Publish the package to some package distributor. You must push the tags to github! */
  publish: AsyncParallelHook<
    [
      {
        /** The semver bump that was applied in the version hook */
        bump: SEMVER;
      }
    ]
  >;
  /** Used to publish a canary release. In this hook you get the semver bump and the unique canary postfix ID. */
  canary: AsyncSeriesBailHook<
    [
      DryRunOption &
        QuietOption & {
          /** The bump being applied to the version */
          bump: SEMVER;
          /** The post-version identifier to add to the version */
          canaryIdentifier: string;
        }
    ],
    | string
    | {
        /** A summary to use in a details html element */
        newVersion: string;
        /** The details to use in a details html element */
        details: string;
      }
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
  next: AsyncSeriesWaterfallHook<[string[], NextContext]>;
  /** Ran after the package has been published. */
  afterPublish: AsyncParallelHook<[]>;
  /** Ran after the package has been published. */
  prCheck: AsyncSeriesHook<
    [
      DryRunOption & {
        /** The complete information about the PR */
        pr: RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];
      }
    ]
  >;
}

/** Load the .env file into process.env. Useful for local usage. */
const loadEnv = () => {
  const envFile = path.resolve(process.cwd(), ".env");

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
  const envPr = "pr" in env && Number(env.pr);
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
  tag?: string
) {
  const next = inc(lastVersion, `pre${bump}` as ReleaseType, tag);

  return !next || lte(next, currentVersion)
    ? inc(currentVersion, "prerelease", tag) || "prerelease"
    : next;
}

/** Print the current version of "auto" */
export function getAutoVersion() {
  const packagePath = path.join(__dirname, "../package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  return packageJson.version;
}

/** Escape a string for use in a Regex */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/** The Error that gets thrown when a label existence check fails */
export class LabelExistsError extends Error {
  /**
   * @param label - the label we were checking existence for
   */
  constructor(label: string) {
    super(`The label ${label} does not exist`);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
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
  /** The remote git to push changes to. This is the full URL with auth */
  remote!: string;
  /** The user configuration of auto (.autorc) */
  config?: LoadedAutoRc;

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
    this.baseBranch = options.baseBranch || "master";
    setLogLevel(
      "quiet" in options && options.quiet
        ? "quiet"
        : Array.isArray(options.verbose) && options.verbose.length > 1
        ? "veryVerbose"
        : options.verbose
        ? "verbose"
        : undefined
    );
    this.logger = createLog();
    this.hooks = makeHooks();

    this.hooks.getRepository.tapPromise(
      "Get repo info from origin",
      getRepository
    );
    this.hooks.onCreateRelease.tap("Link onCreateChangelog", (release) => {
      release.hooks.onCreateChangelog.tap(
        "Link onCreateChangelog",
        (changelog, bump) => {
          this.hooks.onCreateChangelog.call(changelog, { bump });
        }
      );
    });
    this.hooks.onCreateRelease.tap("Link onCreateLogParse", (release) => {
      release.hooks.onCreateLogParse.tap(
        "Link onCreateLogParse",
        (logParse) => {
          this.hooks.onCreateLogParse.call(logParse);
        }
      );
    });
    this.hooks.beforeCommitChangelog.tapPromise(
      "Old Version Branches",
      async ({ bump }) => {
        if (bump === SEMVER.major && this.config?.versionBranches) {
          const branch = `${this.config.versionBranches}${major(
            await this.hooks.getPreviousVersion.promise()
          )}`;

          await execPromise("git", ["branch", branch]);
          this.logger.log.success(`Created old version branch: ${branch}`);
          await execPromise("git", ["push", this.remote, branch]);
        }
      }
    );

    /**
     * Determine if repo is behind HEAD of current branch. We do this in
     * the "afterVersion" hook so the check happens as late as possible.
     */
    this.hooks.afterVersion.tapPromise(
      "Check remote for commits",
      async ({ dryRun }) => {
        if (dryRun) {
          return;
        }

        // Credit from https://github.com/semantic-release/semantic-release/blob/b2b7b57fbd51af3fe25accdd6cd8499beb9005e5/lib/git.js#L179
        // `true` is the HEAD of the current local branch is the same as the HEAD of the remote branch, falsy otherwise.
        try {
          const currentBranch = getCurrentBranch();
          const heads = await execPromise("git", [
            "ls-remote",
            "--heads",
            this.remote,
            currentBranch,
          ]);
          this.logger.verbose.info("Branch:", currentBranch);
          this.logger.verbose.info("HEADs:", heads);
          const baseBranchHeadRef = new RegExp(
            `^(\\w+)\\s+refs/heads/${this.baseBranch}$`
          );
          const [, remoteHead] = heads.match(baseBranchHeadRef) || [];

          if (remoteHead) {
            // This will throw if the branch is ahead of the current branch
            execSync(`git merge-base --is-ancestor ${remoteHead} HEAD`, {
              stdio: "ignore",
            });
          }

          this.logger.verbose.info(
            "Current branch is up to date, proceeding with release"
          );
        } catch (error) {
          // If we are behind or there is no match, exit and skip the release
          this.logger.log.warn(
            "Current commit is behind, skipping the release to avoid collisions."
          );
          this.logger.verbose.warn(error);
          process.exit(0);
        }
      }
    );

    loadEnv();

    this.logger.verbose.info("ENV:", env);
  }

  /** List some of the plugins available to auto */
  private async listPlugins() {
    await listPlugins(
      this.config!,
      this.logger,
      this.getExtendedLocation(this.config!)
    );
  }

  /**
   * Load the default hook behaviors. Should run after loadPlugins so
   * plugins take precedence.
   */
  private loadDefaultBehavior() {
    this.hooks.makeRelease.tapPromise("Default", async (options) => {
      if (options.dryRun) {
        const bump = await this.getVersion({ from: options.from });

        this.logger.log.info(
          `Would have created a release on GitHub for version: ${inc(
            options.newVersion,
            bump as ReleaseType
          )}`
        );
        this.logger.log.note(
          'The above version would only get released if ran with "shipit" or a custom script that bumps the version using the "version" command'
        );
      } else {
        this.logger.log.info(`Releasing ${options.newVersion} to GitHub.`);

        const release = await this.git!.publish(
          options.fullReleaseNotes,
          options.newVersion,
          options.isPrerelease
        );

        this.logger.log.info(release.data.html_url);
        return release;
      }
    });
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig() {
    const configLoader = new Config(this.logger);
    const userConfig = await configLoader.loadConfig();

    this.logger.verbose.success("Loaded `auto` with config:", userConfig);

    // Allow plugins to be overriden for testing
    this.config = {
      ...userConfig,
      plugins: this.options.plugins || userConfig.plugins,
    };
    this.loadPlugins(this.config!);
    this.loadDefaultBehavior();
    this.config = this.hooks.modifyConfig.call(this.config!);
    this.labels = this.config.labels;
    this.semVerLabels = getVersionMap(this.config.labels);
    await this.hooks.beforeRun.promise(this.config);

    const errors = [
      ...(await validateAutoRc(this.config)),
      ...(await validatePlugins(this.hooks.validateConfig, this.config)),
    ];

    if (errors.length) {
      this.logger.log.error(
        endent`
          Found configuration errors:
          
          ${errors.map(formatError).join("\n")}
        `,
        "\n"
      );
      this.logger.log.warn(
        "These errors are for the fully loaded configuration (this is why some paths might seem off)."
      );

      if (this.config.extends) {
        this.logger.log.warn(
          "Some errors might originate from an extend config."
        );
      }

      process.exit(1);
    }

    const config = {
      ...this.config,
      // This Line overrides config with args
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...omit(this.options, ["_command", "_all", "main"] as any),
      baseBranch: this.config.baseBranch || this.baseBranch,
    };
    this.config = config;
    this.baseBranch = config.baseBranch;
    const repository = await this.getRepo(config);
    const token =
      repository?.token || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

    if (!token || token === "undefined") {
      this.logger.log.error(
        "No GitHub was found. Make sure it is available on process.env.GH_TOKEN."
      );
      throw new Error("GitHub token not found!");
    }

    const githubOptions = {
      owner: config.owner,
      repo: config.repo,
      ...repository,
      token,
      agent: proxyUrl ? createHttpsProxyAgent(proxyUrl) : undefined,
      baseUrl: config.githubApi,
      graphqlBaseUrl: config.githubGraphqlApi,
    };

    this.git = this.startGit(githubOptions as IGitOptions);
    this.release = new Release(this.git, config, this.logger);
    this.remote = await this.getRemote();
    this.logger.verbose.info(
      `Using remote: ${this.remote.replace(token, `****${token.slice(-4)}`)}`
    );
    this.hooks.onCreateRelease.call(this.release);

    return config;
  }

  /** Determine the remote we have auth to push to. */
  private async getRemote(): Promise<string> {
    const [, configuredRemote = "origin"] = await on(
      execPromise("git", ["remote", "get-url", "origin"])
    );

    if (!this.git) {
      return configuredRemote;
    }

    const { html_url } = (await this.git.getProject()) || { html_url: "" };

    const GIT_TOKENS: Record<string, string | undefined> = {
      // GitHub Actions require the "x-access-token:" prefix for git access
      // https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#http-based-git-access-by-an-installation
      GITHUB_TOKEN: process.env.GITHUB_ACTION
        ? `x-access-token:${process.env.GITHUB_TOKEN}`
        : undefined,
    };
    const envVar = Object.keys(GIT_TOKENS).find((v) => process.env[v]) || "";
    const gitCredentials = GIT_TOKENS[envVar] || process.env.GH_TOKEN;

    if (gitCredentials) {
      const { port, hostname, ...parsed } = parseUrl(html_url);

      const urlWithAuth = format({
        ...parsed,
        auth: gitCredentials,
        host: `${hostname}${port ? `:${port}` : ""}`,
      });

      if (await this.git.verifyAuth(urlWithAuth)) {
        this.logger.veryVerbose.note("Using token + html URL as remote");
        return urlWithAuth;
      }
    }

    if (html_url && (await this.git.verifyAuth(html_url))) {
      this.logger.veryVerbose.note("Using bare html URL as remote");
      return html_url;
    }

    this.logger.veryVerbose.note("Using remote set in environment");
    return configuredRemote;
  }

  /** Interactive prompt for initializing an .autorc */
  async init() {
    const init = new InteractiveInit(this);
    await init.run();
  }

  /** Check if auto is set up correctly */
  async info(args: IInfoOptions) {
    if (!this.git) {
      return { hasError: false };
    }

    const [, gitVersion = ""] = await on(execPromise("git", ["--version"]));
    const [noProject, project] = await on(this.git.getProject());
    const repo = (await this.getRepo(this.config!)) || {};
    const repoLink = link(
      `${repo.owner}/${repo.repo}`,
      project?.html_url ?? ""
    );
    const author = (await this.getGitUser()) || ({} as IAuthor);
    const [, lastRelease = "0.0.0"] = await on(this.git.getLatestRelease());
    const version = await this.getCurrentVersion(lastRelease);
    const [err, latestRelease] = await on(this.git.getLatestReleaseInfo());
    const latestReleaseLink = latestRelease
      ? link(latestRelease.tag_name, latestRelease.html_url)
      : "";
    const { headers } = await this.git.github.request("HEAD /");
    const access = headers as Record<string, string | undefined>;
    const rateLimitRefresh = new Date(
      Number(access["x-ratelimit-reset"]) * 1000
    );
    const token = this.git.options.token || "";
    const tokenRefresh = `${rateLimitRefresh.toLocaleTimeString()} ${rateLimitRefresh.toLocaleDateString(
      "en-us"
    )}`;
    const projectLabels = await this.git.getProjectLabels();
    const hasLabels = this.config?.labels.reduce((acc, label) => {
      if (
        label.name === "release" &&
        !this.config?.onlyPublishWithReleaseLabel
      ) {
        return acc;
      }

      if (
        label.name === "skip-release" &&
        this.config?.onlyPublishWithReleaseLabel
      ) {
        return acc;
      }

      return acc && projectLabels.includes(label.name);
    }, true);
    const { permission, user } =
      (await this.git.getTokenPermissionLevel()) || {};

    let hasError = false;

    /** Log if a configuration is correct. */
    const logSuccess = <T>(err?: T) => {
      if (err) {
        hasError = true;
        return icons.error;
      }

      return icons.success;
    };

    console.log("");
    // prettier-ignore
    console.log(endent`
      ${chalk.underline.white('Environment Information:')}

      "auto" version: v${getAutoVersion()}
      "git"  version: v${gitVersion.replace('git version ', '')}
      "node" version: ${process.version.trim()}${
        access['x-github-enterprise-version'] 
          ? `\nGHE version:    v${access['x-github-enterprise-version']}\n`
          : '\n'}
      ${chalk.underline.white('Project Information:')}

      ${logSuccess(noProject)} Repository:      ${repoLink}
      ${logSuccess(!author.name)} Author Name:     ${author.name}
      ${logSuccess(!author.email)} Author Email:    ${author.email}
      ${logSuccess(!version)} Current Version: ${this.prefixRelease(version)}
      ${logSuccess(err)} Latest Release:  ${latestReleaseLink}

      ${logSuccess(!hasLabels)} Labels configured on GitHub project ${hasLabels ? '' :  '(Try running "auto create-labels")'}

      ${chalk.underline.white('GitHub Token Information:')}

      ${logSuccess(!token)} Token:            ${`[Token starting with ${token.substring(0, 4)}]`}
      ${logSuccess(!(permission === 'admin' || permission === 'write'))} Repo Permission:  ${permission}
      ${logSuccess(!user?.login)} User:             ${user?.login}
      ${logSuccess()} API:              ${link(this.git.options.baseUrl!, this.git.options.baseUrl!)}
      ${logSuccess(!access['x-oauth-scopes']?.includes('repo'))} Enabled Scopes:   ${access['x-oauth-scopes']}
      ${logSuccess(Number(access['x-ratelimit-remaining']) === 0)} Rate Limit:       ${access['x-ratelimit-remaining'] || '∞'}/${access['x-ratelimit-limit'] || '∞'} ${access['ratelimit-reset'] ? `(Renews @ ${tokenRefresh})` : ''}
    `);
    console.log("");

    if (args.listPlugins) {
      await this.listPlugins();
    }

    return { hasError };
  }

  /** Determine if the repo is currently in a prerelease branch */
  inPrereleaseBranch(): boolean {
    const branch = getCurrentBranch();
    const prereleaseBranches =
      this.config?.prereleaseBranches ?? DEFAULT_PRERELEASE_BRANCHES;

    return Boolean(branch && prereleaseBranches.includes(branch));
  }

  /** Determine if the repo is currently in a old-version branch */
  inOldVersionBranch(): boolean {
    const branch = getCurrentBranch();
    const oldVersionBranchPrefix = this.config?.versionBranches as
      | string
      | undefined;

    return Boolean(
      oldVersionBranchPrefix &&
        branch &&
        new RegExp(`^${escapeRegExp(oldVersionBranchPrefix)}`).test(branch)
    );
  }

  /**
   * Create all of the user's labels on the git remote if the don't already exist
   */
  async createLabels(options: ICreateLabelsOptions = {}) {
    if (!this.release || !this.labels) {
      throw this.createErrorMessage();
    }

    await this.release.addLabelsToProject(this.labels, options);
  }

  /**
   * Get the labels on a specific PR. Defaults to the labels of the last merged PR
   */
  async label({ pr, exists }: ILabelOptions = {}) {
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
        state: "closed",
      });
      const lastMerged = pulls
        .sort(
          (a, b) =>
            new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime()
        )
        .find((pull) => pull.merged_at);

      if (lastMerged) {
        labels = lastMerged.labels.map((label) => label.name);
      }
    }

    if (exists) {
      if (labels.indexOf(exists) === -1) {
        throw new LabelExistsError(exists);
      }

      return;
    }

    if (labels.length) {
      console.log(labels.join("\n"));
    }
  }

  /**
   * Create a status on a PR.
   */
  async prStatus({ dryRun, pr, url, ...options }: IPRStatusOptions) {
    if (!this.git) {
      throw this.createErrorMessage();
    }

    let { sha } = options;
    let prNumber: number | undefined;

    try {
      prNumber = this.getPrNumber("pr", pr);
    } catch (error) {
      // default to sha if no PR found
    }

    this.logger.verbose.info("Using command: 'pr-status'");

    if (!sha && prNumber) {
      this.logger.verbose.info("Getting commit SHA from PR.");
      const res = await this.git.getPullRequest(prNumber);
      sha = res.data.head.sha;
    } else if (!sha) {
      this.logger.verbose.info("No PR found, getting commit SHA from HEAD.");
      sha = await this.git.getSha();
    }

    this.logger.verbose.info("Found PR SHA:", sha);

    const target_url = url;

    if (dryRun) {
      this.logger.verbose.info("`pr` dry run complete.");
    } else {
      try {
        await this.git.createStatus({
          ...options,
          sha,
          target_url,
        });
      } catch (error) {
        throw new Error(
          `Failed to post status to Pull Request with error code ${error.status}`
        );
      }

      this.logger.log.success("Posted status to Pull Request.");
    }

    this.logger.verbose.success("Finished `pr` command");
  }

  /**
   * Check that a PR has a SEMVER label. Set a success status on the PR.
   */
  async prCheck({ dryRun, pr, url, ...options }: IPRCheckOptions) {
    if (!this.git || !this.release || !this.semVerLabels) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info(`Using command: 'pr-check' for '${url}'`);

    const target_url = url;
    const prNumber = this.getPrNumber("prCheck", pr);
    let msg;
    let sha;

    try {
      const res = await this.git.getPullRequest(prNumber);
      await this.hooks.prCheck.promise({ pr: res.data, dryRun });

      sha = res.data.head.sha;

      const labels = await this.git.getLabels(prNumber);
      const labelValues = [...this.semVerLabels.values()];
      const releaseTag = labels.find((l) => l === "release");

      const skipReleaseLabels = (
        this.config?.labels.filter((l) => l.releaseType === "skip") || []
      ).map((l) => l.name);
      const skipReleaseTag = labels.find((l) => skipReleaseLabels.includes(l));

      const semverTag = labels.find(
        (l) =>
          labelValues.some((labelValue) => labelValue.includes(l)) &&
          !skipReleaseLabels.includes(l) &&
          l !== "release"
      );
      const branch = getCurrentBranch();

      if (branch && this.config?.prereleaseBranches.includes(branch)) {
        msg = {
          description: "PR will graduate prerelease once merged",
          state: "success",
        };
      } else if (semverTag === undefined && !skipReleaseTag) {
        throw new Error("No semver label!");
      } else {
        this.logger.log.success(
          `PR is using label: ${semverTag || skipReleaseTag}`
        );

        let description;

        if (skipReleaseTag) {
          description = "PR will not create a release";
        } else if (releaseTag) {
          description = `PR will create release once merged - ${semverTag}`;
        } else {
          description = `CI - ${semverTag}`;
        }

        msg = {
          description,
          state: "success",
        };
      }
    } catch (error) {
      msg = {
        description: error.message,
        state: "error",
      };
    }

    this.logger.verbose.info("Posting status to GitHub\n", msg);

    if (dryRun) {
      this.logger.verbose.info("`pr-check` dry run complete.");
    } else {
      try {
        await this.git.createStatus({
          ...options,
          ...msg,
          target_url,
          sha,
        } as IPRInfo);

        this.logger.log.success("Posted status to Pull Request.");
      } catch (error) {
        throw new Error(
          `Failed to post status to Pull Request with error code ${error.status}`
        );
      }
    }

    this.logger.verbose.success("Finished `pr-check` command");
  }

  /**
   * Comment on a PR. Only one comment will be present on the PR, Older comments are removed.
   * You can use the "context" option to multiple comments on a PR.
   */
  async comment(args: ICommentOptions) {
    const options = { ...this.getCommandDefault("comment"), ...args };
    const {
      message,
      pr,
      context = "default",
      dryRun,
      delete: deleteFlag,
      edit: editFlag,
    } = options;

    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'comment'");
    const prNumber = this.getPrNumber("comment", pr);

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
   */
  async prBody(options: ICommentOptions) {
    const {
      message,
      pr,
      context = "default",
      dryRun,
      delete: deleteFlag,
    } = options;

    if (!this.git) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'pr-body'");
    const prNumber = this.getPrNumber("pr-body", pr);

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
        await this.git.addToPrBody("", prNumber, context);
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
  // eslint-disable-next-line complexity
  async canary(args: ICanaryOptions = {}): Promise<ShipitInfo | undefined> {
    const options = { ...this.getCommandDefault("canary"), ...args };

    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    if (!this.hooks.canary.isUsed()) {
      this.logger.log.warn(endent`
        None of the plugins that you are using implement the \`canary\` command!

        "canary" releases are versions that are used solely to test changes. They make sense on some platforms (ex: npm) but not all!
        
        If you think your package manager has the ability to support canaries please file an issue or submit a pull request,
      `);
      process.exit(0);
    }

    if (!args.dryRun) {
      await this.checkClean();
    }

    let { pr, build } = await this.getPrEnvInfo();
    pr = options.pr ? String(options.pr) : pr;
    build = options.build ? String(options.build) : build;

    this.logger.verbose.info("Canary info found:", { pr, build });

    const from = (await this.git.shaExists("HEAD^")) ? "HEAD^" : "HEAD";
    const commitsInRelease = await this.release.getCommitsInRelease(from);
    const labels = commitsInRelease.map((commit) => commit.labels);
    let bump = calculateSemVerBump(labels, this.semVerLabels!, this.config);

    if (bump === SEMVER.noVersion) {
      if (options.force) {
        bump = SEMVER.patch;
      } else {
        this.logger.log.info(
          "Skipping canary release due to PR being specifying no release. Use `auto canary --force` to override this setting"
        );
        return;
      }
    }

    let canaryIdentifier = "";
    let newVersion = "";

    if (pr) {
      canaryIdentifier = `${canaryIdentifier}.${pr}`;
    }

    if (build) {
      canaryIdentifier = `${canaryIdentifier}.${build}`;
    }

    if (!pr || !build) {
      canaryIdentifier = `${canaryIdentifier}.${await this.git.getSha(true)}`;
    }

    canaryIdentifier = `canary${canaryIdentifier}`;

    this.logger.verbose.info("Calling canary hook");
    const result = await this.hooks.canary.promise({
      bump,
      canaryIdentifier,
      dryRun: args.dryRun,
      quiet: args.quiet,
    });

    if (typeof result === "object" && "error" in result) {
      this.logger.log.warn(result.error);
      return;
    }

    if (!result) {
      return;
    }

    newVersion = typeof result === "string" ? result : result.newVersion;
    const messageHeader = (
      options.message || "📦 Published PR as canary version: %v"
    ).replace(
      "%v",
      !newVersion || newVersion.includes("\n")
        ? newVersion
        : `<code>${newVersion}</code>`
    );

    if (options.message !== "false" && pr) {
      const message =
        typeof result === "string"
          ? messageHeader
          : makeDetail(messageHeader, result.details);

      await this.prBody({
        pr: Number(pr),
        context: "canary-version",
        message,
      });
    }

    this.logger.log.success(
      `Published canary version${newVersion ? `: ${newVersion}` : ""}`
    );

    if (args.quiet) {
      console.log(newVersion);
    }

    await gitReset();

    return { newVersion, commitsInRelease, context: "canary" };
  }

  /**
   * Create a next (or test) version of the project. If on master will
   * release to the default "next" branch.
   */
  async next(args: INextOptions): Promise<ShipitInfo | undefined> {
    const options = { ...this.getCommandDefault("next"), ...args };

    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    if (!this.hooks.next.isUsed()) {
      this.logger.log.warn(endent`
        None of the plugins that you are using implement the \`next\` command!

        "next" releases are pre-releases such as betas or alphas. They make sense on some platforms (ex: npm) but not all!

        If you think your package manager has the ability to support "next" releases please file an issue or submit a pull request,
      `);
      process.exit(0);
    }

    if (!args.dryRun) {
      await this.checkClean();
    }

    await this.setGitUser();

    this.hooks.onCreateLogParse.tap("Omit merges from master", (logParse) => {
      logParse.hooks.omitCommit.tap("Omit merges from master", (commit) => {
        const shouldOmit = commit.subject.match(/^Merge (?:\S+\/)*master/);

        if (shouldOmit) {
          this.logger.verbose.info(
            `Omitting merge commit from master: ${commit.subject}`
          );
          return true;
        }
      });
    });

    const currentBranch = getCurrentBranch();
    const forkPoints = (
      await execPromise("git", [
        "rev-list",
        "--boundary",
        `${currentBranch}...origin/${this.baseBranch}`,
        "--left-only",
      ])
    )
      .split("\n")
      .filter((line) => line.startsWith("-"));
    const initialForkCommit = (forkPoints[forkPoints.length - 1] || "").slice(
      1
    );
    const lastRelease =
      initialForkCommit || (await this.git.getLatestRelease());

    const [, lastTagNotInBaseBranch] = await on(
      this.git.getLastTagNotInBaseBranch(currentBranch!)
    );
    const [, latestTagInBranch] = await on(
      this.git.getLatestTagInBranch(currentBranch)
    );
    const lastTag =
      lastTagNotInBaseBranch ||
      latestTagInBranch ||
      (await this.git.getFirstCommit());

    const fullReleaseNotes = await this.release.generateReleaseNotes(
      lastRelease
    );
    const commits = await this.release.getCommitsInRelease(lastTag);
    const releaseNotes = await this.release.generateReleaseNotes(lastTag);
    const labels = commits.map((commit) => commit.labels);
    const bump =
      calculateSemVerBump(labels, this.semVerLabels!, this.config) ||
      SEMVER.patch;

    if (!args.quiet) {
      this.logger.log.info("Full Release notes for next release:");
      console.log(fullReleaseNotes);

      if (releaseNotes) {
        this.logger.log.info("Release notes for last change in next release");
        console.log(releaseNotes);
      }
    }

    this.logger.verbose.info(`Calling "next" hook with: ${bump}`);
    const result = await this.hooks.next.promise([], {
      bump,
      commits,
      fullReleaseNotes,
      releaseNotes,
      dryRun: args.dryRun,
    });

    if (args.dryRun) {
      console.log(result.join("\n"));
      return;
    }

    const newVersion = result.join(", ");
    const release = await this.hooks.makeRelease.promise({
      commits,
      from: lastTag,
      isPrerelease: true,
      newVersion,
      fullReleaseNotes: releaseNotes,
    });

    this.logger.verbose.info(release);

    if (release) {
      await this.hooks.afterRelease.promise({
        lastRelease: lastTag,
        newVersion,
        commits,
        releaseNotes,
        response: release,
      });
    }

    this.logger.log.success(
      `Published next version${result.length > 1 ? `s` : ""}: ${newVersion}`
    );

    const { pr } = await this.getPrEnvInfo();

    if (pr) {
      const message = options.message || "Published prerelease version: %v";

      if (pr) {
        await this.prBody({
          pr: Number(pr),
          context: "prerelease-version",
          message: endent`
            # Version

            ${message.replace("%v", result.map((r) => `\`${r}\``).join("\n"))}

            <details>
              <summary>Changelog</summary>

              ${fullReleaseNotes}
            </details>
          `,
        });
      }
    }

    if (options.quiet) {
      console.log(newVersion);
    }

    await gitReset();
    return { newVersion, commitsInRelease: commits, context: "next" };
  }

  /** Force a release to latest and bypass `shipit` safeguards. */
  async latest(args: IShipItOptions = {}) {
    const options = {
      ...(this.getCommandDefault("latest") as IShipItOptions),
      ...args,
    };

    return this.publishFullRelease(options);
  }

  /**
   * Run the full workflow.
   *
   * 1. Calculate version
   * 2. Make changelog
   * 3. Publish code
   * 4. Create a release
   */
  async shipit(args: IShipItOptions = {}) {
    const options = {
      ...(this.getCommandDefault("shipit") as IShipItOptions),
      ...args,
    };

    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    this.logger.verbose.info("Using command: 'shipit'");

    const isPR = "isPr" in env && env.isPr;
    const from = (await this.git.shaExists("HEAD^")) ? "HEAD^" : "HEAD";
    const head = await this.release.getCommitsInRelease(from);
    // env-ci sets branch to target branch (ex: master) in some CI services.
    // so we should make sure we aren't in a PR just to be safe
    const currentBranch = getCurrentBranch();
    const isBaseBranch = !isPR && currentBranch === this.baseBranch;
    const shouldGraduate =
      !options.onlyGraduateWithReleaseLabel ||
      (options.onlyGraduateWithReleaseLabel &&
        head[0].labels.some((l) =>
          this.semVerLabels?.get("release")?.includes(l)
        ));
    const isPrereleaseBranch = this.config?.prereleaseBranches?.some(
      (branch) => currentBranch === branch
    );
    const publishPrerelease =
      isPrereleaseBranch ||
      (currentBranch === this.baseBranch &&
        options.onlyGraduateWithReleaseLabel);

    this.logger.veryVerbose.info({
      currentBranch,
      isBaseBranch,
      isPR,
      shouldGraduate,
      isPrereleaseBranch,
      publishPrerelease,
    });
    let publishInfo: ShipitInfo | undefined;

    let releaseType: ShipitRelease = "canary";

    if (isBaseBranch && shouldGraduate) {
      releaseType = "latest";
    } else if (this.inOldVersionBranch()) {
      releaseType = "old";
    } else if (publishPrerelease) {
      releaseType = "next";
    }

    await this.hooks.beforeShipIt.promise({
      releaseType,
      dryRun: options.dryRun,
    });

    if (releaseType === "latest") {
      publishInfo = await this.latest(options);
    } else if (releaseType === "old") {
      publishInfo = await this.oldRelease(options);
    } else if (releaseType === "next") {
      publishInfo = await this.next(options);
    } else {
      publishInfo = await this.canary(options);

      if (options.dryRun && !options.quiet) {
        this.logger.log.success(
          "Below is what would happen upon merge of the current branch into master"
        );
        await this.publishFullRelease(options);
      }
    }

    if (!publishInfo) {
      return;
    }

    const { newVersion, commitsInRelease, context } = publishInfo;
    await this.hooks.afterShipIt.promise({
      newVersion,
      commitsInRelease,
      context,
    });
  }

  /** Get the latest version number of the project */
  async getCurrentVersion(lastRelease: string) {
    this.hooks.getPreviousVersion.tap("None", () => {
      this.logger.veryVerbose.info(
        "No previous release found, using 0.0.0 as previous version."
      );
      return this.prefixRelease("0.0.0");
    });

    const lastVersion = await this.hooks.getPreviousVersion.promise();

    if (
      parse(lastRelease) &&
      parse(lastVersion) &&
      gt(lastRelease, lastVersion)
    ) {
      this.logger.veryVerbose.info("Using latest release as previous version");
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
      from: latestTag,
    });

    if (result) {
      result.context = "old";
    }

    return result;
  }

  /** Publish a new version with changelog, publish, and release */
  private async publishFullRelease(
    options: ILatestOptions & {
      /** Internal option to shipit from a certain tag or commit */
      from?: string;
    }
  ): Promise<ShipitInfo | undefined> {
    if (!this.git || !this.release) {
      throw this.createErrorMessage();
    }

    const bump = await this.getVersion(options);

    this.logger.log.success(`Calculated version bump: ${bump || "none"}`);

    if (bump === "") {
      this.logger.log.info("No version published.");
      return;
    }

    const lastRelease = options.from || (await this.git.getLatestRelease());
    const commitsInRelease = await this.release.getCommitsInRelease(
      lastRelease
    );

    await this.makeChangelog({
      ...options,
      quiet: undefined,
      noCommit: options.noChangelog,
    });

    if (!options.dryRun) {
      await this.checkClean();
    }

    this.logger.verbose.info("Calling version hook");
    await this.hooks.version.promise({
      bump,
      dryRun: options.dryRun,
      quiet: options.quiet,
    });
    this.logger.verbose.info("Calling after version hook");
    await this.hooks.afterVersion.promise({ dryRun: options.dryRun });

    if (!options.dryRun) {
      this.logger.verbose.info("Calling publish hook");
      await this.hooks.publish.promise({ bump });
      this.logger.verbose.info("Calling after publish hook");
      await this.hooks.afterPublish.promise();
    }

    return {
      newVersion: await this.makeRelease(options),
      commitsInRelease,
      context: "latest",
    };
  }

  /** Get a pr number from user input or the env */
  private getPrNumber(command: string, pr?: number) {
    const prNumber = getPrNumberFromEnv(pr);

    if (!prNumber) {
      this.logger.log.error(
        endent`
          Could not detect PR number. ${command} must be run from either a PR or have the PR number supplied via the --pr flag.
          
          In some CIs your branch might be built before you open a PR and posting the canary version will fail. In this case subsequent builds should succeed. 
        `
      );

      process.exit(1);
    }

    return prNumber;
  }

  /** Create a client to interact with git */
  private startGit(gitOptions: IGitOptions) {
    if (!gitOptions.owner || !gitOptions.repo || !gitOptions.token) {
      throw new Error("Must set owner, repo, and GitHub token.");
    }

    this.logger.verbose.info("Options contain repo information.");

    // So that --verbose can be used on public CIs
    const tokenlessArgs = {
      ...gitOptions,
      token: `[Token starting with ${gitOptions.token.substring(0, 4)}]`,
    };

    this.logger.verbose.info("Initializing GitHub API with:\n", tokenlessArgs);
    return new Git(
      {
        owner: gitOptions.owner,
        repo: gitOptions.repo,
        token: gitOptions.token,
        baseUrl: gitOptions.baseUrl,
        baseBranch: this.baseBranch,
        graphqlBaseUrl: gitOptions.graphqlBaseUrl,
        agent: gitOptions.agent,
      },
      this.logger
    );
  }

  /** Calculate a version from a tag using labels */
  async getVersion({ from }: IVersionOptions = {}) {
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
  private async makeChangelog(args: IChangelogOptions = {}) {
    const options = { ...this.getCommandDefault("changelog"), ...args };
    const {
      dryRun,
      from,
      to,
      title,
      message = "Update CHANGELOG.md [skip ci]",
      noCommit,
    } = options;

    if (!this.release || !this.git) {
      throw this.createErrorMessage();
    }

    await this.setGitUser();

    if (title) {
      this.release.hooks.createChangelogTitle.tap(
        "Changelog Flag",
        () => title
      );
    }

    const lastRelease = from || (await this.git.getLatestRelease());
    const bump = await this.release.getSemverBump(lastRelease, to);
    const releaseNotes = await this.release.generateReleaseNotes(
      lastRelease,
      to,
      this.versionBump
    );

    if (dryRun) {
      this.logger.log.info("Potential Changelog Addition:\n", releaseNotes);
      this.logger.verbose.info("`changelog` dry run complete.");
      return;
    }

    if (args.quiet) {
      console.log(releaseNotes);
    } else {
      this.logger.log.info("New Release Notes\n", releaseNotes);
    }

    const currentVersion = await this.getCurrentVersion(lastRelease);
    const context = {
      bump,
      commits: await this.release.getCommits(lastRelease, to || undefined),
      releaseNotes,
      lastRelease,
      currentVersion,
    };

    if (!noCommit) {
      await this.release.addToChangelog(
        releaseNotes,
        lastRelease,
        currentVersion
      );

      await this.hooks.beforeCommitChangelog.promise(context);
      await execPromise("git", ["commit", "-m", `"${message}"`, "--no-verify"]);
      this.logger.verbose.info("Committed new changelog.");
    }

    await this.hooks.afterAddToChangelog.promise(context);
  }

  /** Make a release over a range of commits */
  private async makeRelease(args: IReleaseOptions = {}) {
    const options = { ...this.getCommandDefault("release"), ...args };
    const { dryRun, from, to, useVersion, prerelease = false } = options;

    if (!this.release || !this.git) {
      throw this.createErrorMessage();
    }

    // This will usually resolve to something on head
    const [err, latestTag] = await on(this.git.getLatestTagInBranch());

    // If its a dry run we want to show what would happen. Otherwise no
    // tags indicates that something would definitely go wrong.
    if (err?.message.includes("No names found") && !args.dryRun) {
      this.logger.log.error(
        endent`
          Could not find any tags in the local repository. Exiting early.

          The "release" command creates GitHub releases for tags that have already been created in your repo.
          
          If there are no tags there is nothing to release. If you don't use "shipit" ensure you tag your releases with the new version number.
        `,
        "\n"
      );
      this.logger.verbose.error(err);
      return process.exit(1);
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

    this.logger.log.info('Current "Latest Release" on Github:', lastRelease);

    const commitsInRelease = await this.release.getCommitsInRelease(
      lastRelease,
      to
    );
    const releaseNotes = await this.release.generateReleaseNotes(
      lastRelease,
      to,
      this.versionBump
    );

    this.logger.log.info(`Using release notes:\n${releaseNotes}`);

    const rawVersion =
      useVersion ||
      (isPrerelease && latestTag) ||
      (await this.getCurrentVersion(lastRelease)) ||
      latestTag;

    if (!rawVersion) {
      this.logger.log.error("Could not calculate next version from last tag.");
      return;
    }

    const newVersion = parse(rawVersion)
      ? this.prefixRelease(rawVersion)
      : rawVersion;

    if (
      !dryRun &&
      parse(newVersion) &&
      parse(lastRelease) &&
      compareBuild(newVersion, lastRelease) === 0
    ) {
      this.logger.log.warn(
        `Nothing released to Github. Version to be released is the same as the latest release on Github: ${newVersion}`
      );
      return;
    }

    const release = await this.hooks.makeRelease.promise({
      dryRun,
      from: lastRelease,
      isPrerelease,
      newVersion,
      fullReleaseNotes: releaseNotes,
      commits: commitsInRelease,
    });

    if (release) {
      await this.hooks.afterRelease.promise({
        lastRelease,
        newVersion,
        commits: commitsInRelease,
        releaseNotes,
        response: release,
      });
    }

    return newVersion;
  }

  /** Check if `git status` is clean. */
  readonly checkClean = async () => {
    const status = await execPromise("git", ["status", "--porcelain"]);

    if (!status) {
      return;
    }

    this.logger.log.error("Changed Files:\n", status);

    throw new Error(
      "Working directory is not clean, make sure all files are committed"
    );
  };

  /** Prefix a version with a "v" if needed */
  readonly prefixRelease = (release: string) => {
    if (!this.release) {
      throw this.createErrorMessage();
    }

    return this.config?.noVersionPrefix || release.startsWith("v")
      ? release
      : `v${release}`;
  };

  /** Create an auto initialization error */
  private createErrorMessage() {
    return new Error(
      `Auto is not initialized! Make sure the have run Auto.loadConfig`
    );
  }

  /** Get the current git user */
  private async getGitUser() {
    try {
      return {
        /** The git user is already set in the current env */
        system: true,
        email: await execPromise("git", ["config", "user.email"]),
        name: await execPromise("git", ["config", "user.name"]),
      };
    } catch (error) {
      this.logger.verbose.warn(
        "Could not find git user or email configured in git config"
      );

      const { author } = this.config || {};
      let { email, name } = this.config || {};

      if (author) {
        const parsedAuthor =
          typeof author === "string" ? parseAuthor(author) : author;

        if (
          typeof parsedAuthor === "object" &&
          parsedAuthor.email &&
          parsedAuthor.name
        ) {
          ({ name, email } = parsedAuthor);
        } else {
          this.logger.log.error(endent`
            .autorc author parsing failed!
  
            The author must either be in one of the following formats:
  
            1. Your Name <your_email@mail.com>
            2. An object with "name" and "email"
  
            But you supplied:
  
            ${author}
          `);
        }
      }

      this.logger.verbose.warn(
        `Got author from options: email: ${email}, name ${name}`
      );
      const packageAuthor = await this.hooks.getAuthor.promise();

      email = !email && packageAuthor ? packageAuthor.email : email;
      name = !name && packageAuthor ? packageAuthor.name : name;

      this.logger.verbose.warn(`Using author: ${name} <${email}>`);

      return { email, name };
    }
  }

  /**
   * Set the git user to make releases and commit with.
   */
  async setGitUser() {
    const user = await this.getGitUser();

    if (user && !user.system) {
      if (!env.isCi) {
        this.logger.log.note(endent`
          Detected local environment, will not set git user. This happens automatically in a CI environment.

          If a command fails manually run:

            - git config user.email your@email.com
            - git config user.name "Your Name"
        `);
        return;
      }

      if (user.email) {
        await execPromise("git", ["config", "user.email", `"${user.email}"`]);
        this.logger.verbose.warn(`Set git email to ${user.email}`);
      }

      if (user.name) {
        await execPromise("git", ["config", "user.name", `"${user.name}"`]);
        this.logger.verbose.warn(`Set git name to ${user.name}`);
      }

      if (!user.name && !user.email) {
        this.logger.log.error(
          endent`
            Could find a git name and email to commit with!

            Name: ${user.name}
            Email: ${user.email}
  
            You must do one of the following: 
  
            - configure the author for your package manager (ex: set "author" in package.json)
            - Set "name" and "email in your .autorc
          `,
          ""
        );
        process.exit(1);
      }
    }
  }

  /** Get the repo to interact with */
  private async getRepo(config: LoadedAutoRc) {
    if (config.owner && config.repo) {
      return config as RepoInformation & TestingToken;
    }

    const author = await this.hooks.getRepository.promise();

    if (!author || !author.owner || !author.repo) {
      this.logger.log.error(
        endent`
          Cannot find project owner and repository name!

          You must do one of the following: 

          - configure the repo for your package manager (ex: set "repository" in package.json)
          - configure your git remote 'origin' to point to your project on GitHub.
        `,
        ""
      );
      process.exit(1);
    }

    return author;
  }

  /** Find the location of the extended configuration */
  private getExtendedLocation(config: AutoRc) {
    let extendedLocation: string | undefined;

    try {
      if (config.extends) {
        extendedLocation = require.resolve(config.extends);
      }
    } catch (error) {
      this.logger.veryVerbose.error(error);
    }

    return extendedLocation;
  }

  /**
   * Apply all of the plugins in the config.
   */
  private loadPlugins(config: AutoRc) {
    config.plugins = config.plugins || [isBinary() ? "git-tag" : "npm"];

    const extendedLocation = this.getExtendedLocation(config);
    const pluginsPaths = [
      require.resolve("./plugins/filter-non-pull-request"),
      ...config.plugins,
    ];

    pluginsPaths
      .map((plugin) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof plugin === "string" ? ([plugin, {}] as [string, any]) : plugin
      )
      .map((plugin) => loadPlugin(plugin, this.logger, extendedLocation))
      .filter((plugin): plugin is IPlugin => Boolean(plugin))
      .forEach((plugin) => {
        this.logger.verbose.info(`Using ${plugin.name} Plugin...`);
        plugin.apply(this);
      });
  }

  /** Get the branch and build number when in CI environment */
  private async getPrEnvInfo() {
    // SailEnv falls back to commit SHA
    let pr: string | undefined;
    let build: string | undefined;

    if ("pr" in env && "build" in env) {
      ({ pr } = env);
      ({ build } = env);
    } else if ("pr" in env && "commit" in env) {
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
        const result = await this.git.graphql<Record<string, ISearchResult>>(
          query
        );

        if (result?.[`hash_${commit}`]) {
          const number = result[`hash_${commit}`].edges[0]?.node?.number;

          if (number) {
            pr = String(number);
          }
        }
      }
    }

    return { pr, build };
  }

  /** Get the default for a command from the config */
  private getCommandDefault(name: string) {
    if (!this.config) {
      return {};
    }

    const commandConfig = this.config[name as keyof AutoRc];
    return typeof commandConfig === "object" ? commandConfig : {};
  }
}

// Plugin Utils

export * from "./auto-args";
export { default as InteractiveInit } from "./init";
export { DEFAULT_PRERELEASE_BRANCHES } from "./config";
export { getCurrentBranch } from "./utils/get-current-branch";
export { validatePluginConfiguration } from "./validate-config";
export { ILogger } from "./utils/logger";
export { IPlugin } from "./utils/load-plugins";
export { ICommitAuthor, IExtendedCommit } from "./log-parse";

export { default as Auto } from "./auto";
export { default as SEMVER, VersionLabel } from "./semver";
export { default as execPromise } from "./utils/exec-promise";
export {
  default as getLernaPackages,
  LernaPackage,
} from "./utils/get-lerna-packages";
export { default as inFolder } from "./utils/in-folder";
