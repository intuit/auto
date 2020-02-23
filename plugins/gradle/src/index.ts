import { Auto, IPlugin, execPromise } from '@auto-it/core';
import { IExtendedCommit } from '@auto-it/core/dist/log-parse';

import path from 'path';
import fs from 'fs-extra';
import { inc, ReleaseType } from 'semver';
import { parse } from 'dot-properties';

/** Global functions for usage in module */
const logPrefix = '[Gradle-Release-Plugin]';
const defaultSnapshotSuffix = '-SNAPSHOT';

export interface IGradleReleasePluginPluginOptions {
  /** The file that contains gradle release properties in it. */
  gradlePropertiesFile?: string;

  /** The file that contains the version in it. */
  versionFile?: string;

  /** The gradle binary to release the project with */
  gradleCommand?: string;

  /** A list of gradle command customizations to pass to gradle */
  gradleOptions?: Array<string>;
}

export interface IGradleProperties {
  /** version */
  version?: string;

  /** snapshotSuffix */
  snapshotSuffix?: string;
}

/**
 * Reads config object from file
 *
 * @param path
 * @returns
 */
export async function getProperties(path: string): Promise<IGradleProperties> {
  try {
    const data = await fs.readFile(path, 'utf-8');
    return parse(data);
  } catch (error) {}

  throw new Error(`Properties-file not found.`);
}

/** Retrieves a previous version from gradle.properties */
async function getPreviousVersion(path: string): Promise<string> {
  const { version } = await getProperties(path);

  if (version) {
    return version;
  }

  throw new Error('No version was found inside version-file.');
}

/** A plugin to release java projects with gradle */
export default class GradleReleasePluginPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Gradle Release Plugin';

  /** The options of the plugin */
  readonly options: Required<IGradleReleasePluginPluginOptions>;

  /**  */
  private previousVersion = '';
  /**  */
  private snapshotSuffix = '';

  /** Initialize the plugin with it's options */
  constructor(options: IGradleReleasePluginPluginOptions = {}) {
    const gradlePropertiesFile = options?.gradlePropertiesFile
      ? path.join(process.cwd(), options.gradlePropertiesFile)
      : path.join(process.cwd(), './gradle.properties');
    this.options = {
      gradlePropertiesFile,
      versionFile: options?.versionFile
        ? path.join(process.cwd(), options.versionFile)
        : gradlePropertiesFile,
      gradleCommand: options?.gradleCommand
        ? path.join(process.cwd(), options.gradleCommand)
        : '/usr/bin/gradle',
      gradleOptions: options.gradleOptions || []
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.beforeRun.tap(this.name, async () => {
      auto.logger.log.warn(`${logPrefix} BeforeRun`);
      // validation
      if (!fs.existsSync(this.options.versionFile)) {
        auto.logger.log.error(
          `${logPrefix} The version-file does not exist on disk.`
        );
        process.exit(1);
      }

      this.previousVersion = await getPreviousVersion(this.options.versionFile);
      const { snapshotSuffix = '' } = await getProperties(
        this.options.gradlePropertiesFile
      );
      this.snapshotSuffix = snapshotSuffix;
      if (
        !snapshotSuffix &&
        this.previousVersion.endsWith(defaultSnapshotSuffix)
      ) {
        this.snapshotSuffix = defaultSnapshotSuffix;
      }
    });

    auto.hooks.onCreateLogParse.tap(this.name, logParse => {
      logParse.hooks.omitCommit.tap(this.name, (commit: IExtendedCommit) => {
        if (commit.subject.includes('[Gradle Release Plugin]')) {
          return true;
        }
      });
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      return this.previousVersion;
    });

    // 1. gradle version to release
    // 2. commit and push tags
    auto.hooks.version.tapPromise(this.name, async (version: string) => {
      const releaseVersion =
        version === 'patch'
          ? this.previousVersion.replace(this.snapshotSuffix, '')
          : `${inc(
              this.previousVersion.replace(this.snapshotSuffix, ''),
              version as ReleaseType
            )}` || '';
      if (!releaseVersion) {
        throw new Error(
          `Could not increment previous version: ${this.previousVersion}`
        );
      }

      await execPromise(this.options.gradleCommand, [
        'updateVersion',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.newVersion=${releaseVersion}`
      ]);

      await execPromise('git', ['add', this.options.versionFile]);
      await execPromise('git', [
        'commit',
        '-m',
        `"release version: ${releaseVersion} [skip ci]"`,
        '--no-verify'
      ]);

      await execPromise('git', ['tag', releaseVersion]);

      await execPromise(this.options.gradleCommand, ['artifactoryPublish']);

      // snapshots precede releases, so if we had a minor/major release,
      // then we need to set up snapshots on the next version
      if (version === 'patch' || this.snapshotSuffix) {
        const newVersion = `${inc(releaseVersion, 'patch')}${
          this.snapshotSuffix
        }`;

        await execPromise(this.options.gradleCommand, [
          'updateVersion',
          '-Prelease.useAutomaticVersion=true',
          `-Prelease.newVersion=${newVersion}`
        ]);

        await execPromise('git', ['add', this.options.versionFile]);
        await execPromise('git', [
          'commit',
          '-m',
          `"prepare snapshot: ${newVersion} [skip ci]"`,
          '--no-verify'
        ]);
      }

      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        auto.baseBranch
      ]);
    });

    // publish
    // auto.hooks.publish.tapPromise(this.name, async () => {
    // });

    // 1. update to snapshot version
    // 2. commit and push tags
    // auto.hooks.afterPublish.tapPromise(this.name, async () => {
  }
}
