import NpmPlugin from '..';
import makeCommitFromMsg from '../../../__tests__/make-commit-from-msg';
import { makeHooks } from '../../../__tests__/utils';
import { defaultChangelogTitles, defaultLabels } from '../../../github-release';
import generateReleaseNotes, { normalizeCommits } from '../../../log-parse';
import { AutoRelease } from '../../../main';
import { dummyLog } from '../../../utils/logger';

const exec = jest.fn();

// @ts-ignore
jest.mock('../../../utils/exec-promise.ts', () => (...args) => exec(...args));
jest.mock('fs', () => ({
  // @ts-ignore
  existsSync: jest.fn().mockReturnValue(true),
  // @ts-ignore
  readFile: jest.fn(),
  // @ts-ignore
  ReadStream: () => undefined,
  // @ts-ignore
  WriteStream: () => undefined,
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: jest.fn()
}));

test('should create sections for packages', async () => {
  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  plugin.apply({ hooks, logger: dummyLog() } as AutoRelease);

  exec.mockReturnValueOnce(
    'packages/@foobar/release/README.md\npackages/@foobar/party/package.json'
  );
  exec.mockReturnValueOnce(
    'packages/@foobar/release/README.md\npackages/@foobar/party/package.json'
  );
  exec.mockReturnValueOnce('');
  exec.mockReturnValueOnce('packages/@foobar/release/README.md');

  expect(
    await generateReleaseNotes(
      normalizeCommits([
        makeCommitFromMsg('[PLAYA-5052] - Some Feature (#12345)', {
          labels: ['major']
        }),
        makeCommitFromMsg('[PLAYA-5052] - Some Feature - Revert (#12345)', {
          labels: ['major']
        }),
        makeCommitFromMsg('woot (#12343)', {
          labels: ['major']
        }),
        makeCommitFromMsg('Another Feature (#1234)', {
          labels: ['internal']
        }),
        makeCommitFromMsg('Third')
      ]),
      dummyLog(),
      {
        owner: 'andrew',
        repo: 'test',
        jira: 'jira.com',
        baseUrl: 'https://github.custom.com/',
        changelogTitles: defaultChangelogTitles,
        versionLabels: defaultLabels,
        renderChangelogLine: hooks.renderChangelogLine
      }
    )
  ).toMatchSnapshot();
});
