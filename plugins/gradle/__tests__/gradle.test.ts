import * as Auto from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import GradleReleasePlugin, {
  IGradleReleasePluginPluginOptions,
  getProperties
} from '../src';

const mockProperties = (properties: string) =>
  jest
    .spyOn(Auto, 'execPromise')
    .mockReturnValueOnce(Promise.resolve(properties));

describe('Gradle Plugin', () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    version => `v${version}`
  );
  const options: IGradleReleasePluginPluginOptions = {};

  beforeEach(() => {
    const plugin = new GradleReleasePlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog(), prefixRelease } as Auto.Auto);
  });

  describe('getPreviousVersion', () => {
    test('should get previous version from gradle properties', async () => {
      mockProperties('version: 1.0.0');
      expect(await hooks.getPreviousVersion.promise()).toBe('v1.0.0');
    });

    test('should get previous version snapshot from gradle properties', async () => {
      mockProperties('version: 1.0.0-SNAPSHOT');
      expect(await hooks.getPreviousVersion.promise()).toBe('v1.0.0');
    });

    test('should throw when no version', async () => {
      mockProperties('');
      await expect(hooks.getPreviousVersion.promise()).rejects.toThrowError(
        'No version was found in gradle properties.'
      );
    });
  });

  describe('beforeRun & version', () => {
    test('should version release - patch version', async () => {
      const properties = 'version: 1.0.0';
      mockProperties(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      mockProperties(properties).mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'updateVersion',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.newVersion=1.0.1`
      ]);
    });

    test('should version release - major version', async () => {
      const properties = 'version: 1.0.0';
      mockProperties(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      mockProperties(properties).mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.major);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'updateVersion',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.newVersion=2.0.0`
      ]);
    });

    test('should version release - minor version', async () => {
      const properties = 'version: 1.1.0';
      mockProperties(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      mockProperties(properties).mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.minor);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'updateVersion',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.newVersion=1.2.0`
      ]);
    });

    test('should version release - patch w/ default snapshot', async () => {
      const properties = 'version: 1.0.0-SNAPSHOT';
      mockProperties(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      mockProperties(properties).mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'updateVersion',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.newVersion=1.0.0`
      ]);
    });

    test('should version release - patch w/ custom snapshot', async () => {
      const properties = `
      version: 1.0.0.SNAP
      snapshotSuffix: .SNAP
    `;
      mockProperties(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      mockProperties(properties).mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradle'), [
        'updateVersion',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.newVersion=1.0.0`
      ]);
    });
  });
});

describe('Gradle Plugin - Custom Command', () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    version => `v${version}`
  );
  const options: IGradleReleasePluginPluginOptions = {
    gradleCommand: './gradlew',
    gradleOptions: ['-P prop=val']
  };

  beforeEach(() => {
    const plugin = new GradleReleasePlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog(), prefixRelease } as Auto.Auto);
  });

  describe('version', () => {
    test('should version release - patch version - with custom gradle command', async () => {
      const spy = jest.fn();
      mockProperties('version: 1.0.0').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);

      expect(spy).toHaveBeenCalledWith(expect.stringMatching('gradlew'), [
        'updateVersion',
        '-Prelease.useAutomaticVersion=true',
        `-Prelease.newVersion=1.0.1`,
        '-P prop=val'
      ]);
    });
  });
});

describe('getProperties', () => {
  test('should read properties from file', async () => {
    mockProperties(`
      version: 1.0.0
      snapshotSuffix: :SNAPSHOT
    `);
    expect(await getProperties('')).toStrictEqual({
      version: '1.0.0',
      snapshotSuffix: ':SNAPSHOT'
    });
  });

  test('should read nothing from empty file', async () => {
    mockProperties('');
    expect(await getProperties('')).toStrictEqual({});
  });
});
