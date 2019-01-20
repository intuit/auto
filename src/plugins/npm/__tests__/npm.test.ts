import NPMPlugin, {
  changedPackages,
  getMonorepoPackage,
  greaterRelease
} from '..';
import { AutoRelease } from '../../../main';
import SEMVER from '../../../semver';
import { dummyLog } from '../../../utils/logger';
import { makeHooks } from '../../../utils/make-hooks';

const exec = jest.fn();
const monorepoPackages = jest.fn();
const existsSync = jest.fn();
const writeSpy = jest.fn();

let readResult = '{}';

// @ts-ignore
jest.mock('../../../utils/exec-promise.ts', () => (...args) => exec(...args));
jest.mock('get-monorepo-packages', () => () => monorepoPackages());
jest.mock('fs', () => ({
  // @ts-ignore
  existsSync: (...args) => existsSync(...args),
  // @ts-ignore
  readFile: (a, b, cb) => {
    cb(null, readResult);
  },
  // @ts-ignore
  ReadStream: () => undefined,
  // @ts-ignore
  WriteStream: () => undefined,
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: (file, data, cb) => {
    cb(null, writeSpy(file, data));
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

describe('changedPackages ', async () => {
  test('should return nothing without a package directory', async () => {
    exec.mockReturnValueOnce(`packages/README.md\npackage.json`);

    expect(await changedPackages('sha', dummyLog())).toEqual([]);
  });

  test('should match files in package directory', async () => {
    exec.mockReturnValueOnce(
      `packages/foo/README.md\npackages/bar/package.json`
    );

    expect(await changedPackages('sha', dummyLog())).toEqual(['foo', 'bar']);
  });

  test('should match files in package directory with @scope/ names', async () => {
    exec.mockReturnValueOnce(
      `packages/@scope/foo/README.md\npackages/@scope/bar/package.json`
    );

    expect(await changedPackages('sha', dummyLog())).toEqual([
      '@scope/foo',
      '@scope/bar'
    ]);
  });
});

describe('getMonorepoPackage', () => {
  test('should default to 0.0.0', () => {
    monorepoPackages.mockReturnValueOnce([]);
    expect(getMonorepoPackage()).toEqual({ version: '0.0.0' });
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

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

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

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

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

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

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
  test('should get version from the package.json', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    existsSync.mockReturnValueOnce(false);
    existsSync.mockReturnValueOnce(true);
    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

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
    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

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

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

    expect(await hooks.getPreviousVersion.promise(str => str)).toBe('0.1.2');
  });
});

describe('publish', () => {
  test('should use string semver if no published package', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.publish.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npm', [
      'version',
      SEMVER.patch,
      '-m',
      '"Bump version to: %s [skip ci]"'
    ]);
  });

  test('monorepo - should use string semver if no published package', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

    existsSync.mockReturnValueOnce(true);
    monorepoPackages.mockReturnValueOnce([]);

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.publish.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npx', [
      'lerna',
      'publish',
      '--yes',
      '--force-publish=*',
      SEMVER.patch,
      '-m',
      "'%v [skip ci]'"
    ]);
  });

  test('should bump published version', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

    exec.mockReturnValueOnce('1.0.0');

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.publish.promise(SEMVER.patch);
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

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

    existsSync.mockReturnValueOnce(true);
    monorepoPackages.mockReturnValueOnce(monorepoPackagesResult);
    exec.mockReturnValueOnce('1.0.0');

    readResult = `
      {
        "name": "test"
      }
    `;

    await hooks.publish.promise(SEMVER.patch);
    expect(exec).toHaveBeenCalledWith('npx', [
      'lerna',
      'publish',
      '--yes',
      '--force-publish=*',
      '1.0.1',
      '-m',
      "'%v [skip ci]'"
    ]);
  });

  test('should publish public scoped packages to public', async () => {
    const plugin = new NPMPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

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

    plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

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
