import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
  getCurrentBranch,
  determineNextVersion,
  DEFAULT_PRERELEASE_BRANCHES,
} from "@auto-it/core";
import { inc, ReleaseType } from "semver";
import * as t from "io-ts";

import {
  plistValueRegex,
  getPlistContents,
  writePlistContents,
} from "./utilities";

/**
 * Read the value of a version key from a plist file
 *
 * @param plistPath - Path to the plist file, relative to cwd
 * @param versionKey - The plist key whose value holds the version string
 */
export function getVersion(plistPath: string, versionKey: string): string {
  const contents = getPlistContents(plistPath);
  const match = plistValueRegex(versionKey).exec(contents);

  if (!match?.[2]) {
    throw new Error(
      `Version key "${versionKey}" not found in plist: ${plistPath}`
    );
  }

  return match[2];
}

/**
 * Write a new version into the plist file, preserving all other content.
 * Optionally updates a second key (e.g. CFBundleVersion) with the same value.
 *
 * @param plistPath - Path to the plist file, relative to cwd
 * @param version - The new version string to write
 * @param versionKey - The plist key to update
 * @param buildNumberKey - Optional secondary key to update (e.g. CFBundleVersion)
 */
export function updatePlistVersion(
  plistPath: string,
  version: string,
  versionKey: string,
  buildNumberKey?: string
) {
  let contents = getPlistContents(plistPath);

  const updated = contents.replace(plistValueRegex(versionKey), `$1${version}$3`);

  if (updated === contents) {
    throw new Error(
      `Could not update key "${versionKey}" in plist: ${plistPath}`
    );
  }

  contents = updated;

  if (buildNumberKey) {
    contents = contents.replace(
      plistValueRegex(buildNumberKey),
      `$1${version}$3`
    );
  }

  writePlistContents(plistPath, contents);
}

const pluginOptions = t.intersection([
  t.interface({
    /** Relative path to the Info.plist file, or an array of paths */
    plistPath: t.union([t.string, t.array(t.string)]),
  }),
  t.partial({
    /**
     * The plist key that stores the human-readable version string.
     * Defaults to "CFBundleShortVersionString".
     */
    versionKey: t.string,

    /**
     * An optional second plist key to keep in sync (e.g. "CFBundleVersion").
     * When provided this key is updated with the same value as versionKey.
     */
    buildNumberKey: t.string,

    /**
     * Optional path to a script that runs your publish pipeline.
     * Called during the publish, canary, and next hooks.
     */
    publishScript: t.string,
  }),
]);

export type IPlistPluginOptions = t.TypeOf<typeof pluginOptions>;

const DEFAULT_VERSION_KEY = "CFBundleShortVersionString";

/** Use auto to version Apple platform projects via an Info.plist file */
export default class PlistPlugin implements IPlugin {
  /** The name of the plugin */
  name = "plist";

  /** Resolved plugin options */
  readonly options: IPlistPluginOptions;

  /** Normalised list of plist paths to update */
  private get paths(): string[] {
    return typeof this.options.plistPath === "string"
      ? [this.options.plistPath]
      : this.options.plistPath;
  }

  /** The plist key used for the version string */
  private get versionKey(): string {
    return this.options.versionKey ?? DEFAULT_VERSION_KEY;
  }

  constructor(options: IPlistPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points */
  apply(auto: Auto) {
    const prereleaseBranches =
      auto.config?.prereleaseBranches ?? DEFAULT_PRERELEASE_BRANCHES;

    const branch = getCurrentBranch();
    const prereleaseBranch =
      branch && prereleaseBranches.includes(branch)
        ? branch
        : prereleaseBranches[0];

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    // Plist versions don't carry a "v" prefix
    auto.hooks.modifyConfig.tap(this.name, (config) => ({
      ...config,
      noVersionPrefix: true,
    }));

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      return auto.prefixRelease(getVersion(this.paths[0], this.versionKey));
    });

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const previousVersion = getVersion(this.paths[0], this.versionKey);
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

        this.paths.forEach((p) => {
          updatePlistVersion(
            p,
            releaseVersion,
            this.versionKey,
            this.options.buildNumberKey
          );
        });

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
        if (!auto.git) {
          return;
        }

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

        this.paths.forEach((p) => {
          updatePlistVersion(
            p,
            canaryVersion,
            this.versionKey,
            this.options.buildNumberKey
          );
        });

        if (this.options.publishScript) {
          auto.logger.log.info(
            `Calling publish script: ${this.options.publishScript}`
          );
          await execPromise(this.options.publishScript, ["canary"]);
        }

        // Reset temporary canary version — it should never be committed
        await Promise.all(
          this.paths.map((p) => execPromise("git", ["checkout", p]))
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

        this.paths.forEach((p) => {
          updatePlistVersion(
            p,
            prerelease,
            this.versionKey,
            this.options.buildNumberKey
          );
        });

        if (this.options.publishScript) {
          auto.logger.log.info(
            `Calling publish script: ${this.options.publishScript}`
          );
          await execPromise(this.options.publishScript, ["next"]);
        }

        await execPromise("git", [
          "tag",
          prerelease,
          "-m",
          `"Tag pre-release: ${prerelease}"`,
        ]);

        await execPromise("git", [
          "push",
          auto.remote,
          branch || auto.baseBranch,
          "--tags",
        ]);

        // Reset — pre-release plist changes are not committed
        await Promise.all(
          this.paths.map((p) => execPromise("git", ["checkout", p]))
        );

        return preReleaseVersions;
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      if (this.options.publishScript) {
        auto.logger.log.info(
          `Calling publish script: ${this.options.publishScript}`
        );
        await execPromise(this.options.publishScript, ["release"]);
      }

      await execPromise("git", [
        "push",
        "--atomic",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        getCurrentBranch() || auto.baseBranch,
      ]);
    });
  }
}
