import { changedPackages } from '../';
import { dummyLog } from '../../../utils/logger';

const exec = jest.fn();

// @ts-ignore
jest.mock('../../../utils/exec-promise.ts', () => (...args) => exec(...args));

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
