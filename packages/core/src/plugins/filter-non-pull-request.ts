import on from "await-to-js";

import { Auto, IPlugin } from "../auto";

/** Filter out PR numbers that might generate errors. */
export default class FilterNonPullRequestPlugin implements IPlugin {
  /** The name of the plugin */
  name = "Filter Non Pull Request";

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
      logParse.hooks.omitCommit.tapPromise(this.name, async (commit) => {
        if (commit.pullRequest?.number) {
          const { number: prNumber } = commit.pullRequest;
          const [err, info] = await on(auto.git!.getPr(prNumber));

          // Omit PRs that don't exist on the repo
          if (err?.message.includes("Not Found")) {
            return true;
          }

          if (err) {
            throw err;
          }

          if (!info) {
            throw new Error(`Could not find PR: ${prNumber}`);
          }

          // Omit issues
          if (!info.data.pull_request) {
            return true;
          }
        }
      });
    });
  }
}
