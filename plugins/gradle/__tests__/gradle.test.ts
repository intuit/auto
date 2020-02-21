import fs from 'fs-extra';

import * as Auto from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import GradleReleasePlugin, {
  IGradleReleasePluginPluginOptions,
  readPropertiesFile
} from '../src';

const mockRead = (result: string) =>
  jest
    .spyOn(fs, 'readFile')
    // @ts-ignore
    .mockReturnValueOnce(result);

describe('Gradle Plugin', () => {
  let hooks: Auto.IAutoHooks;
  const options: IGradleReleasePluginPluginOptions = {};

  beforeEach(() => {
    const plugin = new GradleReleasePlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog() } as Auto.Auto);
  });

  describe('getPreviousVersion', () => {
    test('should get previous version from version.json', async () => {
      mockRead('version=1.0.0');
      expect(await hooks.getPreviousVersion.promise()).toBe('1.0.0');
    });

    test('should throw when no in version.json', async () => {
      mockRead('');
      await expect(hooks.getPreviousVersion.promise()).rejects.toThrowError(
        'No version was found inside version-file.'
      );
    });

    test('should throw when no version.json', async () => {
      await expect(hooks.getPreviousVersion.promise()).rejects.toThrowError(
        'Config file not found.'
      );
    });
  });

  describe('version', () => {
    test('should version release - patch version', async () => {
      mockRead('version=1.0.0');
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'release',
        '-Prelease.useAutomaticVersion=true',
        '-Prelease.releaseVersion=1.0.0',
        '-Prelease.newVersion=1.0.1',
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion'
      ]);
    });

    test('should version release - major version', async () => {
      mockRead('version=1.0.0');
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.major);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'release',
        '-Prelease.useAutomaticVersion=true',
        '-Prelease.releaseVersion=1.0.0',
        '-Prelease.newVersion=2.0.0',
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion'
      ]);
    });

    test('should version release - minor version', async () => {
      mockRead('version=1.1.0');
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.minor);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'release',
        '-Prelease.useAutomaticVersion=true',
        '-Prelease.releaseVersion=1.1.0',
        '-Prelease.newVersion=1.2.0',
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion'
      ]);
    });

    test('should read version from version file if not in properties file', async () => {
      mockRead('').mockReturnValueOnce('version=1.0.0');
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'release',
        '-Prelease.useAutomaticVersion=true',
        '-Prelease.releaseVersion=1.0.0',
        '-Prelease.newVersion=1.0.1',
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion'
      ]);
    });

    test('should version release - minor w/ default snapshot', async () => {
      mockRead('version=1.0.0-SNAPSHOT');
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'release',
        '-Prelease.useAutomaticVersion=true',
        '-Prelease.releaseVersion=1.0.0',
        '-Prelease.newVersion=1.0.1-SNAPSHOT',
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion'
      ]);
    });

    test('should version release - minor w/ custom snapshot', async () => {
      mockRead(`
        version=1.0.0.SNAP
        snapshotSuffix=.SNAP
      `);
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'release',
        '-Prelease.useAutomaticVersion=true',
        '-Prelease.releaseVersion=1.0.0',
        '-Prelease.newVersion=1.0.1.SNAP',
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion'
      ]);
    });
  });
});

describe('Gradle Plugin - Custom Command', () => {
  let hooks: Auto.IAutoHooks;
  const options: IGradleReleasePluginPluginOptions = {
    gradleCommand: './gradlew',
    gradleOptions: ['-P prop=val']
  };

  beforeEach(() => {
    const plugin = new GradleReleasePlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog() } as Auto.Auto);
  });

  describe('version', () => {
    test('should version release - patch version - with custom gradle command', async () => {
      mockRead('version=1.0.0');
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradlew'), [
        'release',
        '-Prelease.useAutomaticVersion=true',
        '-Prelease.releaseVersion=1.0.0',
        '-Prelease.newVersion=1.0.1',
        '-x createReleaseTag',
        '-x preTagCommit',
        '-x commitNewVersion',
        '-P prop=val'
      ]);
    });
  });
});

describe('readPropertiesFile', () => {
  describe('readPropertiesFile', () => {
    test('should read properties from file', async () => {
      mockRead(`
        version=1.0.0
        snapshotSuffix=-SNAPSHOT
      `);
      expect(await readPropertiesFile('')).toStrictEqual({
        version: '1.0.0',
        snapshotSuffix: '-SNAPSHOT'
      });
    });

    test('should read nothing from empty file', async () => {
      mockRead('');
      expect(await readPropertiesFile('')).toStrictEqual({});
    });

    test('should throw when no gradle.properties', async () => {
      await expect(readPropertiesFile('')).rejects.toThrowError(
        'Config file not found.'
      );
    });
  });
});
