import { Auto, IPlugin, execPromise, validatePluginConfiguration, getCurrentBranch } from '@auto-it/core';
import * as t from "io-ts";
import * as fs from "fs";

import { inc, ReleaseType } from "semver";

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
 
  fs.writeFile('/Users/joe/test.txt', version, err => {
    auto.logger.log.error(err)
    throw new Error("Failed to write version to file")
  })
}

/** Creates a git tag for the specified version */
async function sealVersion(version: string){
  await execPromise("git", ["commit", "-am", "'Update versions'"]);
  await execPromise("git", [
    "tag",
    version,
    "-m",
    `"Update version to ${version}"`,
  ]);
}

/** Pushes changes to current branch */
async function gitPush(auto:Auto) {
  const branch = getCurrentBranch()
  await execPromise("git", ["push", auto.remote, branch, "--tags"]);
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
      
      await sealVersion(version)
      await gitPush(auto)
    });
  }
}
