import { RestEndpointMethodTypes } from "@octokit/rest";
import endent from "endent";
import envCi from "env-ci";

import { Auto, IPlugin } from "../auto";

/** Toggle 'Require pull request reviews before merging' when creating 'latest' release from a GitHub Action */
export default class GithubActionTogglePeerReviewPlugin implements IPlugin {
  /** The name of the plugin */
  name = "gh-action-toggle-peer-review";

  /** The review protection options we disabled */
  private protectionOptions?: RestEndpointMethodTypes["repos"]["getBranchProtection"]["response"]["data"]["required_pull_request_reviews"];

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const env = envCi();

    if (!("name" in env) || (env.name as any) !== "GitHub Actions") {
      return;
    }

    auto.hooks.afterVersion.tapPromise(this.name, async () => {
      if (!auto.git) {
        return;
      }

      try {
        const response = await auto.git.github.repos.getBranchProtection({
          owner: auto.git.options.owner,
          repo: auto.git.options.repo,
          branch: auto.baseBranch,
        });
        const prReviewSettings = response.data.required_pull_request_reviews;

        if (
          !prReviewSettings ||
          ("enabled" in prReviewSettings &&
            (prReviewSettings as any).enabled === false)
        ) {
          auto.logger.verbose.warn(
            `Could not find peer review settings for '${auto.baseBranch}' branch.`
          );

          return;
        }

        this.protectionOptions = prReviewSettings;

        await auto.git.github.repos.deletePullRequestReviewProtection({
          owner: auto.git.options.owner,
          repo: auto.git.options.repo,
          branch: auto.baseBranch,
        });

        auto.logger.log.info(
          `Turned off peer review for '${auto.baseBranch}' branch. Will re-enable after publish.`
        );
      } catch (error) {
        if (
          typeof error === "object" &&
          error.message.includes("Resource not accessible by integration")
        ) {
          auto.logger.log.error(endent`
            To use "auto" in a GitHub Action with "required peer reviews" you will not be able to use the "GITHUB_TOKEN" in the action.
            This token does not have access to toggling these settings.
            You *must* create a personal access token with "repo" access.
          `);
          process.exit(1);
        } else {
          // There is no branch protection settings, do nothing.
          auto.logger.verbose.error(error);
        }
      }
    });

    auto.hooks.afterPublish.tapPromise(this.name, async () => {
      if (!auto.git || !this.protectionOptions) {
        return;
      }

      const { users = [], teams = [] } =
        this.protectionOptions.dismissal_restrictions || {};
      const options: RestEndpointMethodTypes["repos"]["updatePullRequestReviewProtection"]["parameters"] = {
        owner: auto.git.options.owner,
        repo: auto.git.options.repo,
        branch: auto.baseBranch,
        dismiss_stale_reviews: this.protectionOptions.dismiss_stale_reviews,
        require_code_owner_reviews: this.protectionOptions
          .require_code_owner_reviews,
        required_approving_review_count: this.protectionOptions
          .required_approving_review_count,
      };

      if (users.length || teams.length) {
        options.dismissal_restrictions = {
          users: (users || []).map((user) => user.login),
          teams: (teams || []).map((team) => team.slug),
        };
      }

      await auto.git.github.repos.updatePullRequestReviewProtection(options);

      auto.logger.log.info(
        `Re-enabled peer review for '${auto.baseBranch}' branch!`
      );
    });
  }
}
