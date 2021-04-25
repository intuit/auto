import {
  Auto,
  execPromise,
  getCurrentBranch,
  IPlugin,
  validatePluginConfiguration,
} from "@auto-it/core";
import { inc, ReleaseType } from "semver";
import * as t from "io-ts";
import stripAnsi from "strip-ansi";

const pluginOptions = t.partial({
  manageVersion: t.boolean,
});

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

    /** Calls sbt in the client and returns cleaned up logs */
    async function sbtClient(...args: string[]) {
      const output = await execPromise("sbt", ["--client", ...args]);
      const cleanOutput = stripAnsi(output).replace(/(.*\n)*^>.*$/m, "").trim();
      return cleanOutput;
    }

    /** Read version from sbt */
    async function sbtGetVersion() {
      const output = await sbtClient("print version");
      const version = output.split("\n").shift();
      if (!version) {
        throw new Error(`Failed to read version from sbt: ${output}`);
      }

      auto.logger.log.info(`Got version from sbt: ${version}`);
      return version;
    }

    /** Set version in sbt to the given value */
    async function sbtSetVersion(version: string) {
      auto.logger.log.info(`Set version in sbt to "${version}"`);
      return sbtClient(`set every version := \\"${version}\\"`);
    }

    /** Run sbt publish */
    async function sbtPublish() {
      auto.logger.log.info("Run sbt publish");
      const publishLog = await sbtClient("publish");
      auto.logger.log.info("Output:\n" + publishLog);
      return publishLog;
    }

    /** Construct canary version using Auto-provided suffix */
    async function getCanaryVersion(canaryIdentifier: string) {
      const lastTag = await getTag();
      const lastVersion = lastTag.replace(/^v/, "");
      return `${lastVersion}${canaryIdentifier}-SNAPSHOT`;
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

        if (this.options.manageVersion) {
          await sbtSetVersion(newTag);
        }
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

        const canaryVersion = this.options.manageVersion
          ? await getCanaryVersion(canaryIdentifier)
          : await sbtGetVersion();
        auto.logger.log.info(`Canary version: ${canaryVersion}`);

        if (dryRun) {
          if (quiet) {
            console.log(canaryVersion);
          } else {
            auto.logger.log.info(`Would have published: ${canaryVersion}`);
          }

          return;
        }

        if (this.options.manageVersion) {
          await sbtSetVersion(canaryVersion);
        }

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
