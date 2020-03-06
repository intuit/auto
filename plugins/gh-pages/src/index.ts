import {
  Auto,
  IPlugin,
  execPromise,
  validatePluginConfiguration,
  SEMVER
} from '@auto-it/core';
import { execSync } from 'child_process';
import * as t from 'io-ts';

const required = t.interface({
  /** The directory to push to gh-pages */
  dir: t.string
});

const optional = t.partial({
  /** A command to build the documenation website */
  buildCommand: t.string,
  /** The branch to push to */
  branch: t.string,
  /** A label to look for and always publish the docs */
  label: t.string
});

const pluginOptions = t.intersection([required, optional]);

export type IGhPagesPluginOptions = t.TypeOf<typeof pluginOptions>;

const defaults = {
  branch: 'gh-pages',
  label: 'documentation'
};

/** Automate publishing to your gh-pages documentation website. */
export default class GhPagesPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'gh-pages';

  /** The options of the plugin */
  readonly options: IGhPagesPluginOptions & typeof defaults;

  /** Initialize the plugin with it's options */
  constructor(options: IGhPagesPluginOptions) {
    this.options = { ...defaults, ...options };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.beforeShipIt.tapPromise(this.name, async ({ releaseType }) => {
      if (releaseType !== 'latest' || !auto.git) {
        return;
      }

      const bump = await auto.getVersion();

      // If it's a bump the 'afterRelease' hook will release the docs
      if (bump !== SEMVER.noVersion) {
        return;
      }

      const sha = await auto.git.getSha();
      const pr = await auto.git.matchCommitToPr(sha);

      if (!pr) {
        return;
      }

      const hasDocumentationLabel = pr.labels.includes(this.options.label);

      if (!hasDocumentationLabel) {
        return;
      }

      // If: skip-release + w/documentation label then we will push to gh-pages
      await auto.setGitUser();
      await this.releaseGhPages();
    });

    auto.hooks.afterRelease.tapPromise(this.name, async ({ response }) => {
      if (!response) {
        return;
      }

      const releases = Array.isArray(response) ? response : [response];
      const isPrerelease = releases.some(release => release.data.prerelease);

      if (isPrerelease) {
        return;
      }

      await this.releaseGhPages();
    });
  }

  /** Release to gh-pages */
  private async releaseGhPages() {
    if (this.options.buildCommand) {
      execSync(this.options.buildCommand);
    }

    await execPromise('npx', [
      'push-dir',
      '--cleanup',
      `--dir=${this.options.dir}`,
      `--branch=${this.options.branch}`,
      '--message="Update docs [skip ci]"'
    ]);
  }
}
