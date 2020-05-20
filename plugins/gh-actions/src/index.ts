import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
} from "@auto-it/core";
import GitTagPlugin from "@auto-it/git-tag";
import fs from "fs";
import { major } from "semver";
import * as t from "io-ts";

/** get all tags in repo */
const getAllTags = async () => {
  try {
    return (await execPromise("git", ["tag", "--sort=taggerdate"])).split("\n");
  } catch (error) {
    return [];
  }
};

/** Get the newest tag in the branch */
const newestTag = async () => {
  const allTags = (await getAllTags()).filter((tag) => !tag.match(/^v\d+$/));

  if (!allTags.length) {
    throw new Error("No tag found in repo");
  }

  return allTags[allTags.length - 1];
};

const pluginOptions = t.partial({
  /** A list of files or globs to update the tag with */
  files: t.array(t.string),
});

export type IGhActionsPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Automate the publishing of GitHub actions */
export default class GhActionsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "gh-actions";

  /** The options of the plugin */
  readonly options: IGhActionsPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IGhActionsPluginOptions) {
    this.options = options;

    if (!this.options.files && fs.existsSync("package.json")) {
      const { main } = JSON.parse(
        fs.readFileSync("package.json", { encoding: "utf8" })
      );

      this.options.files = [main];
    }
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const gitTag = new GitTagPlugin();
    // Since the tags aren't actually in master's tree we need to look at the
    // latest release on Github.
    gitTag.getLatestFunction = newestTag;
    gitTag.apply(auto);

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.afterVersion.tap(this.name, async () => {
      if (!auto.git) {
        return;
      }

      const newTag = await auto.git.getLatestTagInBranch();
      const majorTag = `v${major(newTag)}`;
      const tags = await getAllTags();
      const newTagSha = this.options.files
        ? await this.createReleaseTag(auto, newTag)
        : await auto.git.getSha();

      if (tags.some((t) => t === majorTag)) {
        // If v1 already exists update where the tag points to
        await execPromise("git", [
          "tag",
          "--force",
          majorTag,
          newTagSha,
          "-m",
          `"Update ${majorTag}"`,
        ]);
      } else {
        await execPromise("git", [
          "tag",
          majorTag,
          newTagSha,
          "-m",
          `"Create ${majorTag}"`,
        ]);
      }

      await execPromise("git", ["push", auto.remote, "--tags", "--force"]);
    });

    auto.hooks.makeRelease.tapPromise(this.name, async (options) => {
      // If we are maintaining a separate commit for dist files we must release
      // that commit and not the last tag in the branch.
      if (this.options.files) {
        options.newVersion = await newestTag();
      }
    });
  }

  /** Create a tag with only the release files */
  private async createReleaseTag(auto: Auto, newTag: string) {
    await execPromise("git", ["checkout", "HEAD", "--detach"]);

    // Remove all source files
    await execPromise("git", ["rm", "*", "--ignore-unmatch", "-r", "--cached"]);

    // Add package files
    await execPromise("git", [
      "add",
      "--force",
      "action.yml",
      ...(this.options.files || []),
    ]);

    const message = `"Update version to ${newTag}"`;
    await execPromise("git", ["commit", "-m", message]);

    const tagSha = await auto.git!.getSha();

    await execPromise("git", ["tag", "--force", newTag, tagSha, "-m", message]);
    await execPromise("git", ["checkout", "-f", auto.baseBranch]);

    return tagSha;
  }
}
