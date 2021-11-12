import { Auto, IPlugin, execPromise, validatePluginConfiguration, getCurrentBranch, determineNextVersion, DEFAULT_PRERELEASE_BRANCHES } from '@auto-it/core';
import * as t from "io-ts";

import { inc, ReleaseType } from "semver";

const VERSION_COMMIT_MESSAGE = `'"Bump version to: %s [skip ci]"'`;

const pluginOptions = t.partial({
  /** Path to file (from where auto is executed) where the version is stored */
  versionFile: t.string,

  /** Bazel script that executes release pipeline stages */
  releaseScript: t.string
});

export type IBazelPluginOptions = t.TypeOf<typeof pluginOptions>;

/**
 * Reads version file from location specified in config
 */
async function getPreviousVersion(auto: Auto, versionFile: string) {
  auto.logger.veryVerbose.info(`Reading version from file `, versionFile)
  try {
    return await execPromise("cat", [versionFile])
  } catch (e){
    auto.logger.log.error("Error, looks like the version file doesn't exist or is unreadable")
  }

  return ""
}

/** Writes new version to version file at specified location */
async function writeNewVersion(auto: Auto, version: string, versionFile: string) {
  auto.logger.veryVerbose.info(`Writing version to file `, versionFile)
 
  await execPromise("echo", [version, ">", versionFile]);
}

/** Reset the scope changes of all the packages  */
async function gitReset() {
  await execPromise("git", ["reset", "--hard", "HEAD"]);
}

/** Generates canary release notes */
function makeCanaryNotes(canaryVersion: string){
  return `Try this version out locally by upgrading relevant packages to ${canaryVersion}`
}


/**  Plugin to orchestrate releases in a Bazel repo */
export default class BazelPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'bazel';

  /** Version file location */
  readonly versionFile: string;

  /** Release script location */
  readonly releaseScript: string

  /** Initialize the plugin with it's options */
  constructor(options: IBazelPluginOptions) {
    this.versionFile = options.versionFile ?? "VERSION";
    this.releaseScript = options.releaseScript ?? "./tools/release.sh"
  }


  /** Tap into auto plugin points. */
  apply(auto: Auto) {

    const prereleaseBranches =
      auto.config?.prereleaseBranches || DEFAULT_PRERELEASE_BRANCHES;

    const branch = getCurrentBranch();
    // if ran from baseBranch we publish the prerelease to the first
    // configured prerelease branch
    const prereleaseBranch =
      branch && prereleaseBranches.includes(branch)
        ? branch
        : prereleaseBranches[0];

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, () =>{
      return getPreviousVersion(auto, this.versionFile)
    });

    auto.hooks.version.tapPromise( this.name, async ({ bump }) => {
      const lastVersion = await getPreviousVersion(auto, this.versionFile)
      const newVersion = inc(lastVersion, bump as ReleaseType);

      auto.logger.log.info(`Calculated new version as: ${newVersion}`)

      if (newVersion){
        return writeNewVersion(auto, newVersion, this.versionFile)
      } 
      
      auto.logger.log.error(`Error: Unable to calculate new version based off of ${lastVersion} being bumped with a ${bump} release`)
      throw new Error ("Version bump failed")
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      auto.logger.log.info(`Calling release script in repo at ${this.releaseScript}`);

      await execPromise(this.releaseScript, ["release"]);

      const version = await getPreviousVersion(auto, this.versionFile)
      
      // Seal versions via commit and tag
      await execPromise("git", ["commit", "-am", VERSION_COMMIT_MESSAGE]);
      await execPromise("git", [
        "tag",
        version
      ]);
      await execPromise("git", ["push", auto.remote, branch, "--tags"]);
    });

    auto.hooks.canary.tapPromise(this.name, async ({ bump, canaryIdentifier}) => {

      // Figure out canary version
      const lastRelease = await auto.git!.getLatestRelease();
      const [, latestTag = lastRelease] = await auto.git!.getLatestTagInBranch()
      const current = await auto.getCurrentVersion(lastRelease);
      const canaryVersion = determineNextVersion(
        latestTag,
        current,
        bump,
        canaryIdentifier
      );

      // Write Canary version
      await writeNewVersion(auto, canaryVersion, this.versionFile)

      // Ship canary release
      auto.logger.log.info(`Calling release script in repo at ${this.releaseScript}`);
      await execPromise(this.releaseScript, ["snapshot"]);

      // Reset temporary canary versioning
      await gitReset();

      return {
        newVersion: canaryVersion,
        details: makeCanaryNotes(canaryVersion),
      };
    });

    auto.hooks.next.tapPromise(this.name, async (preReleaseVersions, { bump }) => {

      // Figure out next version
      const lastRelease = await auto.git!.getLatestRelease();
      const latestTag =
        (await auto.git?.getLastTagNotInBaseBranch(prereleaseBranch)) ||
        (await getPreviousVersion(auto, this.versionFile));
      const nextVersion = determineNextVersion(
        lastRelease,
        latestTag,
        bump,
        prereleaseBranch
      );
      const prefixedVersion = auto.prefixRelease(nextVersion);
      preReleaseVersions.push(prefixedVersion);

      auto.logger.log.info(`Marking version as ${nextVersion}`);

      // Write version to file
      await writeNewVersion(auto, nextVersion, this.versionFile)

      // Ship canary release
      auto.logger.log.info(`Calling release script in repo at ${this.releaseScript}`);
      await execPromise(this.releaseScript, ["snapshot"]);

      // Push next tag
      await execPromise("git", [
        "tag",
        prefixedVersion
      ]);
      await execPromise("git", ["push", auto.remote, branch, "--tags"]);

      // Reset temporary next versioning
      await gitReset();

      return preReleaseVersions
    });

  }
}
