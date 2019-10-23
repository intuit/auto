import { Auto, execPromise, IPlugin } from '@auto-it/core';
import { inc, ReleaseType } from 'semver';

export default class GitTagPlugin implements IPlugin {
  name = 'Git Tag';

  apply(auto: Auto) {
    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      if (!auto.git) {
        throw new Error(
          "Can't calculate previous version without Git initialized!"
        );
      }

      return auto.git.getLatestTagInBranch();
    });

    auto.hooks.version.tapPromise(this.name, async version => {
      if (!auto.git) {
        return;
      }

      const lastTag = await auto.git.getLatestTagInBranch();
      const newTag = inc(lastTag, version as ReleaseType);

      if (!newTag) {
        return;
      }

      await execPromise('git', ['tag', newTag]);
      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        auto.baseBranch
      ]);
    });
  }
}
