import { Auto, IPlugin, execPromise } from '@auto-it/core';
import { IExtendedCommit } from '@auto-it/core/dist/log-parse';

import path from 'path';
import { inc, ReleaseType } from 'semver';

/** Global functions for usage in module */
const logPrefix = '[Gradle-Release-Plugin]';
const defaultSnapshotSuffix = '-SNAPSHOT';

export interface IGradleReleasePluginPluginOptions {
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

  /** publish */
  publish?: string;
}

/**
 * Builds properties object from gradle properties command
 *
 * @param gradleCommand - base gradle command
 * @returns IGradleProperties
 */
export async function getProperties(
  gradleCommand = 'gradle'
): Promise<IGradleProperties> {
  const properties = (await execPromise(gradleCommand, ['properties', '-q']))
    .split('\n')
    .map(line => /([^:]+):\s?(.+)/.exec(line) || [])
    .map(([, key, value]) => key && value && { [key]: value })
    .filter(el => el);

  return Object.assign({}, ...properties);
}

/** Retrieves a previous version from gradle.properties */
async function getVersion(): Promise<string> {
  const { version } = await getProperties();

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
  /**  */
  private usesSnapshot = false;

  /** Initialize the plugin with it's options */
  constructor(options: IGradleReleasePluginPluginOptions = {}) {
    this.options = {
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

      this.previousVersion = await getVersion();
      const { snapshotSuffix = defaultSnapshotSuffix } = await getProperties();
      if (this.previousVersion.endsWith(snapshotSuffix)) {
        this.usesSnapshot = true;
        this.snapshotSuffix = snapshotSuffix;
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
      return this.previousVersion.replace(this.snapshotSuffix, '');
    });

    // 1. gradle version to release
    // 2. commit and push tags
    auto.hooks.version.tapPromise(this.name, async (version: string) => {
      const { snapshotSuffix = defaultSnapshotSuffix } = await getProperties();
      const previousVersion = (await getVersion()).replace(snapshotSuffix, '');

      const releaseVersion =
        // After release we bump the version by a patch and add -SNAPSHOT
        // Given that we do not need to increment when versioning, since
        // it has already been done
        this.usesSnapshot && version === 'patch'
          ? previousVersion
          : inc(previousVersion, version as ReleaseType);

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

      // await execPromise('git', ['add', this.options.versionFile]);
      await execPromise('git', [
        'commit',
        '-am',
        `"release version: ${releaseVersion} [skip ci]"`,
        '--no-verify'
      ]);

      // Ensure tag is on this commit, changelog will be added automatically
      await execPromise('git', ['tag', auto.prefixRelease(releaseVersion)]);
    });

    // publish
    auto.hooks.publish.tapPromise(this.name, async version => {
      const { publish } = await getProperties();
      if (publish) {
        await execPromise(this.options.gradleCommand, ['publish']);
      }
      // });

      // 1. update to snapshot version
      // 2. commit and push tags
      // using publish hook for now b/c we need to have the version
      // auto.hooks.afterPublish.tapPromise(this.name, async () => {
      // snapshots precede releases, so if we had a minor/major release,
      // then we need to set up snapshots on the next version
      if (this.usesSnapshot) {
        const releaseVersion = await getVersion();
        const newVersion = `${
          version === 'patch'
            ? // We never bumped version for patch release before,
              // so we must do it now
              inc(releaseVersion, 'patch')
            : releaseVersion
        }${this.snapshotSuffix}`;

        await execPromise(this.options.gradleCommand, [
          'updateVersion',
          '-Prelease.useAutomaticVersion=true',
          `-Prelease.newVersion=${newVersion}`
        ]);

        // await execPromise('git', ['add', this.options.versionFile]);
        await execPromise('git', [
          'commit',
          '-am',
          `"prepare snapshot: ${newVersion} [skip ci]"`,
          '--no-verify'
        ]);
      }

      await execPromise('git', [
        'push',
        '--tags',
        '--set-upstream',
        'origin',
        auto.baseBranch
      ]);
    });
  }
}
