import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
} from "@auto-it/core";
import GitTagPlugin from "@auto-it/git-tag";
import glob from "fast-glob";
import { major } from "semver";
import * as t from "io-ts";
import { readFile } from "./utils";

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
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const gitTag = new GitTagPlugin();
    // Since the tags aren't actually in master's tree we need to look at the
    // latest release on Github.
    gitTag.getLatestFunction = "getLatestRelease";
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
      const head = await auto.git.getSha();

      if (this.options.files) {
        // create a commit with only files + actions.yml
        const files = await Promise.all(
          glob.sync(this.options.files || []).map(async (file) => ({
            path: file,
            mode: "100644" as const,
            type: "blob" as const,
            content: await readFile(file, { encoding: "utf8" }),
          }))
        );

        const tree = await auto.git.github.git.createTree({
          ...auto.git.options,
          tree: [
            {
              path: "action.yml",
              mode: "100644",
              type: "blob",
              content: await readFile("action.yml", { encoding: "utf8" }),
            },
            ...files,
          ],
        });

        const commit = await auto.git.github.git.createCommit({
          ...auto.git.options,
          message: "Automatic compilation",
          tree: tree.data.sha,
          parents: [head],
        });

        await execPromise("git", [
          "tag",
          "--force",
          newTag,
          commit.data.sha,
          "-m",
          `"Update version to ${newTag}"`,
        ]);
      }

      const tags = await auto.git.getTags(auto.baseBranch);
      const majorTag = `v${major(newTag)}`;

      if (tags.some((t) => t === majorTag)) {
        // If v1 already exists update where the tag points to
        await execPromise("git", [
          "tag",
          "--force",
          majorTag,
          head,
          "-m",
          `"Update ${majorTag}"`,
        ]);
      } else {
        await execPromise("git", [
          "tag",
          majorTag,
          "-m",
          `"Create ${majorTag}"`,
        ]);
      }

      await execPromise("git", ["push", auto.remote, "--tags"]);
    });
  }
}
