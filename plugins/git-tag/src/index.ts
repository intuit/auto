import {
  Auto,
  determineNextVersion,
  execPromise,
  IPlugin
} from '@auto-it/core';
import { inc, ReleaseType } from 'semver';
import { execSync } from 'child_process';

/** When the next hook is running branch is also the tag to publish under (ex: next, beta) */
const branch = execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' });

/** Manage your projects version through just a git tag. */
export default class GitTagPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Git Tag';

  /** Tap into auto plugin points. */
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

    auto.hooks.next.tapPromise(this.name, async (preReleaseVersions, bump) => {
      if (!auto.git) {
        return preReleaseVersions;
      }

      const prereleaseBranches = auto.config?.prereleaseBranches!;
      const prereleaseBranch = prereleaseBranches.includes(branch)
        ? branch
        : prereleaseBranches[0];
      const lastRelease = await auto.git.getLatestRelease();
      const current = await auto.getCurrentVersion(lastRelease);
      const prerelease = determineNextVersion(
        lastRelease,
        current,
        bump,
        prereleaseBranch
      );

      await execPromise('git', ['tag', prerelease]);
      await execPromise('git', ['push', '--tags']);

      return preReleaseVersions;
    });
  }
}
