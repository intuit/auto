import { RestEndpointMethodTypes } from "@octokit/rest";
import { Auto, IPlugin } from "@auto-it/core";

/** Toggle 'Require pull request reviews before merging' when creating 'latest' release from a GitHub Action */
export default class GithubActionTogglePeerReviewPlugin implements IPlugin {
  /** The name of the plugin */
  name = "gh-action-toggle-peer-review";

  /** The review protection options we disabled */
  private protectionOptions?: RestEndpointMethodTypes["repos"]["getBranchProtection"]["response"]["data"]["required_pull_request_reviews"];

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
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
          "enabled" in prReviewSettings &&
          (prReviewSettings as any).enabled === false
        ) {
          return;
        }

        this.protectionOptions = prReviewSettings;

        await auto.git.github.repos.deleteBranchProtection({
          owner: auto.git.options.owner,
          repo: auto.git.options.repo,
          branch: auto.baseBranch,
        });
      } catch (error) {
        // There is no branch protection settings, do nothing.
      }
    });

    auto.hooks.afterPublish.tapPromise(this.name, async () => {
      if (!auto.git || !this.protectionOptions) {
        return;
      }

      await auto.git.github.repos.updatePullRequestReviewProtection({
        owner: auto.git.options.owner,
        repo: auto.git.options.repo,
        branch: auto.baseBranch,
        dismiss_stale_reviews: this.protectionOptions.dismiss_stale_reviews,
        require_code_owner_reviews: this.protectionOptions
          .require_code_owner_reviews,
        required_approving_review_count: this.protectionOptions
          .required_approving_review_count,
        dismissal_restrictions: {
          users: this.protectionOptions.dismissal_restrictions.users.map(
            (user) => user.login
          ),
          teams: this.protectionOptions.dismissal_restrictions.teams.map(
            (team) => team.slug
          ),
        },
      });
    });
  }
}
