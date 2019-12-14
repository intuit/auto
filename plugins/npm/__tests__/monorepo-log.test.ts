import * as Auto from '@auto-it/core';
import makeCommitFromMsg from '@auto-it/core/dist/__tests__/make-commit-from-msg';
import Changelog from '@auto-it/core/dist/changelog';
import LogParse from '@auto-it/core/dist/log-parse';
import { defaultLabels } from '@auto-it/core/dist/release';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import NpmPlugin from '../src';

const exec = jest.fn();
const readFileSync = jest.fn();

jest.spyOn(Auto, 'execPromise').mockImplementation(exec);
jest.mock('fs', () => ({
  // @ts-ignore
  existsSync: jest.fn().mockReturnValue(true),
  // @ts-ignore
  readFile: jest.fn(),
  // @ts-ignore
  readFileSync: () => readFileSync(),
  ReadStream: function() {},
  WriteStream: function() {},
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: jest.fn()
}));

const logParse = new LogParse();
const commitsPromise = logParse.normalizeCommits([
  makeCommitFromMsg('[PLAYA-5052] - Some Feature (#12345)', {
    labels: ['major'],
    files: ['packages/@foobar/release/package.json']
  }),
  makeCommitFromMsg('[PLAYA-5052] - Some Feature - Revert (#12345)', {
    labels: ['major']
  }),
  makeCommitFromMsg('woot (#12343)', {
    labels: ['major']
  }),
  makeCommitFromMsg('Another Feature (#1234)', {
    labels: ['internal']
  })
]);

test('should create sections for packages', async () => {
  let changed = 0;

  exec.mockImplementation(async command => {
    if (command === 'npx') {
      return Promise.resolve(
        'packages/@foobar/release:@foobar/release:1.0.0\npackages/@foobar/party:@foobar/party:1.0.0'
      );
    }

    changed++;

    if (changed === 3) {
      return Promise.resolve('');
    }

    if (changed === 4) {
      return Promise.resolve('packages/@foobar/release/README.md');
    }

    return Promise.resolve(
      'packages/@foobar/release/README.md\npackages/@foobar/party/package.jso'
    );
  });

  readFileSync.mockReturnValue('{}');

  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const changelog = new Changelog(dummyLog(), {
    owner: 'andrew',
    repo: 'test',
    baseUrl: 'https://github.custom.com/',
    labels: defaultLabels,
    baseBranch: 'master',
    prereleaseBranches: ['next']
  });

  plugin.apply({
    config: { prereleaseBranches: ['next'] },
    hooks,
    logger: dummyLog()
  } as Auto.Auto);
  hooks.onCreateChangelog.call(changelog, Auto.SEMVER.patch);
  changelog.loadDefaultHooks();

  const commits = await commitsPromise;
  expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
});

test('should add versions for independent packages', async () => {
  let changed = 0;
  exec.mockImplementation(async command => {
    if (command === 'npx') {
      return Promise.resolve(
        'packages/@foobar/release:@foobar/release:1.0.0\npackages/@foobar/party:@foobar/party:1.0.2'
      );
    }

    changed++;

    if (changed === 3) {
      return Promise.resolve('');
    }

    if (changed === 4) {
      return Promise.resolve('packages/@foobar/release/README.md');
    }

    return Promise.resolve(
      'packages/@foobar/release/README.md\npackages/@foobar/party/package.jso'
    );
  });

  readFileSync.mockReturnValue('{ "version": "independent" }');

  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const changelog = new Changelog(dummyLog(), {
    owner: 'andrew',
    repo: 'test',
    baseUrl: 'https://github.custom.com/',
    labels: defaultLabels,
    baseBranch: 'master',
    prereleaseBranches: ['next']
  });

  plugin.apply({
    config: { prereleaseBranches: ['next'] },
    hooks,
    logger: dummyLog()
  } as Auto.Auto);
  hooks.onCreateChangelog.call(changelog, Auto.SEMVER.patch);
  changelog.loadDefaultHooks();

  const commits = await commitsPromise;
  expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
});

test('should create extra change logs for sub-packages', async () => {
  readFileSync.mockReturnValue('{ "version": "independent" }');

  exec.mockImplementation(async command => {
    if (command === 'npx') {
      return Promise.resolve(
        'packages/@foobar/release:@foobar/release:1.0.0\npackages/@foobar/party:@foobar/party:1.0.0'
      );
    }

    return Promise.resolve(
      'packages/@foobar/release/README.md\npackages/@foobar/party/package.json'
    );
  });

  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const update = jest.fn();

  plugin.apply({
    config: { prereleaseBranches: ['next'] },
    hooks,
    logger: dummyLog(),
    release: {
      updateChangelogFile: update,
      makeChangelog: () => {
        const t = new Changelog(dummyLog(), {
          owner: 'andrew',
          repo: 'test',
          baseUrl: 'https://github.custom.com/',
          labels: defaultLabels,
          baseBranch: 'master',
          prereleaseBranches: ['next']
        });
        t.hooks.renderChangelogTitle.tap('test', label => label);
        return t;
      }
    } as any
  } as Auto.Auto);
  await hooks.beforeCommitChangelog.promise({
    bump: Auto.SEMVER.patch,
    commits: await commitsPromise,
    currentVersion: '1.0.0',
    lastRelease: '0.1.0',
    releaseNotes: ''
  });

  expect(update).toHaveBeenCalledWith(
    'v1.0.1',
    'major\n- [PLAYA-5052] - Some Feature [#12345](https://github.custom.com/pull/12345)',
    'packages/@foobar/release/CHANGELOG.md'
  );
});
