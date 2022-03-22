import { Auto, getCurrentBranch, IPlugin, validatePluginConfiguration, execPromise } from '@auto-it/core';
import * as t from "io-ts";

const pluginOptions = t.partial({
  /** Release commit message */
  commitMessage: t.string,
});

interface ITag {
  /** Name */
  name: string;
  /** Message */
  message: string;
}

/**
 * Get Tag (and his message) for a commit
 * or return undefined if no tag present on this commit
 */
async function getTag(sha: string) : Promise<ITag | undefined> {
  let tag: string|undefined;
  try{
    tag = await execPromise("git", ["describe", "--tags", "--exact-match", sha])
  } catch (error) {
    if (!error.message?.includes("no tag exactly matches")) {
      throw error;
    }
  }

  if (tag === undefined){
    return undefined;
  }

  const message = await execPromise("git", ["tag", tag, "-l", '--format="%(contents)"']);

  return { name: tag, message: message.trim() };
}

export type IOneReleaseCommitPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Allow to squash release commit in a single one */
export default class OneReleaseCommitPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'one-release-commit';

  /** The options of the plugin */
  readonly options: IOneReleaseCommitPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IOneReleaseCommitPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name,  async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.afterVersion.tapPromise({
      name: this.name,
      // Include this plugin in a less priority stage in order to be mostly often after others plugins
      stage: 1,
    }, async ({ dryRun, version }) => {
      if (!auto.git || dryRun || !version) {
        return;
      }

      const heads = await execPromise("git", [
        "ls-remote",
        "--heads",
        auto.remote,
        getCurrentBranch(),
      ]);
      const baseBranchHeadRef = new RegExp(
          `^(\\w+)\\s+refs/heads/${auto.baseBranch}$`
      );
      const [, remoteHead] = heads.match(baseBranchHeadRef) || [];

      if (!remoteHead) {
        throw new Error(`No remote found for branch : "${auto.baseBranch}"`);
      }

      const commits = await auto.git.getGitLog(remoteHead);
      const tags: ITag[] = (await Promise.all(commits.map(commit => getTag(commit.hash)))).filter(tag => tag !== undefined) as ITag[];

      auto.logger.log.info(`Rewrote ${commits.length} release commits into a single commit for version [${version}] with tags: [${tags.map(tag => tag.name).join(", ")}]`);

      if (commits.length > 0) {
        await execPromise("git", ["reset", "--soft", remoteHead]);
        await execPromise("git", ["commit", "-m", this.options.commitMessage || `"Release version ${version} [skip ci]"`, "--no-verify"]);

        await Promise.all(tags.map(tag => execPromise("git", [
          "tag", "--annotate", "--force", tag.name,
          "-m", tag.message,
        ])));
      }
    });
  }
}
