import * as Auto from '@auto-it/core';
import { execSync } from 'child_process';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import makeCommitFromMsg from '@auto-it/core/dist/__tests__/make-commit-from-msg';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import fs from 'fs';

import AllContributors from '../src';

const exec = jest.fn();
const gitShow = jest.fn();
const getLernaPackages = jest.fn();

getLernaPackages.mockReturnValue(Promise.resolve([]));
gitShow.mockReturnValue(Promise.resolve(''));
exec.mockReturnValue('');

jest.mock('child_process');
// @ts-ignore
execSync.mockImplementation(exec);
// @ts-ignore
jest.spyOn(Auto, 'execPromise').mockImplementation(gitShow);
jest.spyOn(Auto, 'getLernaPackages').mockImplementation(getLernaPackages);
jest.spyOn(process, 'chdir').mockReturnValue();

const mockRead = (result: string) =>
  jest
    .spyOn(fs, 'readFileSync')
    // @ts-ignore
    .mockReturnValueOnce(result);

describe('All Contributors Plugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should do nothing for username-less commits', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead('{ "contributors": [] }');

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        makeCommitFromMsg('Do the stuff'),
        makeCommitFromMsg('Do the thing', {
          files: ['src/index.ts']
        })
      ]
    });

    expect(exec).not.toHaveBeenCalled();
  });

  test('should find a single contribution', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead('{ "contributors": [] }');

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        {
          subject: 'Do the thing',
          hash: '123',
          labels: [],
          files: ['src/index.ts'],
          authors: [{ username: 'Jeff', hash: '123' }]
        }
      ]
    });

    expect(exec.mock.calls[0][0]).toBe(
      'npx all-contributors-cli add Jeff code'
    );
  });

  test('should work for single package', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();

    mockRead('{ "contributors": [] }');
    getLernaPackages.mockRejectedValueOnce(new Error('test'));

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        {
          subject: 'Do the thing',
          hash: '123',
          labels: [],
          files: ['src/index.ts'],
          authors: [{ username: 'Jeff', hash: '123' }]
        }
      ]
    });

    expect(exec.mock.calls[0][0]).toBe(
      'npx all-contributors-cli add Jeff code'
    );
  });

  test('should find contributions from merge commit', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead('{ "contributors": [] }');
    gitShow.mockReturnValueOnce('src/index.ts');

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        {
          subject: 'Do the thing',
          hash: '123',
          labels: [],
          files: ['src/index.ts'],
          authors: [{ username: 'Jeff', hash: '123' }]
        }
      ]
    });

    expect(exec.mock.calls[0][0]).toBe(
      'npx all-contributors-cli add Jeff code'
    );
  });

  test('should find a multiple contributions', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead('{ "contributors": [] }');

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        {
          subject: 'Do the thing',
          hash: '123',
          labels: [],
          files: ['src/index.ts'],

          authors: [{ username: 'Jeff', hash: '123' }]
        },
        {
          subject: 'Do other thing',
          hash: '123',
          labels: [],
          files: ['src/index.test.ts'],
          authors: [{ username: 'Jeff', hash: '123' }]
        }
      ]
    });

    expect(exec.mock.calls[0][0]).toBe(
      'npx all-contributors-cli add Jeff code,test'
    );
  });

  test('should update sub-packages', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();

    getLernaPackages.mockReturnValueOnce(
      Promise.resolve([
        {
          path: 'packages/app',
          name: '@foobar/app',
          version: '1.2.3'
        },
        {
          path: 'packages/lib',
          name: '@foobar/lib',
          version: '1.2.3'
        }
      ])
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        {
          subject: 'Do the thing',
          hash: '123',
          labels: [],
          files: ['packages/app/src/index.ts'],
          authors: [{ username: 'Jeff', hash: '123' }]
        },
        {
          subject: 'Do the docs',
          hash: '124',
          labels: [],
          files: ['packages/lib/README.md'],
          authors: [{ username: 'Jeff', hash: '124' }]
        }
      ]
    });

    // root contributors
    expect(exec.mock.calls[0][0]).toBe(
      'npx all-contributors-cli add Jeff code,doc'
    );
    // app contributors
    expect(exec.mock.calls[1][0]).toBe(
      'npx all-contributors-cli add Jeff code'
    );
    // lib contributors
    expect(exec.mock.calls[2][0]).toBe('npx all-contributors-cli add Jeff doc');
  });

  test('should update old contributors', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead(
      '{ "contributors": [ { "login": "Jeff", "contributions": ["infra"] } ] }'
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        {
          subject: 'Do the thing',
          hash: '123',
          labels: [],
          files: ['src/index.ts'],
          authors: [{ username: 'Jeff', hash: '123' }]
        }
      ]
    });

    expect(exec.mock.calls[0][0]).toBe(
      'npx all-contributors-cli add Jeff infra,code'
    );
  });

  test('should include sub-commit contributors', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead(
      '{ "contributors": [ { "login": "Jeff", "contributions": ["infra"] } ] }'
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        {
          subject: 'Do the thing',
          hash: '123',
          labels: [],
          files: ['src/index.ts'],
          authors: [
            { username: 'Jeff', hash: '123' },
            { username: 'Adam', hash: '456' }
          ]
        }
      ]
    });

    expect(exec.mock.calls[0][0]).toBe(
      'npx all-contributors-cli add Jeff infra,code'
    );
    expect(exec.mock.calls[1][0]).toBe(
      'npx all-contributors-cli add Adam code'
    );
  });

  test('should not update if no new contribution types', async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead(
      '{ "contributors": [ { "login": "Jeff", "contributions": ["code"] } ] }'
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: '0.0.0',
      lastRelease: '0.0.0',
      releaseNotes: '',
      commits: [
        makeCommitFromMsg('Do the thing', {
          files: ['src/index.ts'],
          username: 'Jeff'
        })
      ]
    });

    expect(exec).not.toHaveBeenCalled();
  });
});
