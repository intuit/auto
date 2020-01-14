import * as Auto from '@auto-it/core';
import { execSync } from 'child_process';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import makeCommitFromMsg from '@auto-it/core/dist/__tests__/make-commit-from-msg';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import fs from 'fs';

import AllContributors from '../src';

const exec = jest.fn();
const gitShow = jest.fn();
gitShow.mockReturnValue('');
exec.mockReturnValue('');
jest.mock('child_process');
// @ts-ignore
execSync.mockImplementation(exec);
// @ts-ignore
jest.spyOn(Auto, 'execPromise').mockImplementation(gitShow);

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
          files: [],
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
