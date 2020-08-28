import env from "env-ci";

import { Auto } from "../auto";
import GithubActionTogglePeerReview from "../plugins/gh-action-peer-review";
import { dummyLog } from "../utils/logger";
import { makeHooks } from "../utils/make-hooks";

const getBranchProtection = jest.fn();
const deletePullRequestReviewProtection = jest.fn();
const updatePullRequestReviewProtection = jest.fn();

const git = {
  options: {
    owner: "test",
    repo: "repo",
  },
  github: {
    repos: {
      getBranchProtection,
      deletePullRequestReviewProtection,
      updatePullRequestReviewProtection,
    },
  },
} as any;

jest.mock("env-ci");

describe("GH-Action-Toggle-Peer-Review Plugin", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should do nothing when not on github actions", async () => {
    const plugin = new GithubActionTogglePeerReview();
    const hooks = makeHooks();

    (env as jest.Mock).mockReturnValueOnce({});
    plugin.apply({ hooks, logger: dummyLog(), git } as Auto);

    await hooks.afterVersion.promise();
    await hooks.afterPublish.promise();

    expect(deletePullRequestReviewProtection).not.toHaveBeenCalled();
    expect(updatePullRequestReviewProtection).not.toHaveBeenCalled();
  });

  test("should do nothing when branch protection isn't enabled", async () => {
    const plugin = new GithubActionTogglePeerReview();
    const hooks = makeHooks();

    (env as jest.Mock).mockReturnValueOnce({ name: "GitHub Actions" });
    plugin.apply({ hooks, logger: dummyLog(), git } as Auto);

    await hooks.afterVersion.promise();
    await hooks.afterPublish.promise();

    expect(deletePullRequestReviewProtection).not.toHaveBeenCalled();
    expect(updatePullRequestReviewProtection).not.toHaveBeenCalled();
  });

  test("should toggle branch protection", async () => {
    const plugin = new GithubActionTogglePeerReview();
    const hooks = makeHooks();
    const protectionSettings = { dismiss_stale_reviews: true };

    (env as jest.Mock).mockReturnValueOnce({ name: "GitHub Actions" });
    plugin.apply({ hooks, logger: dummyLog(), git } as Auto);
    getBranchProtection.mockResolvedValueOnce({
      data: { required_pull_request_reviews: protectionSettings },
    });

    await hooks.afterVersion.promise();
    await hooks.afterPublish.promise();

    expect(deletePullRequestReviewProtection).toHaveBeenCalled();
    expect(updatePullRequestReviewProtection).toHaveBeenCalledWith(
      expect.objectContaining(protectionSettings)
    );
  });

  test("should toggle branch protection with users and teams", async () => {
    const plugin = new GithubActionTogglePeerReview();
    const hooks = makeHooks();
    const protectionSettings = {
      dismissal_restrictions: {
        users: [{ login: "me" }, { login: "myBuddy" }],
        teams: [{ slug: "org" }, { slug: "other-org" }],
      },
    };

    (env as jest.Mock).mockReturnValueOnce({ name: "GitHub Actions" });
    plugin.apply({ hooks, logger: dummyLog(), git } as Auto);
    getBranchProtection.mockResolvedValueOnce({
      data: { required_pull_request_reviews: protectionSettings },
    });

    await hooks.afterVersion.promise();
    await hooks.afterPublish.promise();

    expect(deletePullRequestReviewProtection).toHaveBeenCalled();
    expect(updatePullRequestReviewProtection).toHaveBeenCalledWith(
      expect.objectContaining({
        dismissal_restrictions: {
          users: ["me", "myBuddy"],
          teams: ["org", "other-org"],
        },
      })
    );
  });
});
