import { Auto, IPlugin, execPromise, validatePluginConfiguration, getCurrentBranch, determineNextVersion, DEFAULT_PRERELEASE_BRANCHES } from '@auto-it/core';
import { promisify } from "util";
import * as t from "io-ts";
import * as fs from "fs";
import { inc, ReleaseType } from "semver";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

interface ReleaseTypeArgs {
  /** Args to use when invoking the publishScript during the publish hook */
  publish: string[];
  /** Args to use when invoking the publishScript during the canary hook */
  canary: string[];
  /** Args to use when invoking the publishScript during the next hook */
  next: string[];
}

const pluginOptions = t.partial({
  /** Path to file (from where auto is executed) where the version is stored */
  versionFile: t.string,

  /** Optional script that executes release pipeline stages */
  publishScript: t.string,

  /** Optional publish script args mapping for each release hook, defaults `publish` to ["release"] and the others to ["snapshot"] */
  publishScriptReleaseTypeArgs: t.partial({
    publish: t.array(t.string),
    canary: t.array(t.string),
    next: t.array(t.string),
  })
});

export type IVersionFilePluginOptions = t.TypeOf<typeof pluginOptions>;

/**
 * Reads version file from location specified in config
 */
async function getPreviousVersion(auto: Auto, versionFile: string) {
  auto.logger.veryVerbose.info(`Reading version from file `, versionFile)
  return readFile(versionFile, "utf-8")
}

/** Writes new version to version file at specified location */
async function writeNewVersion(auto: Auto, version: string, versionFile: string) {
  auto.logger.veryVerbose.info(`Writing version to file `, versionFile)
  return writeFile(versionFile, version)
}

/** Reset the scope changes of all the packages  */
async function gitReset(auto: Auto) {
  auto.logger.veryVerbose.info("Hard resetting local changes")
  await execPromise("git", ["reset", "--hard", "HEAD"]);
}

/** Generates canary release notes */
function makeCanaryNotes(canaryVersion: string){
  return `Try this version out locally by upgrading relevant packages to ${canaryVersion}`
}


/**  Plugin to orchestrate releases in a repo where version is maintained in a flat file */
export default class VersionFilePlugin implements IPlugin {
  /** The name of the plugin */
  name = 'version-file';

  /** Version file location */
  readonly versionFile: string;

  /** Release script location */
  readonly publishScript: string | undefined

  /**  */
  readonly publishScriptReleaseTypeArgs: ReleaseTypeArgs;

  /** Initialize the plugin with it's options */
  constructor(options: IVersionFilePluginOptions) {
    this.versionFile = options.versionFile ?? "VERSION";
    this.publishScript = options.publishScript;
    this.publishScriptReleaseTypeArgs = {
      publish: ['release'],
      canary: ['snapshot'],
      next: ['snapshot'],
      ...options.publishScriptReleaseTypeArgs ?? {}
    };
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
        // Seal versions via commit and tag
        await writeNewVersion(auto, newVersion, this.versionFile)
        await execPromise("git", ["commit", "-am", `"Bump version to: v${newVersion} [skip ci]"`]);
        await execPromise("git", [
          "tag",
          `v${newVersion}`
        ]);
        auto.logger.verbose.info("Successfully versioned repo");
      } else {
        auto.logger.log.error(`Error: Unable to calculate new version based off of ${lastVersion} being bumped with a ${bump} release`)
        throw new Error ("Version bump failed")
      }
    });

    auto.hooks.publish.tapPromise(this.name, async () => {

      // Call release script if provided
      if(this.publishScript){
        auto.logger.log.info(`Calling release script in repo at ${this.publishScript}`);
        await execPromise(this.publishScript, this.publishScriptReleaseTypeArgs.publish)
      } else {
        auto.logger.log.info("Skipping calling release script in repo since none was provided");
      }
      
      // push tag and version change commit up
      await execPromise("git", ["push", auto.remote, branch || auto.baseBranch, "--tags"]);
    });

    auto.hooks.canary.tapPromise(this.name, async ({ bump, canaryIdentifier}) => {

      // Figure out canary version
      const lastRelease =
        (await auto.git!.getLatestRelease()) ||
        (await auto.git?.getLastTagNotInBaseBranch(prereleaseBranch)) ||
        (await getPreviousVersion(auto, this.versionFile));
      const current = await auto.getCurrentVersion(lastRelease);
      const nextVersion = inc(current, bump as ReleaseType);
      const canaryVersion = `${nextVersion}-${canaryIdentifier}`;

      auto.logger.log.info(`Marking version as ${canaryVersion}`);

      // Write Canary version
      await writeNewVersion(auto, canaryVersion, this.versionFile)

      // Ship canary release if release script is provided
      if(this.publishScript){
        auto.logger.log.info(`Calling release script in repo at ${this.publishScript}`);
        await execPromise(this.publishScript, this.publishScriptReleaseTypeArgs.canary);
      } else {
        auto.logger.log.info("Skipping calling release script in repo since none was provided");
      }


      // Reset temporary canary versioning
      await gitReset(auto);

      return {
        newVersion: canaryVersion,
        details: makeCanaryNotes(canaryVersion),
      };
    });

    auto.hooks.next.tapPromise(this.name, async (preReleaseVersions, { bump }) => {

      // Figure out next version
      const lastRelease = await auto.git!.getLatestRelease();
      const currentBranch = await getCurrentBranch();

      const latestTagInBranch = await (currentBranch === auto.baseBranch
        ? auto.git?.getLatestTagInBranch()
        : auto.git?.getLastTagNotInBaseBranch(prereleaseBranch));

      const latestTag =
        latestTagInBranch ||
        (await getPreviousVersion(auto, this.versionFile));

      const nextVersion = determineNextVersion(
        lastRelease,
        latestTag,
        bump,
        prereleaseBranch
      );

      const prefixedVersion = auto.prefixRelease(nextVersion);
      preReleaseVersions.push(prefixedVersion);

      auto.logger.log.info(`Marking version as ${prefixedVersion}`);

      // Write version to file
      await writeNewVersion(auto, prefixedVersion, this.versionFile)

      // ship next release if release script is provided
      if(this.publishScript){
        auto.logger.log.info(`Calling release script in repo at ${this.publishScript}`);
        await execPromise(this.publishScript, this.publishScriptReleaseTypeArgs.next);
      } else {
        auto.logger.log.info("Skipping calling release script in repo since none was provided");
      }

      // Push next tag
      await execPromise("git", [
        "tag",
        prefixedVersion
      ]);
      await execPromise("git", ["push", auto.remote, branch, "--tags"]);

      return preReleaseVersions
    });

  }
}
