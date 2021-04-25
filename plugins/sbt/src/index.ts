import {
  Auto,
  execPromise,
  getCurrentBranch,
  IPlugin,
  validatePluginConfiguration,
} from "@auto-it/core";
import { inc, ReleaseType } from "semver";
import * as t from "io-ts";

const pluginOptions = t.partial({});

export type ISbtPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Publish Scala projects with sbt */
export default class SbtPlugin implements IPlugin {
  /** The name of the plugin */
  name = "sbt";

  /** The options of the plugin */
  readonly options: ISbtPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: ISbtPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    // exact copy-paste from the git-tag plugin
    /** Get the latest tag in the repo, if none then the first commit */
    async function getTag() {
      try {
        return await auto.git!.getLatestTagInBranch();
      } catch (error) {
        return auto.prefixRelease("0.0.0");
      }
    }

    async function sbtClient(...args: string[]) {
      return await execPromise("sbt", ["--client", ...args]);
    }

    async function sbtSetVersion(version: string) {
      auto.logger.log.info(`Set version in sbt to ${version}`);
      return await sbtClient(`set every version := \\"${version}\\"`);
    }

    async function sbtPublish() {
      auto.logger.log.info("Run sbt publish");
      return await sbtClient("publish");
    }

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    // exact copy-paste from the git-tag plugin
    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      if (!auto.git) {
        throw new Error(
          "Can't calculate previous version without Git initialized!",
        );
      }

      return getTag();
    });

    // exact copy-paste from the git-tag plugin
    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        if (!auto.git) {
          return;
        }

        const lastTag = await getTag();
        const newTag = inc(lastTag, bump as ReleaseType);

        if (dryRun && newTag) {
          if (quiet) {
            console.log(newTag);
          } else {
            auto.logger.log.info(`Would have published: ${newTag}`);
          }

          return;
        }

        if (!newTag) {
          auto.logger.log.info("No release found, doing nothing");
          return;
        }

        const prefixedTag = auto.prefixRelease(newTag);

        auto.logger.log.info(`Tagging new tag: ${lastTag} => ${prefixedTag}`);
        await execPromise("git", [
          "tag",
          prefixedTag,
          "-m",
          `"Update version to ${prefixedTag}"`,
        ]);

        await sbtSetVersion(newTag);
      },
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      await sbtPublish();

      auto.logger.log.info("Pushing new tag to GitHub");
      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        getCurrentBranch() || auto.baseBranch,
      ]);
    });

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ canaryIdentifier, dryRun, quiet }) => {
        if (!auto.git) {
          return;
        }

        const lastRelease = await auto.git.getLatestRelease();
        const lastVersion = await auto.getCurrentVersion(lastRelease);
        const canaryVersion = `${lastVersion}-${canaryIdentifier}`;
        auto.logger.log.info(`Canary version: ${canaryVersion}`);

        if (dryRun) {
          if (quiet) {
            console.log(canaryVersion);
          } else {
            auto.logger.log.info(`Would have published: ${canaryVersion}`);
          }

          return;
        }

        await sbtSetVersion(canaryVersion);
        const publishLogs = await sbtPublish();

        auto.logger.verbose.info("Successfully published canary version");
        return {
          newVersion: canaryVersion,
          details: [
            "```",
            publishLogs,
            "```",
          ].join("\n"),
        };
      },
    );
  }
}
