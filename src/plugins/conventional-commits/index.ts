import { applyPlugins, parse, plugins } from 'parse-commit-message';

import { AutoRelease, IPlugin } from '../../main';
import { VersionLabel } from '../../release';

export default class ConventionalCommitsPlugin implements IPlugin {
  name = 'Conventional Commits Parser';

  apply(auto: AutoRelease) {
    auto.hooks.onCreateLogParse.tap(this.name, logParse => {
      logParse.hooks.parseCommit.tap(this.name, commit => {
        try {
          const [conventionalCommit] = applyPlugins(
            [plugins[1]],
            parse([commit.subject])
          );

          if (conventionalCommit.header && conventionalCommit.increment) {
            commit.labels = [
              ...commit.labels,
              auto.semVerLabels!.get(
                conventionalCommit.increment as VersionLabel
              )!
            ];
          }
        } catch (error) {
          auto.logger.verbose.info(
            `No conventional commit message found for ${commit.hash}`
          );
        }

        return commit;
      });
    });
  }
}
