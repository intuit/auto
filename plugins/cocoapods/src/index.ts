import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
} from "@auto-it/core";

import { inc, ReleaseType } from "semver";

import * as t from "io-ts";

import { getPodspecContents, writePodspecContents } from "./utilities";

const logPrefix = "[Cocoapods-Plugin]";

/** Regex used to pull the version line from the spec */
const versionRegex = /\.version\s*=\s*['|"](?<version>\d+\.\d+\.\d+)['|"]/;
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
 * Updates the version in the podspec to the supplied version
 *
 * @param podspecPath - The relative path to the podspec file
 * @param version - The version to update the podspec to
 */
export async function updatePodspecVersion(
  podspecPath: string,
  version: string
) {
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

      await execPromise("git", [
        "commit",
        "-am",
        `"update version: ${version} [skip ci]"`,
        "--no-verify",
      ]);
    }
  } catch (error) {
    throw new Error(`Error updating version in podspec: ${podspecPath}`);
  }
}

/** Use auto to version your cocoapod */
export default class CocoapodsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "cocoapods";

  /** The options of the plugin */
  readonly options: ICocoapodsPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: ICocoapodsPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
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

    auto.hooks.version.tapPromise(this.name, async (version) => {
      const previousVersion = getVersion(this.options.podspecPath);
      const releaseVersion = inc(previousVersion, version as ReleaseType);

      if (!releaseVersion) {
        throw new Error(
          `Could not increment previous version: ${previousVersion}`
        );
      }

      await updatePodspecVersion(this.options.podspecPath, releaseVersion);
      await execPromise("git", [
        "tag",
        releaseVersion,
        "-m",
        `"Update version to ${releaseVersion}"`,
      ]);
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);

      if (!this.options.specsRepo) {
        auto.logger.log.info(logMessage(`Pushing to Cocoapods trunk`));
        await execPromise("pod", ["trunk", "push", this.options.podspecPath]);
        return;
      }

      try {
        await execPromise("pod", [
          "repo",
          "add",
          "autoPublishRepo",
          this.options.specsRepo,
        ]);

        auto.logger.log.info(
          logMessage(`Pushing to specs repo: ${this.options.specsRepo}`)
        );

        await execPromise("pod", [
          "repo",
          "push",
          "autoPublishRepo",
          this.options.podspecPath,
        ]);
      } catch (error) {
        auto.logger.log.error(
          logMessage(
            `Error pushing to specs repo: ${this.options.specsRepo}. Error: ${error}`
          )
        );
        process.exit(1);
      } finally {
        await execPromise("pod", ["repo", "remove", "autoPublishRepo"]);
      }
    });
  }
}
