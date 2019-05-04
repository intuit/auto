import NpmPlugin from '..';
import makeCommitFromMsg from '../../../__tests__/make-commit-from-msg';
import Auto from '../../../auto';
import Changelog from '../../../changelog';
import LogParse from '../../../log-parse';
import { defaultLabelDefinition } from '../../../release';
import { dummyLog } from '../../../utils/logger';
import { makeHooks } from '../../../utils/make-hooks';

const exec = jest.fn();

exec.mockReturnValueOnce(
  'packages/@foobar/release/README.md\npackages/@foobar/party/package.json'
);
exec.mockReturnValueOnce(
  'packages/@foobar/release/README.md\npackages/@foobar/party/package.json'
);
exec.mockReturnValueOnce('');
exec.mockReturnValueOnce('packages/@foobar/release/README.md');

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

const logParse = new LogParse();
const commitsPromise = logParse.normalizeCommits([
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
  })
]);

test('should create sections for packages', async () => {
  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const changelog = new Changelog(dummyLog(), {
    owner: 'andrew',
    repo: 'test',
    jira: 'jira.com',
    baseUrl: 'https://github.custom.com/',
    labels: defaultLabelDefinition,
    baseBranch: 'master'
  });

  plugin.apply({ hooks, logger: dummyLog() } as Auto);
  hooks.onCreateChangelog.call(changelog);
  changelog.loadDefaultHooks();

  const commits = await commitsPromise;
  expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
});
