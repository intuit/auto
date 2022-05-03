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
  /** The command to use for `fastlane` if it needs to be separate like `fastlane action increment_version_numer` */
  fastlaneCommand: t.string,
  /** xcode project path */
  xcodeproj: t.string,
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

        await execPromise("fastlane", [
          "action", 
          "increment_version_number",
          `version_number:${releaseVersion}`,
          `xcodeproj:${this.options.xcodeproj}`,
          ])

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
  }
