import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
  ILogger,
  getPrNumberFromEnv,
  DEFAULT_PRERELEASE_BRANCHES,
  getCurrentBranch,
  determineNextVersion,
} from "@auto-it/core";

import { inc, ReleaseType } from "semver";

import * as t from "io-ts";

import { getpListContents, writepListContents } from "./utilities";

const logPrefix = "[Fastlane-Plugin]";

/**
 * Wrapper to add logPrefix to messages
 *
 * @param msg - The message to add a prefix to
 * @returns Log message with prefix prepended
 */
const logMessage = (msg: string): string => `${logPrefix} ${msg}`;

const required = t.interface({
  /** Relative path to podspec file */
  pListPath: t.union([t.string, t.array(t.string)]),
});

const optional = t.partial({
  /** The fastlane repo to publish to */
  specsRepo: t.string,

  /** Any additional command line flags to pass to `fastlane increment_version_number` */
  flags: t.array(t.string),

  /** The command to use for `pod` if it needs to be separate like `bundle exec fastlane` */
  fastlaneCommand: t.string,
});

const pluginOptions = t.intersection([required, optional]);
export type IFastlanePluginOptions = t.TypeOf<typeof pluginOptions>;

/**
 * Retrieves the version currently in the pList file
 *
 * @param pListPath - The relative path to the podspec file
 */
export async function getVersion(pListPath: string): Promise<string> {
  const pListContents = getpListContents(pListPath);
    return await execPromise ("/usr/libexec/PlistBuddy", [
      "-c",
      `"Print CFBundleShortVersionString"`,
      pListContents,
    ]);

  throw new Error(`Version could not be found in podspec: ${pListPath}`);
}


/**
 * Updates the version in the pList to the supplied version
 *
 * @param pListPath - The relative path to the pList file
 * @param version - The version to update the pList to
 */
export async function updatepListVersion(pListPath: string, version: string) {
  const parsedpListContents = getpListContents(pListPath);
  try {
    if (parsedpListContents?.[0]) {
       await execPromise("bundle", [
        "exec",
        "fastlane",
        version,
      ]);
      const newVersionString = await execPromise("/usr/libexec/PlistBuddy", [
        "-c",
        `"Print CFBundleShortVersionString"`,
        parsedpListContents,
      ]);
    }
  } catch (error) {
    throw new Error(`Error updating version in podspec: ${pListPath}`);
  }
}

/** Use auto to version your pList */
export default class FastlanePlugin implements IPlugin {
  /** The name of the plugin */
  name = "fastlane";

  /** The auto logger */
  logger?: ILogger;

  /** The options of the plugin */
  readonly options: IFastlanePluginOptions;

  /**
   *
   */
  private get paths() {
    if (typeof this.options.pListPath === "string") {
      return [this.options.pListPath];
    }

    return this.options.pListPath;
  }

  /** Initialize the plugin with it's options */
  constructor(options: IFastlanePluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    this.logger = auto.logger;
    const isQuiet = auto.logger.logLevel === "quiet";
    const isVerbose =
      auto.logger.logLevel === "verbose" ||
      auto.logger.logLevel === "veryVerbose";
    const fastlaneLogLevel = isQuiet ? ["--silent"] : isVerbose ? ["--verbose"] : [];

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.modifyConfig.tap(this.name, (config) => ({
      ...config,
      noVersionPrefix: true,
    }));

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      // Due to CocoaPods being git backed, all the versions will be the same
      // so there are no git tag collisions
      return auto.prefixRelease(getVersion(this.paths[0]));
    });

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const previousVersion = getVersion(this.paths[0]);
        const releaseVersion = inc(previousVersion, bump as ReleaseType);
        if (dryRun && releaseVersion) {
          if (quiet) {
            console.log(releaseVersion);
          } else {
            auto.logger.log.info(`Would have published: ${releaseVersion}`);
          }

          return;
        }

        if (!releaseVersion) {
          throw new Error(
            `Could not increment previous version: ${previousVersion}`
          );
        }

        this.paths.forEach((path) => {
          updatepListVersion(path, releaseVersion);
        });

        await execPromise("git", [
          "commit",
          "-am",
          `"update version: ${releaseVersion} [skip ci]"`,
          "--no-verify",
        ]);

        await execPromise("git", [
          "tag",
          `${releaseVersion}`,
          "-m",
          `"Update version to ${releaseVersion}"`,
        ]);
      }
    );

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ bump, canaryIdentifier, dryRun, quiet }) => {
        if (!auto.git) {
          return;
        }

        const pr = getPrNumberFromEnv();

        if (!pr) {
          this.logger?.log.info(
            logMessage(
              `No PR number found, using ${auto.remote} as the remote for canary. Commit must be pushed for this to work.`
            )
          );
        }

        const remoteRepo = pr
          ? (await auto.git.getPullRequest(pr)).data.head.repo?.clone_url ||
            auto.remote
          : auto.remote;

        const lastRelease = await auto.git.getLatestRelease();
        const current = await auto.getCurrentVersion(lastRelease);
        const nextVersion = inc(current, bump as ReleaseType);
        const canaryVersion = `${nextVersion}-${canaryIdentifier}`;

        if (dryRun) {
          if (quiet) {
            console.log(canaryVersion);
          } else {
            auto.logger.log.info(`Would have published: ${canaryVersion}`);
          }

          return;
        }

        await this.paths.reduce(
          (promise, path) =>
            promise.then(async () => {
              await updateSourceLocation(path, remoteRepo);

              updatePodspecVersion(path, canaryVersion);
            }),
          Promise.resolve()
        );

        // Publish the canary podspec, committing it isn't needed for specs push
        await this.publishPodSpec(fastlaneLogLevel);

        // Reset changes to podspec file since it doesn't need to be committed
        await this.paths.reduce(
          (promise, path) =>
            promise.then(async () => {
              await execPromise("git", ["checkout", path]);
            }),
          Promise.resolve()
        );

        return canaryVersion;
      }
    );

    auto.hooks.next.tapPromise(
      this.name,
      async (preReleaseVersions, { bump, dryRun }) => {
        if (!auto.git) {
          return preReleaseVersions;
        }

        const prereleaseBranches =
          auto.config?.prereleaseBranches ?? DEFAULT_PRERELEASE_BRANCHES;
        const branch = getCurrentBranch() || "";
        const prereleaseBranch = prereleaseBranches.includes(branch)
          ? branch
          : prereleaseBranches[0];
        const lastRelease = await auto.git.getLatestRelease();
        const current =
          (await auto.git.getLastTagNotInBaseBranch(prereleaseBranch)) ||
          (await auto.getCurrentVersion(lastRelease));
        const prerelease = determineNextVersion(
          lastRelease,
          current,
          bump,
          prereleaseBranch
        );

        preReleaseVersions.push(prerelease);

        if (dryRun) {
          return preReleaseVersions;
        }

        await execPromise("git", [
          "tag",
          prerelease,
          "-m",
          `"Tag pre-release: ${prerelease}"`,
        ]);

        await execPromise("git", ["push", auto.remote, branch, "--tags"]);

        this.paths.forEach((path) => updatePodspecVersion(path, prerelease));

        // Publish the next podspec, committing it isn't needed for specs push
        await this.publishPodSpec(fastlaneLogLevel);

        // Reset changes to podspec file since it doesn't need to be committed
        await Promise.all(
          this.paths.map((path) => execPromise("git", ["checkout", path]))
        );

        return preReleaseVersions;
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);
      await this.publishPodSpec(fastlaneLogLevel);
    });
  }

  /**
   *
   */
  async publishPodSpec(fastlaneLogLevel: string[]) {
    const [fastlane, ...commands] = this.options.fastlaneCommand?.split(" ") || ["fastlane"];
    if (!this.options.specsRepo) {
      this.logger?.log.info(logMessage(`Pushing to Cocoapods trunk`));
      await this.paths.reduce(
        (promise, path) =>
          promise.then(() =>
            execPromise(fastlane, [
              ...commands,
              "trunk",
              "push",
              ...(this.options.flags || []),
              path,
              ...fastlaneLogLevel,
            ])
          ),
        Promise.resolve("")
      );
      return;
    }

    try {
      const existingRepos = await execPromise(fastlane, [
        ...commands,
        "repo",
        "list",
      ]);
      if (existingRepos.indexOf("autoPublishRepo") !== -1) {
        this.logger?.log.info("Removing existing autoPublishRepo");
        await execPromise(fastlane, [
          ...commands,
          "repo",
          "remove",
          "autoPublishRepo",
          ...fastlaneLogLevel,
        ]);
      }
    } catch (error) {
      this.logger?.log.warn(
        `Error Checking for existing Specs repositories: ${error}`
      );
    }

    try {
      await execPromise(fastlane, [
        ...commands,
        "repo",
        "add",
        "autoPublishRepo",
        this.options.specsRepo,
        ...fastlaneLogLevel,
      ]);

      this.logger?.log.info(
        logMessage(`Pushing to specs repo: ${this.options.specsRepo}`)
      );

      await this.paths.reduce(
        (promise, path) =>
          promise.then(() =>
            execPromise(fastlane, [
              ...commands,
              "repo",
              "push",
              ...(this.options.flags || []),
              "autoPublishRepo",
              path,
              ...fastlaneLogLevel,
            ])
          ),
        Promise.resolve("")
      );
    } catch (error) {
      this.logger?.log.error(
        logMessage(
          `Error pushing to specs repo: ${this.options.specsRepo}. Error: ${error}`
        )
      );
      process.exit(1);
    } finally {
      await execPromise(fastlane, [
        ...commands,
        "repo",
        "remove",
        "autoPublishRepo",
        ...fastlaneLogLevel,
      ]);
    }
  }
}
