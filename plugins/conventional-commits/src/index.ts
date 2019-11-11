import { applyPlugins, mappers, parse } from 'parse-commit-message';

import { Auto, IPlugin, VersionLabel } from '@auto-it/core';

/**
 * Parse conventional commit messages and use them to
 * calculate the version.
 */
export default class ConventionalCommitsPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Conventional Commits Parser';

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateLogParse.tap(this.name, logParse => {
      logParse.hooks.parseCommit.tap(this.name, commit => {
        if (!auto.semVerLabels) {
          return commit;
        }

        try {
          const [conventionalCommit] = applyPlugins(
            mappers.increment,
            parse(commit.subject)
          );
          const incrementLabel = auto.semVerLabels.get(
            conventionalCommit.increment as VersionLabel
          );

          if (conventionalCommit.header && incrementLabel) {
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
      logParse.hooks.omitCommit.tapPromise(this.name, async commit => {
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
            prCommits.find(c => {
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
