import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
  ILogger,
  getPrNumberFromEnv,
} from "@auto-it/core";

import { inc, ReleaseType } from "semver";

import * as t from "io-ts";

import { getPodspecContents, writePodspecContents } from "./utilities";

const logPrefix = "[Cocoapods-Plugin]";

/** Regex used to pull the version line from the spec */
const versionRegex = /\.version\s*=\s*['|"](?<version>\d+\.\d+\.\d+.*?)['|"]/;

/** Regex used to pull the source dictionary from the spec */
const sourceLineRegex = /(?<specVar>\w+)\.source.*(?<source>\{\s*:\s*git.*\})/;

/**
 * Wrapper to add logPrefix to messages
 *
 * @param msg - The message to add a prefix to
 * @returns Log message with prefix prepended
 */
const logMessage = (msg: string): string => `${logPrefix} ${msg}`;

const required = t.interface({
  /** Relative path to podspec file */
  podspecPath: t.string,
});

const optional = t.partial({
  /** The Cocoapods repo to publish to */
  specsRepo: t.string,

  /** Any additional command line flags to pass to `pod repo push` */
  flags: t.array(t.string),

  /** The command to use for `pod` if it needs to be separate like `bundle exec pod` */
  podCommand: t.string,
});

const pluginOptions = t.intersection([required, optional]);
export type ICocoapodsPluginOptions = t.TypeOf<typeof pluginOptions>;

/**
 * Returns the regex'd version of the podspec file
 *
 * @param podspecPath - The relative path to the podspec file
 * @returns The regular expression array for use in replacing file contents
 */
export function getParsedPodspecContents(
  podspecPath: string
): RegExpExecArray | null {
  const podspecContents = getPodspecContents(podspecPath);
  return versionRegex.exec(podspecContents);
}

/**
 * Retrieves the version currently in the podspec file
 *
 * @param podspecPath - The relative path to the podspec file
 */
export function getVersion(podspecPath: string): string {
  const podspecContents = getParsedPodspecContents(podspecPath);
  if (podspecContents?.groups?.version) {
    return podspecContents.groups.version;
  }

  throw new Error(`Version could not be found in podspec: ${podspecPath}`);
}

/**
 * Retrieves the source dictionary currently in the podspec file
 *
 * @param podspecPath - The relative path to the podspec file
 */
export function getSourceInfo(podspecPath: string): string {
  const podspecContents = sourceLineRegex.exec(getPodspecContents(podspecPath));
  if (podspecContents?.groups?.source) {
    return podspecContents.groups.source;
  }

  throw new Error(`Source could not be found in podspec: ${podspecPath}`);
}

/**
 * Updates the version in the podspec to the supplied version
 *
 * @param podspecPath - The relative path to the podspec file
 * @param version - The version to update the podspec to
 */
export function updatePodspecVersion(podspecPath: string, version: string) {
  const previousVersion = getVersion(podspecPath);
  const parsedContents = getParsedPodspecContents(podspecPath);
  const podspecContents = getPodspecContents(podspecPath);

  try {
    if (parsedContents?.[0]) {
      const newVersionString = parsedContents[0].replace(
        previousVersion,
        version
      );
      const newPodspec = podspecContents.replace(
        versionRegex,
        newVersionString
      );

      writePodspecContents(podspecPath, newPodspec);
    }
  } catch (error) {
    throw new Error(`Error updating version in podspec: ${podspecPath}`);
  }
}

/**
 * Updates the version in the podspec to the supplied version
 *
 * @param podspecPath - The relative path to the podspec file
 * @param remote - The git remote that is being used
 * @param canary - Whether to update to the canary location or not
 */
export async function updateSourceLocation(
  podspecPath: string,
  remote: string
) {
  const podspecContents = getPodspecContents(podspecPath);

  const source = getSourceInfo(podspecPath);

  try {
    const revision = await execPromise("git", ["rev-parse", "HEAD"]);
    const newPodspec = podspecContents.replace(
      source,
      `{ :git => '${remote}', :commit => '${revision}' }`
    );

    writePodspecContents(podspecPath, newPodspec);
  } catch (error) {
    throw new Error(
      `Error updating source location in podspec: ${podspecPath}`
    );
  }
}

/** Use auto to version your cocoapod */
export default class CocoapodsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "cocoapods";

  /** The auto logger */
  logger?: ILogger;

  /** The options of the plugin */
  readonly options: ICocoapodsPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: ICocoapodsPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    this.logger = auto.logger;
    const isQuiet = auto.logger.logLevel === "quiet";
    const isVerbose =
      auto.logger.logLevel === "verbose" ||
      auto.logger.logLevel === "veryVerbose";
    const podLogLevel = isQuiet ? ["--silent"] : isVerbose ? ["--verbose"] : [];

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.modifyConfig.tap(this.name, (config) => ({
      ...config,
      noVersionPrefix: true,
    }));

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () =>
      auto.prefixRelease(getVersion(this.options.podspecPath))
    );

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const previousVersion = getVersion(this.options.podspecPath);
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

        updatePodspecVersion(this.options.podspecPath, releaseVersion);

        await execPromise("git", [
          "commit",
          "-am",
          `"update version: ${releaseVersion} [skip ci]"`,
          "--no-verify",
        ]);

        await execPromise("git", [
          "tag",
          releaseVersion,
          "-m",
          `"Update version to ${releaseVersion}"`,
        ]);
      }
    );

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ bump, canaryIdentifier, dryRun, quiet }) => {
        const pr = getPrNumberFromEnv();

        if (!auto.git || !pr) {
          return;
        }

        const remoteRepo = await (await auto.git.getPullRequest(pr)).data.head
          .repo.clone_url;

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

        await updateSourceLocation(this.options.podspecPath, remoteRepo);

        updatePodspecVersion(this.options.podspecPath, canaryVersion);

        // Publish the canary podspec, committing it isn't needed for specs push
        await this.publishPodSpec(podLogLevel);

        // Reset changes to podspec file since it doesn't need to be committed
        await execPromise("git", ["checkout", this.options.podspecPath]);

        return canaryVersion;
      }
    );

    auto.hooks.beforeShipIt.tapPromise(this.name, async ({ dryRun }) => {
      if (dryRun) {
        auto.logger.log.info(logMessage('dryRun - running "pod lib lint"'));
        const [pod, ...commands] = this.options.podCommand?.split(" ") || [
          "pod",
        ];
        await execPromise(pod, [
          ...commands,
          "lib",
          "lint",
          ...(this.options.flags || []),
          this.options.podspecPath,
        ]);
      }
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);
      await this.publishPodSpec(podLogLevel);
    });
  }

  /**
   *
   */
  async publishPodSpec(podLogLevel: string[]) {
    const [pod, ...commands] = this.options.podCommand?.split(" ") || ["pod"];
    if (!this.options.specsRepo) {
      this.logger?.log.info(logMessage(`Pushing to Cocoapods trunk`));
      await execPromise(pod, [
        ...commands,
        "trunk",
        "push",
        ...(this.options.flags || []),
        this.options.podspecPath,
        ...podLogLevel,
      ]);
      return;
    }

    try {
      const existingRepos = await execPromise(pod, [
        ...commands,
        "repo",
        "list",
      ]);
      if (existingRepos.indexOf("autoPublishRepo") !== -1) {
        this.logger?.log.info("Removing existing autoPublishRepo");
        await execPromise(pod, [
          ...commands,
          "repo",
          "remove",
          "autoPublishRepo",
          ...podLogLevel,
        ]);
      }
    } catch (error) {
      this.logger?.log.warn(
        `Error Checking for existing Specs repositories: ${error}`
      );
    }

    try {
      await execPromise(pod, [
        ...commands,
        "repo",
        "add",
        "autoPublishRepo",
        this.options.specsRepo,
        ...podLogLevel,
      ]);

      this.logger?.log.info(
        logMessage(`Pushing to specs repo: ${this.options.specsRepo}`)
      );

      await execPromise(pod, [
        ...commands,
        "repo",
        "push",
        ...(this.options.flags || []),
        "autoPublishRepo",
        this.options.podspecPath,
        ...podLogLevel,
      ]);
    } catch (error) {
      this.logger?.log.error(
        logMessage(
          `Error pushing to specs repo: ${this.options.specsRepo}. Error: ${error}`
        )
      );
      process.exit(1);
    } finally {
      await execPromise(pod, [
        ...commands,
        "repo",
        "remove",
        "autoPublishRepo",
        ...podLogLevel,
      ]);
    }
  }
}
