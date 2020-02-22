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
    auto.hooks.beforeRun.tap(this.name, () => {
      auto.logger.log.warn(`${logPrefix} BeforeRun`);
      // validation
      if (!fs.existsSync(this.options.versionFile)) {
        auto.logger.log.error(
          `${logPrefix} The version-file does not exist on disk.`
        );
        process.exit(1);
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
      return getPreviousVersion(this.options.versionFile);
    });

    auto.hooks.version.tapPromise(this.name, async (version: string) => {
      const previousVersion = await getPreviousVersion(
        this.options.versionFile
      );

      let { snapshotSuffix = '' } = await getProperties(
        this.options.gradlePropertiesFile
      );
      if (!snapshotSuffix && previousVersion.endsWith(defaultSnapshotSuffix)) {
        snapshotSuffix = defaultSnapshotSuffix;
      }

      const releaseVersion = previousVersion.replace(snapshotSuffix, '');
      const newVersion =
        `${inc(releaseVersion, version as ReleaseType)}${snapshotSuffix}` || '';
      if (!newVersion) {
        throw new Error(
          `Could not increment previous version: ${previousVersion}`
        );
      }

      await execPromise(this.options.gradleCommand, [
        'release',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.releaseVersion=${releaseVersion}`,
        `-Prelease.newVersion=${newVersion}`,
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion',
        ...this.options.gradleOptions
      ]);

      await execPromise('git', ['add', 'gradle.properties']);
      await execPromise('git', [
        'commit',
        '-m',
        `"Bump version to: ${newVersion} [skip ci]"`,
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
