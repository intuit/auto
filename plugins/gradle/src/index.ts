import { Auto, IPlugin, execPromise } from '@auto-it/core';
import { IExtendedCommit } from '@auto-it/core/src/log-parse';

import path from 'path';
import fs from 'fs-extra';
import { inc, ReleaseType } from 'semver';
import { parse } from 'dot-properties';

/** Global functions for usage in module */
const logPrefix = '[Gradle-Release-Plugin]';

export interface IGradleReleasePluginPluginOptions {
  /** The file that contains the version string in it. */
  versionFile?: string;

  /** The command to build the project with */
  gradleCommand?: string;

  /** A list of gradle command customizations to pass to gradle */
  gradleOptions?: Array<string>;
}

/** getPre does this */
async function getPreviousVersion(path: string): Promise<string> {
  try {
    const data = await fs.readFile(path, 'utf-8');
    const { version } = parse(data);

    if (version) {
      return version;
    }
  } catch (error) {}

  throw new Error('No version was found inside version-file.');
}

/**  */
export default class GradleReleasePluginPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Gradle Release Plugin';

  /** The options of the plugin */
  readonly options: IGradleReleasePluginPluginOptions;

  /** Previous Version */
  previousVersion = '';

  /** Version to Release */
  newVersion = '';

  /** Initialize the plugin with it's options */
  constructor(options: IGradleReleasePluginPluginOptions) {
    this.options = {
      versionFile: options?.versionFile
        ? path.join(process.cwd(), options.versionFile)
        : path.join(process.cwd(), './gradle.properties'),
      gradleCommand: options?.gradleCommand
        ? path.join(process.cwd(), options.gradleCommand)
        : '/usr/bin/gradle',
      gradleOptions: options?.gradleOptions || []
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.beforeRun.tap(this.name, () => {
      auto.logger.log.warn(`${logPrefix} BeforeRun`);
      // validation
      if (!fs.existsSync(this.options.versionFile || '')) {
        auto.logger.log.warn(
          `${logPrefix} The version-file does not exist on disk.`
        );
      }
    });

    auto.hooks.onCreateLogParse.tap(this.name, logParse => {
      logParse.hooks.omitCommit.tap(this.name, (commit: IExtendedCommit) => {
        if (commit.subject.includes('[Gradle Release Plugin]')) {
          return true;
        }
      });
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, () => {
      return getPreviousVersion(this.options.versionFile || '');
    });

    auto.hooks.version.tapPromise(this.name, async (version: string) => {
      this.previousVersion = await getPreviousVersion(
        this.options.versionFile || ''
      );
      this.newVersion = inc(this.previousVersion, version as ReleaseType) || '';
      if (!this.newVersion) {
        throw new Error(
          `Could not increment previous version: ${this.previousVersion}`
        );
      }

      // coerce
      const gradleCommand: string = this.options.gradleCommand || '';

      await execPromise(gradleCommand, [
        'release',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.releaseVersion=${this.previousVersion}`,
        `-Prelease.newVersion=${this.newVersion}`,
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion'
      ]);

      await execPromise('git', ['add', 'gradle.properties']);
      await execPromise('git', [
        'commit',
        '-m',
        `"Bump version to: ${this.newVersion} [skip ci]"`,
        '--no-verify'
      ]);

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
