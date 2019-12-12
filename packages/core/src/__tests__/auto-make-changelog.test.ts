import Auto from '../auto';
import { dummyLog } from '../utils/logger';
import child from 'child_process';

jest
  .spyOn(child, 'execSync')
  .mockImplementation()
  // @ts-ignore
  .mockReturnValue('');

const importMock = jest.fn();
jest.mock('import-cwd', () => (path: string) => importMock(path));
jest.mock('env-ci', () => () => ({ isCi: false, branch: 'master' }));
jest.mock('../utils/exec-promise', () => () => '');

const defaults = {
  owner: 'foo',
  repo: 'bar',
  token: 'XXXX'
};

const search = jest.fn();
jest.mock('cosmiconfig', () => ({
  cosmiconfig: () => ({
    search
  })
}));

jest.mock('@octokit/rest', () => {
  const instance = class MockOctokit {
    static plugin = () => instance;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } })
    };

    hook = {
      error: () => undefined
    };
  };

  return instance;
});

// @ts-ignore
jest.mock('gitlog', () => (a, cb) => {
  cb(undefined, [
    {
      rawBody: 'foo'
    },
    {
      rawBody: 'foo'
    }
  ]);
});

describe('Auto', () => {
  test('should add to changelog', async () => {
    const auto = new Auto({
      plugins: [],
      ...defaults
    });

    auto.logger = dummyLog();
    await auto.loadConfig();

    const addToChangelog = jest.fn();
    auto.release!.addToChangelog = addToChangelog;
    jest.spyOn(auto.release!, 'generateReleaseNotes').mockImplementation();
    jest.spyOn(auto.release!, 'getCommitsInRelease').mockImplementation();

    await auto.changelog({ from: 'v1.0.0' });
    expect(addToChangelog).toHaveBeenCalled();
  });
});
