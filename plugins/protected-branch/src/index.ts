import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import * as t from "io-ts";
import { GitOperator } from "./GitOperator";

const pluginOptions = t.partial({
  /** Personal access token for who need to approve release commit changes */
  reviewerToken: t.string,
  /** Branch prefix for release branch, default to "automatic-release-" */
  releaseTemporaryBranchPrefix: t.string,
  /** List of required status checks for protected branch */
  requiredStatusChecks: t.array(t.string),
});

export type IProtectedBranchPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Handle Github branch protections */
export default class ProtectedBranchPlugin implements IPlugin {
  /** The name of the plugin */
  name = "protected-branch";

  /** The options of the plugin */
  readonly options: IProtectedBranchPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IProtectedBranchPluginOptions) {
    this.options = {
      reviewerToken:
        options.reviewerToken ||
        process.env.PROTECTED_BRANCH_REVIEWER_TOKEN ||
        "",
      releaseTemporaryBranchPrefix:
        options.releaseTemporaryBranchPrefix || "automatic-release-",
      requiredStatusChecks: options.requiredStatusChecks || [],
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.beforeRun.tap(this.name, (rc) => {
      const protectedBranchPlugin = rc.plugins?.find(
        (plugin) =>
          plugin[0] === this.name || plugin[0] === `@auto-it/${this.name}`
      ) as [string, IProtectedBranchPluginOptions];
      if (!protectedBranchPlugin?.[1]?.reviewerToken) {
        auto.checkEnv(this.name, "PROTECTED_BRANCH_REVIEWER_TOKEN");
      }
    });

    auto.hooks.publish.tapPromise(
      {
        name: this.name,
        // Include this plugin in a high priority stage in order to be mostly often before others plugins
        stage: -1,
      },
      async () => {
        if (!auto.git || !this.options.reviewerToken) {
          return;
        }

        const gitOperator = new GitOperator(auto.git, auto.logger);
        const sha = await auto.git.getSha();
        const headBranch = `${this.options.releaseTemporaryBranchPrefix}${sha}`;

        auto.logger.log.info(
          "Handling branch protection (without an admin token) 🔓 "
        );

        // First push this branch in order to open a PR on it (needed by protections)
        await gitOperator.pushBranch(auto.remote, headBranch);

        // As github-actions (with checks: write)
        auto.logger.log.info("Handle branch protection (required checks) 🕵️ ");
        await Promise.all(
          (this.options.requiredStatusChecks || []).map((check) =>
            gitOperator.createCheck(check, sha)
          )
        );

        // As github-actions (pull-requests: write)
        auto.logger.log.info("Open a release PR to handle changes 🐙 ");
        const prNumber = await gitOperator.createPr(
          "Automatic release",
          headBranch,
          auto.baseBranch
        );

        // As reviewer, allowed in : `Restrict who can push to matching branches`
        auto.logger.log.info("Mark released pr as reviewed ✅ ");
        await gitOperator.approvePr(this.options.reviewerToken, prNumber, sha);

        auto.logger.log.info(
          `Branch protection handled in PR ${prNumber}, Follow up 🚀 `
        );
      }
    );
  }
}
