import { applyPlugins, mappers, parse } from "parse-commit-message";

import { Auto, IPlugin, VersionLabel, SEMVER } from "@auto-it/core";

/**
 * Parse conventional commit messages and use them to
 * calculate the version.
 */
export default class ConventionalCommitsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "conventional-commits";

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
      logParse.hooks.parseCommit.tap(this.name, (commit) => {
        if (!auto.semVerLabels) {
          return commit;
        }

        try {
          const [conventionalCommit] = applyPlugins(
            mappers.increment,
            parse(commit.subject)
          );
          // conventional commits will return a falsy value when no increment is detected (e.g., chore/perf/refactor commits)
          const commitIncrement =
            (conventionalCommit.increment as VersionLabel) || "skip";
          const incrementLabel = auto.semVerLabels.get(commitIncrement);
          const allSemVerLabels = [
            auto.semVerLabels.get(SEMVER.major),
            auto.semVerLabels.get(SEMVER.minor),
            auto.semVerLabels.get(SEMVER.patch),
          ].reduce<string[]>(
            (acc, labels) => (labels ? [...acc, ...labels] : acc),
            []
          );

          if (
            conventionalCommit.header &&
            incrementLabel &&
            !commit.labels.some((l) => allSemVerLabels.includes(l))
          ) {
            commit.labels = [...commit.labels, ...incrementLabel];
          }
        } catch (error) {
          auto.logger.verbose.info(
            `No conventional commit message found for ${commit.hash}`
          );
        }

        return commit;
      });

      // should omit PR commit if there exists a commit with a CC commit message
      logParse.hooks.omitCommit.tapPromise(this.name, async (commit) => {
        if (
          auto.git &&
          auto.release &&
          commit.pullRequest &&
          commit.labels.length === 0
        ) {
          const prCommits = await auto.git.getCommitsForPR(
            commit.pullRequest.number
          );

          // Omit the commit if one of the commits in the PR contains a CC message since it will already be counted
          return Boolean(
            prCommits.find((c) => {
              try {
                return Boolean(parse(c.commit.message)[0].header);
              } catch (error) {
                return false;
              }
            })
          );
        }
      });
    });
  }
}
