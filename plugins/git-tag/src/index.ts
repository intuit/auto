import {
  Auto,
  determineNextVersion,
  execPromise,
  IPlugin,
  getCurrentBranch
} from '@auto-it/core';
import { inc, ReleaseType } from 'semver';

/** Manage your projects version through just a git tag. */
export default class GitTagPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Git Tag';

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    /** Get the latest tag in the repo, if none then the first commit */
    async function getTag() {
      try {
        return await auto.git!.getLatestTagInBranch();
      } catch (error) {
        return auto.prefixRelease('0.0.0');
      }
    }

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      if (!auto.git) {
        throw new Error(
          "Can't calculate previous version without Git initialized!"
        );
      }

      return getTag();
    });

    auto.hooks.version.tapPromise(this.name, async (releases, version) => {
      if (!auto.git) {
        return releases;
      }

      const lastTag = await getTag();
      const newTag = inc(lastTag, version as ReleaseType);

      if (!newTag) {
        return releases;
      }

      return [...releases, { name: __dirname, version: newTag }];
    });

    auto.hooks.next.tapPromise(this.name, async (preReleaseVersions, bump) => {
      if (!auto.git) {
        return preReleaseVersions;
      }

      const prereleaseBranches = auto.config?.prereleaseBranches!;
      const branch = getCurrentBranch() || '';
      const prereleaseBranch = prereleaseBranches.includes(branch)
        ? branch
        : prereleaseBranches[0];
      const lastRelease = await auto.git.getLatestRelease();
      const current =
        (await auto.git.getLastTagNotInBaseBranch(prereleaseBranch)) ||
        (await auto.getCurrentVersion(lastRelease));
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
