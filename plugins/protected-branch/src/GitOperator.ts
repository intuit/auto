import { execPromise } from "@auto-it/core";
import Git from "@auto-it/core/dist/git";
import { ILogger } from "@auto-it/core/dist/utils/logger";
import { RestEndpointMethodTypes } from "@octokit/rest";

/**
 * Utility class to handle all Git/Github related interactions
 */
export class GitOperator {

  /** Initialize this class */
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly git: Git, private readonly logger: ILogger) {}

  /** Push HEAD to a remote branch */
  public async pushBranch(remote: string, branch: string): Promise<void> {
    await execPromise("git", [
      "push",
      "--set-upstream",
      remote,
      "--porcelain",
      `HEAD:${branch}`,
    ]);
  }

  /** Create a status check on a commit */
  public async createCheck(check: string, sha: string): Promise<void> {
    const params: RestEndpointMethodTypes["checks"]["create"]["parameters"] = {
      name: check,
      head_sha: sha,
      conclusion: "success",
      owner: this.git.options.owner,
      repo: this.git.options.repo,
    };

    this.logger.verbose.info("Creating check using:\n", params);

    const result = await this.git.github.checks.create(params);

    this.logger.veryVerbose.info("Got response from createCheck\n", result);
    this.logger.verbose.info("Created check on GitHub.");
  }

  /** Create a pull request */
  public async createPr(
    title: string,
    head: string,
    base: string
  ): Promise<number> {
    const params: RestEndpointMethodTypes["pulls"]["create"]["parameters"] = {
      title,
      head,
      base,
      owner: this.git.options.owner,
      repo: this.git.options.repo,
    };

    this.logger.verbose.info("Creating PullRequest using:\n", params);

    const result = await this.git.github.pulls.create(params);

    this.logger.veryVerbose.info("Got response from PullRequest\n", result);
    this.logger.verbose.info("Created PullRequest on GitHub.");

    return result.data.number;
  }

  /** Add an APPROVE review on a Pull Request */
  async approvePr(
    token: string,
    pull_number: number,
    sha: string
  ): Promise<void> {
    const approverGit = new Git(
        {
          ...this.git.options,
          token,
        },
        this.logger
    );

    this.logger.verbose.info('Approving PullRequest using:\n', { pull_number, sha });
    const params: RestEndpointMethodTypes['pulls']['createReview']['parameters'] = {
      owner: this.git.options.owner,
      repo: this.git.options.repo,
      pull_number,
      commit_id: sha,
      event: 'APPROVE',
    };

    await approverGit.github.pulls.createReview(params);

    this.logger.verbose.info('Approve PullRequest on GitHub.');
  }
}
