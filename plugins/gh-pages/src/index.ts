import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
  SEMVER,
} from "@auto-it/core";
import { execSync } from "child_process";
import * as t from "io-ts";
import endent from "endent";

const required = t.interface({
  /** The directory to push to gh-pages */
  dir: t.string,
});

const optional = t.partial({
  /** A command to build the documenation website */
  buildCommand: t.string,
  /** The branch to push to */
  branch: t.string,
  /** A label to look for and always publish the docs */
  label: t.string,
});

const pluginOptions = t.intersection([required, optional]);

export type IGhPagesPluginOptions = t.TypeOf<typeof pluginOptions>;

const defaults = {
  branch: "gh-pages",
  label: "documentation",
};

/** Automate publishing to your gh-pages documentation website. */
export default class GhPagesPlugin implements IPlugin {
  /** The name of the plugin */
  name = "gh-pages";

  /** The options of the plugin */
  readonly options: IGhPagesPluginOptions & typeof defaults;

  /** Initialize the plugin with it's options */
  constructor(options: IGhPagesPluginOptions) {
    this.options = { ...defaults, ...options };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.beforeShipIt.tapPromise(
      this.name,
      async ({ releaseType, dryRun }) => {
        if (releaseType !== "latest" || !auto.git || dryRun) {
          return;
        }

        const bump = await auto.getVersion();

        // If it's a bump the 'afterRelease' hook will release the docs
        if (bump !== SEMVER.noVersion) {
          return;
        }

        const sha = await auto.git.getSha();
        const pr = await auto.git.matchCommitToPr(sha);

        if (!pr) {
          return;
        }

        const hasDocumentationLabel = pr.labels.includes(this.options.label);

        if (!hasDocumentationLabel) {
          return;
        }

        // If: skip-release + w/documentation label then we will push to gh-pages
        await auto.setGitUser();
        await this.releaseGhPages(auto);
      }
    );

    auto.hooks.afterRelease.tapPromise(this.name, async ({ response }) => {
      if (!response) {
        return;
      }

      const releases = Array.isArray(response) ? response : [response];
      const isPrerelease = releases.some((release) => release.data.prerelease);

      if (isPrerelease) {
        return;
      }

      await this.releaseGhPages(auto);
    });
  }

  /** Release to gh-pages */
  private async releaseGhPages(auto: Auto) {
    if (this.options.buildCommand) {
      execSync(this.options.buildCommand);
    }

    try {
      const isVerbose =
        auto.logger.logLevel === "verbose" ||
        auto.logger.logLevel === "veryVerbose";

      await execPromise("npx", [
        "push-dir",
        "--cleanup",
        isVerbose && "--verbose",
        `--remote=${auto.remote}`,
        `--dir=${this.options.dir}`,
        `--branch=${this.options.branch}`,
        '--message="Update docs [skip ci]"',
      ]);
    } catch (error) {
      auto.logger.log.error(
        "Oh no! It looks like there was trouble publishing to GitHub Pages 😢"
      );

      if (error.message.includes("git not clean")) {
        auto.logger.log.error(endent`
          Your repo currently has uncommitted files in it.
          For the gh-pages plugin to work your git state must be clean.
          You can do one of two things to fix this:

          1. Add the files to your gitignore (ex: your built gh-pages website dist files)
          2. Commit the files (ex: Something you want to track in the repo)
        `);

        const status = await execPromise("git", ["status", "--porcelain"]);

        if (status) {
          auto.logger.log.error("Uncomitted Changes:\n", status);
        }
      }

      throw error;
    }

    auto.logger.log.success("Successfully deployed to GitHub Pages!");
  }
}
