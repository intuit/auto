import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
  getCurrentBranch
} from "@auto-it/core";
import { IExtendedCommit } from "@auto-it/core/dist/log-parse";

import * as t from "io-ts";
import path from "path";
import { inc, ReleaseType } from "semver";

/** Global functions for usage in module */
const defaultSnapshotSuffix = "-SNAPSHOT";

const pluginOptions = t.partial({
  /** The gradle binary to release the project with */
  gradleCommand: t.string,

  /** A list of gradle command customizations to pass to gradle */
  gradleOptions: t.array(t.string),
});

export type IGradleReleasePluginPluginOptions = t.TypeOf<typeof pluginOptions>;

export interface IGradleProperties {
  /** version */
  version?: string;

  /** snapshotSuffix - property used by release plugin to override the snapshot string */
  snapshotSuffix?: string;

  /** publish task - exists if maven-publish plugin is installed */
  publish?: string;
}

/**
 * Builds properties object from gradle properties command
 *
 * @param gradleCommand - base gradle command
 * @param gradleOptions - options to pass to gradle command
 * @returns properties wrapped in a promise
 */
export async function getProperties(
  gradleCommand: string,
  gradleOptions: string[]
): Promise<IGradleProperties> {
  const properties = (
    await execPromise(gradleCommand, ["-q", "properties", ...gradleOptions])
  )
    .split("\n")
    .map((line) => /([^:\s]+):\s?(.+)/.exec(line) || [])
    .map(([, key, value]) => key && value && { [key]: value })
    .filter((el) => el);

  return Object.assign({}, ...properties);
}

/**
 * Retrieves version from gradle properties. Will throw error if version does not exist
 *
 * @param gradleCommand - base gradle command
 * @param gradleOptions - options to pass to gradle command
 * @returns version wrapped in a promise
 */
async function getVersion(
  gradleCommand: string,
  gradleOptions: string[]
): Promise<string> {
  const {
    version = "0.0.0",
    snapshotSuffix = defaultSnapshotSuffix,
  } = await getProperties(gradleCommand, gradleOptions);

  return version.replace(snapshotSuffix, "");
}

/** A plugin to release java projects with gradle */
export default class GradleReleasePluginPlugin implements IPlugin {
  /** The name of the plugin */
  name = "gradle";

  /** The options of the plugin */
  readonly options: Required<IGradleReleasePluginPluginOptions>;

  /** cached properties */
  private properties: IGradleProperties = {};

  /** should this release be a snapshot release */
  private snapshotRelease = false;

  /** Initialize the plugin with it's options */
  constructor(options: IGradleReleasePluginPluginOptions = {}) {
    this.options = {
      gradleCommand: options?.gradleCommand
        ? path.join(process.cwd(), options.gradleCommand)
        : "/usr/bin/gradle",
      gradleOptions: options.gradleOptions || [],
    };
  }

  /** update gradle version and commit */
  private readonly updateGradleVersion = async (
    version: string,
    commitMsg?: string,
    buildFlag = true
  ) => {
    if (buildFlag) {
      // don't create release, tag, or commit since auto will do this
      await execPromise(this.options.gradleCommand, [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=${version}`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
        ...this.options.gradleOptions,
      ]);
    } else {
      await execPromise(this.options.gradleCommand, [
        "updateVersion",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=${version}`,
        ...this.options.gradleOptions,
      ]);
    }

    await execPromise("git", [
      "commit",
      "-am",
      `"${commitMsg || `update version: ${version} [skip ci]"`}"`,
      "--no-verify",
    ]);
  };

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.beforeRun.tap(this.name, async () => {
      this.properties = await getProperties(
        this.options.gradleCommand,
        this.options.gradleOptions
      );

      const {
        version = "",
        snapshotSuffix = defaultSnapshotSuffix,
      } = this.properties;
      if (version.endsWith(snapshotSuffix)) {
        this.snapshotRelease = true;
      }
    });

    auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
      logParse.hooks.omitCommit.tap(this.name, (commit: IExtendedCommit) => {
        if (commit.subject.includes("[Gradle Release Plugin]")) {
          return true;
        }
      });
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      return auto.prefixRelease(
        await getVersion(this.options.gradleCommand, this.options.gradleOptions)
      );
    });

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const previousVersion = await getVersion(
          this.options.gradleCommand,
          this.options.gradleOptions
        );

        const releaseVersion =
          // After release we bump the version by a patch and add -SNAPSHOT
          // Given that we do not need to increment when versioning, since
          // it has already been done
          this.snapshotRelease && bump === "patch"
            ? previousVersion
            : inc(previousVersion, bump as ReleaseType);

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

        await this.updateGradleVersion(
          releaseVersion,
          `release version: ${releaseVersion} [skip ci]`
        );

        const newVersion = auto.prefixRelease(releaseVersion);

        // Ensure tag is on this commit, changelog will be added automatically
        await execPromise("git", [
          "tag",
          newVersion,
          "-m",
          `"Update version to ${newVersion}"`,
        ]);
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      const { publish } = this.properties;

      if (publish) {
        await execPromise(this.options.gradleCommand, [
          "publish",
          ...this.options.gradleOptions,
        ]);
      }

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);
    });

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ dryRun, quiet }) => {
        const releaseVersion = await getVersion(
          this.options.gradleCommand,
          this.options.gradleOptions
        );

        const canaryVersion = `${releaseVersion}${defaultSnapshotSuffix}`;

        if (dryRun) {
          if (quiet) {
            console.log(canaryVersion);
          } else {
            auto.logger.log.info(`Would have published: ${releaseVersion}`);
          }

          return canaryVersion;
        }

        const { publish } = this.properties;

        if (publish) {
          await execPromise(this.options.gradleCommand, [
            "publish",
            ...this.options.gradleOptions,
          ]);
        }

        return canaryVersion;
      }
    );

    auto.hooks.next.tapPromise(
      this.name,
      async (preReleaseVersions, { dryRun }) => {
        const branch = getCurrentBranch() || "";

        const {version} = await getProperties(
          this.options.gradleCommand,
          this.options.gradleOptions
        );

        // Don't need to increment version since version should have already 
        // been incremented by canary during PR, so take the current version
        // and publish it
        if (version) {
          preReleaseVersions.push(version);
        }

        if (dryRun) {
          auto.logger.log.info(`Would have published: ${version}`);
          return preReleaseVersions;
        }

        await execPromise("git", [
          "tag",
          version ?? "",
          "-m",
          `"Tag pre-release: ${version}"`,
        ]);

        await execPromise("git", ["push", auto.remote, branch, "--tags"]);

        const { publish } = this.properties;

        if (publish) {
          await execPromise(this.options.gradleCommand, [
            "publish",
            ...this.options.gradleOptions,
          ]);
        }

        return preReleaseVersions;
      }
    );

    auto.hooks.afterShipIt.tapPromise(this.name, async ({ dryRun }) => {
      if (!this.snapshotRelease || dryRun) {
        if (dryRun) {
          auto.logger.log.info(`+++++AFTERSHIPIT
            `);
        }

        return;
      }

      const { snapshotSuffix = defaultSnapshotSuffix } = this.properties;
      const releaseVersion = await getVersion(
        this.options.gradleCommand,
        this.options.gradleOptions
      );

      // snapshots precede releases, so if we had a minor/major release,
      // then we need to set up snapshots on the next version
      const newVersion = `${inc(releaseVersion, "patch")}${snapshotSuffix}`;

      await this.updateGradleVersion(
        newVersion,
        `prepare snapshot version: ${newVersion} [skip ci]`,
        false
      );

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);
    });
  }
}
