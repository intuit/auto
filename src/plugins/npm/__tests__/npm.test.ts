import NPMPlugin, {
  changedPackages,
  getMonorepoPackage,
  greaterRelease
} from '..';
import { Auto } from '../../../main';
import SEMVER from '../../../semver';
import { dummyLog } from '../../../utils/logger';
import { makeHooks } from '../../../utils/make-hooks';

const exec = jest.fn();
const monorepoPackages = jest.fn();
const existsSync = jest.fn();
const readFileSync = jest.fn();
const writeSpy = jest.fn();

let readResult = '{}';
readFileSync.mockReturnValue('{}');

// @ts-ignore
jest.mock('../../../utils/exec-promise.ts', () => (...args) => exec(...args));
jest.mock('env-ci', () => () => ({ isCi: false }));
jest.mock('get-monorepo-packages', () => () => monorepoPackages());
jest.mock('fs', () => ({
  // @ts-ignore
  existsSync: (...args) => existsSync(...args),
  // @ts-ignore
  readFile: (a, b, cb) => {
    cb(undefined, readResult);
  },
  // @ts-ignore
  readFileSync: (...args) => readFileSync(...args),
  // @ts-ignore
  ReadStream: () => undefined,
  // @ts-ignore
  WriteStream: () => undefined,
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: (file, data, cb) => {
    cb(undefined, writeSpy(file, data));
  }
}));

const monorepoPackagesResult = [
  {
    package: { version: '0.1.1' }
  },
  { package: {} },
  {
    package: { version: '0.1.2' }
  },
  {
    package: { version: '0.1.1' }
  }
];

describe('changedPackages ', () => {
  test('should return nothing without a package directory', async () => {
    exec.mockReturnValueOnce(`packages/README.md\npackage.json`);

    expect(await changedPackages('sha', [], {}, dummyLog())).toEqual([]);
  });

  test('should match files in package directory', async () => {
    exec.mockReturnValueOnce(
      `packages/foo/README.md\npackages/bar/package.json`
    );

    expect(await changedPackages('sha', [], {}, dummyLog())).toEqual([
      'foo',
      'bar'
    ]);
  });

  test('should match files in package directory with @scope/ names', async () => {
    exec.mockReturnValueOnce(
      `packages/@scope/foo/README.md\npackages/@scope/bar/package.json`
    );

    expect(await changedPackages('sha', [], {}, dummyLog())).toEqual([
      '@scope/foo',
      '@scope/bar'
    ]);
  });
});

describe('getMonorepoPackage', () => {
  test('should default to 0.0.0', () => {
    monorepoPackages.mockReturnValueOnce([]);
    expect(getMonorepoPackage()).toEqual({});
  });

  test('should find greatest package version', () => {
    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    expect(getMonorepoPackage()).toEqual({ version: '0.1.2' });
  });
});

const prefixRelease = (str: string) => str;

describe('greaterRelease', () => {
  test('should default to packageVersion if not published', async () => {
    exec.mockImplementationOnce(() => {
      throw new Error('could not find name');
    });
    expect(
      await greaterRelease(prefixRelease, 'test-package-name', '1.0.0')
    ).toBe('1.0.0');
  });
  test('should default to packageVersion if greatest', async () => {
    exec.mockReturnValueOnce('0.5.0');
    expect(
      await greaterRelease(prefixRelease, 'test-package-name', '1.0.0')
    ).toBe('1.0.0');
  });
  test('should default to publishedVersion if greatest', async () => {
    exec.mockReturnValueOnce('1.0.1');
    expect(
      await greaterRelease(prefixRelease, 'test-package-name', '1.0.0')
    ).toBe('1.0.1');
  });
});

describe('getAuthor', () => {
  test('should do nothing if no author', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "test"
      }
    `;
    expect(await hooks.getAuthor.promise()).toBeUndefined();
  });

  test('should get author object from package.json', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "test",
        "author": {
          "name": "Adam",
          "email": "adam@email.com"
        }
      }
    `;
    expect(await hooks.getAuthor.promise()).toEqual({
      name: 'Adam',
      email: 'adam@email.com'
    });
  });

  test('should get parse author as string', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "test",
        "author": "Adam<adam@email.com>"
      }
    `;
    expect(await hooks.getAuthor.promise()).toEqual({
      name: 'Adam',
      email: 'adam@email.com'
    });
  });
});

describe('getPreviousVersion', () => {
  test('should get use 0 if not version in package.json', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    existsSync.mockReturnValueOnce(false);
    existsSync.mockReturnValueOnce(true);
    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "test"
      }
    `;
    expect(await hooks.getPreviousVersion.promise(str => str)).toBe('0.0.0');
  });

  test('should get version from the package.json', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    existsSync.mockReturnValueOnce(false);
    existsSync.mockReturnValueOnce(true);
    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "test",
        "version": "1.0.0"
      }
    `;
    expect(await hooks.getPreviousVersion.promise(str => str)).toBe('1.0.0');
  });

  test('should get version from the lerna.json', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    existsSync.mockReturnValueOnce(true);
    monorepoPackages.mockReturnValueOnce([]);
    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "test",
        "version": "2.0.0"
      }
    `;
    expect(await hooks.getPreviousVersion.promise(str => str)).toBe('2.0.0');
  });

  test('should get version greatest published monorepo package', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    // isMonorepo
    existsSync.mockReturnValueOnce(true);
    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    readResult = `
      {
        "name": "test",
        "version": "0.0.1"
      }
    `;
    // published version of test package
    exec.mockReturnValueOnce('0.1.2');

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    expect(await hooks.getPreviousVersion.promise(str => str)).toBe('0.1.2');
  });
});

test('should use string semver if no published package', async () => {
  const plugin = new NPMPlugin({ setRcToken: false });

  expect(plugin).toEqual({
    forcePublish: true,
    name: 'NPM',
    setRcToken: false
  });
});

describe('publish', () => {
  beforeEach(() => {
    exec.mockClear();
  });

  test('throws when working dir not clean', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      getCurrentVersion: () => '1.2.3',
      git: { getLatestRelease: () => '1.2.3' }
    } as unknown) as Auto);

    readResult = `
      {
        "name": "test"
      }
    `;

    exec.mockReturnValueOnce('m Somefile.txt');

    await expect(hooks.version.promise(SEMVER.patch)).rejects.toBeInstanceOf(
      Error
    );
  });

  test('should use silly logging in verbose mode', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();
    const logger = dummyLog();
    logger.logLevel = 'veryVerbose';

    plugin.apply({ hooks, logger } as Auto);

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.version.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npm', [
      'version',
      SEMVER.patch,
      '-m',
      '"Bump version to: %s [skip ci]"',
      '--loglevel',
      'silly'
    ]);
  });

  test('should use string semver if no published package', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.version.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npm', [
      'version',
      SEMVER.patch,
      '-m',
      '"Bump version to: %s [skip ci]"'
    ]);
  });

  test('monorepo - should use start version at 0 if no published package', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    existsSync.mockReturnValueOnce(true);
    monorepoPackages.mockReturnValueOnce([]);

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.version.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npx', [
      'lerna',
      'version',
      'patch',
      '--force-publish',
      '--no-commit-hooks',
      '--yes',
      '-m',
      "'Bump version to: %v [skip ci]'"
    ]);
  });

  test('monorepo - should be able to not force publish all packages', async () => {
    const plugin = new NPMPlugin({ forcePublish: false });
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    existsSync.mockReturnValueOnce(true);
    monorepoPackages.mockReturnValueOnce([]);

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.version.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npx', [
      'lerna',
      'version',
      'patch',
      false,
      '--no-commit-hooks',
      '--yes',
      '-m',
      "'Bump version to: %v [skip ci]'"
    ]);
  });

  test('monorepo - should publish', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    existsSync.mockReturnValueOnce(true);

    await hooks.publish.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npx', [
      'lerna',
      'publish',
      '--yes',
      'from-git'
    ]);
  });

  test('should bump published version', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    exec.mockReturnValueOnce('');
    exec.mockReturnValueOnce('1.0.0');

    readResult = `
      {
        "name": "test",
        "version": "0.0.0"
      }
    `;

    await hooks.version.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npm', [
      'version',
      '1.0.1',
      '-m',
      '"Bump version to: %s [skip ci]"'
    ]);
  });

  test('monorepo - should bump published version', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    existsSync.mockReturnValueOnce(true);
    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    exec.mockReturnValueOnce('');
    exec.mockReturnValueOnce('1.0.0');

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.version.promise(SEMVER.patch);
    expect(exec).toHaveBeenNthCalledWith(3, 'npx', [
      'lerna',
      'version',
      '1.0.1',
      '--force-publish',
      '--no-commit-hooks',
      '--yes',
      '-m',
      "'Bump version to: %v [skip ci]'"
    ]);
  });

  test('should publish public scoped packages to public', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "@scope/test"
      }
    `;

    await hooks.publish.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npm', ['publish', '--access', 'public']);
  });

  test('should publish private scoped packages to private', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "@scope/test",
        "private": true
      }
    `;

    await hooks.publish.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npm', ['publish']);
  });

  test('should publish private scoped packages to private', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);

    readResult = `
      {
        "name": "@scope/test",
        "private": true
      }
    `;

    await hooks.publish.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npm', ['publish']);
  });
});

describe('canary', () => {
  beforeEach(() => {
    exec.mockClear();
  });

  test('throws when working dir not clean', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      getCurrentVersion: () => '1.2.3',
      git: { getLatestRelease: () => '1.2.3' }
    } as unknown) as Auto);

    readResult = `
      {
        "name": "test"
      }
    `;

    exec.mockReturnValueOnce('m Somefile.txt');

    await expect(
      hooks.canary.promise(SEMVER.patch, '.123.1')
    ).rejects.toBeInstanceOf(Error);
  });

  test('use npm for normal package', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      getCurrentVersion: () => '1.2.3',
      git: { getLatestRelease: () => '1.2.3' }
    } as unknown) as Auto);

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.canary.promise(SEMVER.patch, '.123.1');
    expect(exec.mock.calls[1]).toContain('npm');
    expect(exec.mock.calls[1][1]).toContain('1.2.4-canary.123.1');
  });

  test('publishes to public for scoped packages', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      getCurrentVersion: () => '1.2.3',
      git: { getLatestRelease: () => '1.2.3' }
    } as unknown) as Auto);

    readResult = `
      {
        "name": "@scope/test"
      }
    `;

    await hooks.canary.promise(SEMVER.patch, '');
    expect(exec.mock.calls[2][1]).toContain('public');
  });

  test('use lerna for monorepo package', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    existsSync.mockReturnValueOnce(true);

    readResult = `
      {
        "name": "test"
      }
    `;
    exec.mockReturnValueOnce('');
    exec.mockReturnValue(
      Promise.resolve(
        `path/to/package:@foo/app:1.2.3-canary.0\npath/to/package:@foo/lib:1.2.3-canary.0`
      )
    );

    const value = await hooks.canary.promise(SEMVER.patch, '');
    expect(exec.mock.calls[1][1]).toContain('lerna');
    expect(value).toBe('1.2.3-canary.0');
  });

  test('error when no canary release found', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    existsSync.mockReturnValueOnce(true);

    readResult = `
      {
        "name": "test"
      }
    `;
    exec.mockReturnValueOnce('');
    exec.mockReturnValue(
      Promise.resolve(
        `path/to/package:@foo/app:1.2.3\npath/to/package:@foo/lib:1.2.3`
      )
    );

    const value = await hooks.canary.promise(SEMVER.patch, '');
    expect(value).toEqual({
      error: 'No packages were changed. No canary published.'
    });
  });

  test('use lerna for independent monorepo', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "independent" }');

    readResult = `
      {
        "name": "test"
      }
    `;
    exec.mockReturnValueOnce('');
    exec.mockReturnValue(
      Promise.resolve(
        'path/to/package:@foo/app:1.2.4-canary.0\npath/to/package:@foo/lib:1.1.0-canary.0'
      )
    );

    const value = await hooks.canary.promise(SEMVER.patch, '');
    expect(value).toBe(
      '\n - @foo/app@1.2.4-canary.0\n - @foo/lib@1.1.0-canary.0'
    );
  });

  test('error when no canary release found - independent', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    existsSync.mockReturnValueOnce(true);
    readFileSync.mockReturnValue('{ "version": "independent" }');

    readResult = `
      {
        "name": "test"
      }
    `;
    exec.mockReturnValueOnce('');
    exec.mockReturnValue(
      Promise.resolve(
        'path/to/package:@foo/app:1.2.4\npath/to/package:@foo/lib:1.1.0'
      )
    );

    const value = await hooks.canary.promise(SEMVER.patch, '');
    expect(value).toEqual({
      error: 'No packages were changed. No canary published.'
    });
  });
});
