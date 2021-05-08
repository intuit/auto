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
  setCanaryVersion: t.boolean,
  publishCommand: t.string,
});

export type ISbtPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Calls sbt in the client and returns cleaned up logs */
export async function sbtClient(input: string): Promise<string> {
  const output = await execPromise("sbt", ["--client", input]);
  const cleanOutput = stripAnsi(output).replace(/(.*\n)*^>.*$/m, "").trim();
  return cleanOutput;
}

/** Read version from sbt */
export async function sbtGetVersion(): Promise<string> {
  // in multi-module projects, we want to get only ThisBuild/version
  await sbtClient("set version/aggregate := false");
  const output = await sbtClient("print version");
  const version = output.split("\n").shift()?.trim();
  if (!version) {
    throw new Error(`Failed to read version from sbt: ${output}`);
  }

  return version;
}

/** Set version in sbt to the given value */
export async function sbtSetVersion(version: string): Promise<string> {
  return sbtClient(`set every version := \\"${version}\\"`);
}

/** Run sbt publish */
export async function sbtPublish(command?: string): Promise<string> {
  return sbtClient(command || "publish");
}

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

        auto.logger.verbose.info(`Set version in sbt to "${newTag}"`);
        await sbtSetVersion(newTag);
      },
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      auto.logger.verbose.info("Run sbt publish");
      const publishLogs = await sbtPublish(this.options.publishCommand);
      auto.logger.verbose.info("Output:\n", publishLogs);

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

        /** Construct canary version using Auto-provided suffix */
        const constructCanaryVersion = async () => {
          const lastTag = await getTag();
          const lastVersion = lastTag.replace(/^v/, "");
          return `${lastVersion}${canaryIdentifier}-SNAPSHOT`;
        };

        const canaryVersion = this.options.setCanaryVersion
          ? await constructCanaryVersion()
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

        if (this.options.setCanaryVersion) {
          auto.logger.verbose.info(`Set version in sbt to "${canaryVersion}"`);
          await sbtSetVersion(canaryVersion);
        }

        auto.logger.verbose.info("Run sbt publish");
        const publishLogs = await sbtPublish(this.options.publishCommand);
        auto.logger.verbose.info("Output:\n", publishLogs);

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
