import GitHub from '../git';
import { dummyLog } from '../utils/logger';

const exec = jest.fn();

const logger = dummyLog();

// @ts-ignore
jest.mock('../utils/exec-promise.ts', () => (...args) => exec(...args));

describe('changedPackages ', async () => {
  test('should return nothing without a package directory', async () => {
    const gh = new GitHub({
      logger,
      owner: 'Adam Dierkens',
      repo: 'test',
      token: 'MyToken'
    });

    exec.mockReturnValueOnce(`packages/README.md\npackage.json`);

    expect(await gh.changedPackages('sha')).toEqual([]);
  });

  test('should match files in package directory', async () => {
    const gh = new GitHub({
      logger,
      owner: 'Adam Dierkens',
      repo: 'test',
      token: 'MyToken'
    });

    exec.mockReturnValueOnce(
      `packages/foo/README.md\npackages/bar/package.json`
    );

    expect(await gh.changedPackages('sha')).toEqual(['foo', 'bar']);
  });

  test('should match files in package directory with @scope/ names', async () => {
    const gh = new GitHub({
      logger,
      owner: 'Adam Dierkens',
      repo: 'test',
      token: 'MyToken'
    });

    exec.mockReturnValueOnce(
      `packages/@scope/foo/README.md\npackages/@scope/bar/package.json`
    );

    expect(await gh.changedPackages('sha')).toEqual([
      '@scope/foo',
      '@scope/bar'
    ]);
  });
});
