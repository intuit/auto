import GithubRelease from '../github-release';
import { normalizeCommits } from '../log-parse';
import SEMVER from '../semver';
import { dummyLog } from '../utils/logger';
import makeCommitFromMsg from './make-commit-from-msg';

const logger = dummyLog();

const constructor = jest.fn();
const getGitLog = jest.fn();
const publish = jest.fn();
const getLabels = jest.fn();
const getPullRequest = jest.fn();
const getLatestRelease = jest.fn();
const getSha = jest.fn();
const createStatus = jest.fn();
const getProject = jest.fn();
const createComment = jest.fn();
const changedPackages = jest.fn();
const getCommitsForPR = jest.fn();
const getUserByEmail = jest.fn();
const getUserByUsername = jest.fn();

getProject.mockReturnValue({
  data: { html_url: 'https://custom-git.com' }
});

// @ts-ignore
jest.mock('../git.ts', () => (...args) => {
  constructor(...args);
  return {
    options: { owner: 'test', repo: 'test', version: '1.0.0' },
    getGitLog,
    publish,
    getLabels,
    getLatestRelease,
    getPullRequest,
    getSha,
    createStatus,
    createComment,
    getProject,
    changedPackages,
    getCommitsForPR,
    getUserByUsername,
    getUserByEmail
  };
});

const execSpy = jest.fn();
// @ts-ignore
jest.mock('../utils/exec-promise.ts', () => (...args) => execSpy(...args));

const existsSync = jest.fn();
const writeSpy = jest.fn();

let readResult = '{}';

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

const slackSpy = jest.fn();

jest.mock('../utils/slack.ts', () => () => slackSpy());
jest.mock('../utils/package-config', () => async () => ({}));
jest.mock('../utils/github-token', () => async () => ({}));

describe('GithubRelease', () => {
  beforeEach(() => {
    getGitLog.mockClear();
    publish.mockClear();
    getLabels.mockClear();
    writeSpy.mockClear();
    execSpy.mockClear();
  });

  test('should use options owner, repo, and token', async () => {
    const gh = new GithubRelease({
      owner: 'Andrew',
      repo: 'test',
      token: 'MY_TOKENss'
    });

    await gh.getCommits('12345');

    expect(constructor.mock.calls[0][0].owner).toBe('Andrew');
    expect(constructor.mock.calls[0][0].repo).toBe('test');
  });

  describe('getCommits', async () => {
    test('should default to HEAD', async () => {
      const gh = new GithubRelease();
      await gh.getCommits('12345');
      expect(getGitLog).toHaveBeenCalled();
    });

    test('should use configured HEAD', async () => {
      const gh = new GithubRelease({ owner: 'Adam Dierkens', repo: 'test' });
      await gh.getCommits('12345', '1234');
      expect(getGitLog).toHaveBeenCalled();
    });

    test('should not resolve authors with no PR commits', async () => {
      const commits = [
        makeCommitFromMsg('First'),
        makeCommitFromMsg('Second'),
        makeCommitFromMsg('Third')
      ];

      getGitLog.mockReturnValueOnce(commits);
      const gh = new GithubRelease({ owner: 'Adam Dierkens', repo: 'test' });
      await gh.getCommits('12345', '1234');
      expect(getUserByUsername).not.toHaveBeenCalled();
    });

    test('should resolve authors with PR commits', async () => {
      const commits = normalizeCommits([
        makeCommitFromMsg('First'),
        makeCommitFromMsg('Second (#123)', {
          name: 'Andrew Lisowski',
          email: 'lisowski54@gmail.com'
        }),
        makeCommitFromMsg('Third')
      ]);

      getGitLog.mockReturnValueOnce(commits);
      getCommitsForPR.mockReturnValueOnce([
        {
          author: {
            login: 'andrew'
          }
        }
      ]);
      getUserByUsername.mockReturnValueOnce({
        login: 'andrew',
        name: 'Andrew Lisowski'
      });
      getUserByEmail.mockReturnValueOnce({
        login: 'adam',
        name: 'Adam Dierkens'
      });
      getUserByEmail.mockReturnValueOnce({
        login: 'adam',
        name: 'Adam Dierkens'
      });

      const gh = new GithubRelease({ owner: 'Adam Dierkens', repo: 'test' });
      const modifiedCommits = await gh.getCommits('12345', '1234');
      expect(getUserByUsername).toHaveBeenCalled();
      expect(modifiedCommits).toMatchSnapshot();
    });
  });

  test('publish', async () => {
    const gh = new GithubRelease();
    await gh.publish('release notes', '1.2.3');
    expect(publish).toHaveBeenCalled();
  });

  test('getLabels', async () => {
    const gh = new GithubRelease();
    await gh.getLabels(123);
    expect(getLabels).toHaveBeenCalled();
  });

  test('getLatestRelease', async () => {
    const gh = new GithubRelease();
    await gh.getLatestRelease();
    expect(getLatestRelease).toHaveBeenCalled();
  });

  test('getLatestRelease', async () => {
    const gh = new GithubRelease();
    await gh.getPullRequest(22);
    expect(getLatestRelease).toHaveBeenCalled();
  });

  test('getSha', async () => {
    const gh = new GithubRelease();
    await gh.getSha();
    expect(getLatestRelease).toHaveBeenCalled();
  });

  test('createStatus', async () => {
    const gh = new GithubRelease();
    await gh.createStatus({
      state: 'pending',
      sha: '',
      number: 22,
      context: 'foo',
      url: 'google.com',
      description: 'testing'
    });
    expect(getLatestRelease).toHaveBeenCalled();
  });

  test('createComment', async () => {
    const gh = new GithubRelease();
    await gh.createComment('Some long message', 22);
    expect(createComment).toHaveBeenCalled();
  });

  describe('addToChangelog', async () => {
    test("creates new changelog if one didn't exist", async () => {
      const gh = new GithubRelease();
      await gh.addToChangelog(
        '# My new Notes',
        'klajsdlfk4lj51l43k5hj234l',
        'v0.0.0'
      );

      expect(writeSpy.mock.calls[0][1].includes(`# My new Notes`)).toBe(true);
    });

    test("creates new changelog if one didn't exist", async () => {
      const gh = new GithubRelease();
      await gh.addToChangelog('# My new Notes', 'v1.0.0', 'v1.0.0', false);

      expect(writeSpy.mock.calls[0][1].includes(`v1.0.1`)).toBe(true);
    });

    test('prepends to old changelog', async () => {
      const gh = new GithubRelease();

      existsSync.mockReturnValueOnce(true);
      readResult = '# My old Notes';

      await gh.addToChangelog(
        '# My new Notes',
        'asdfasdlkfjlkj435l2j',
        'v0.0.0'
      );
      expect(writeSpy.mock.calls[0][1].includes(readResult)).toBe(true);
    });

    test('should be able to configure message', async () => {
      const gh = new GithubRelease();
      const message = 'pony foo';

      existsSync.mockReturnValueOnce(true);
      readResult = '# My old Notes';

      await gh.addToChangelog(
        '# My new Notes',
        'asdklfhlkh24387513',
        'v0.0.0',
        false,
        message
      );
      expect(execSpy.mock.calls[1][0].includes(message)).toBe(true);
    });
  });

  test('postToSlack', async () => {
    const gh = new GithubRelease(undefined, {
      logger: dummyLog(),
      slack: 'https://custom-slack-url'
    });
    await gh.postToSlack('# My Notes', 'v1.0.0');
    expect(slackSpy).toHaveBeenCalled();
  });

  describe('generateReleaseNotes', async () => {
    test('should default to HEAD', async () => {
      const gh = new GithubRelease();
      expect(await gh.generateReleaseNotes('1234')).toBe('');
    });

    test('should use configured HEAD', async () => {
      const gh = new GithubRelease();
      expect(await gh.generateReleaseNotes('1234', '123')).toBe('');
    });

    test('should allow user to configure section headings', async () => {
      const gh = new GithubRelease();

      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)'),
        makeCommitFromMsg('Fourth (#1237)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['major']);
      getLabels.mockReturnValueOnce(['minor']);
      getLabels.mockReturnValueOnce(['documentation', 'internal']);
      getLabels.mockReturnValueOnce(['patch']);

      expect(await gh.generateReleaseNotes('1234', '123')).toMatchSnapshot();
    });
  });

  describe('getSemverBump', () => {
    test('default to patch', async () => {
      const gh = new GithubRelease();
      const commits = [
        makeCommitFromMsg('First'),
        makeCommitFromMsg('Second'),
        makeCommitFromMsg('Third')
      ];

      getGitLog.mockReturnValueOnce(commits);

      expect(await gh.getSemverBump('1234')).toBe(SEMVER.patch);
    });

    test('should use higher version', async () => {
      const gh = new GithubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second'),
        makeCommitFromMsg('Third')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['minor']);

      expect(await gh.getSemverBump('1234', '123')).toBe(SEMVER.minor);
    });

    test('should not publish a release', async () => {
      const gh = new GithubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['no-release', 'patch']);
      getLabels.mockReturnValueOnce(['no-release', 'patch']);
      getLabels.mockReturnValueOnce(['no-release', 'minor']);

      expect(await gh.getSemverBump('1234', '123')).toBe('');
    });

    test('should publish a release', async () => {
      const gh = new GithubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['patch']);
      getLabels.mockReturnValueOnce(['no-release', 'patch']);
      getLabels.mockReturnValueOnce(['no-release', 'minor']);

      expect(await gh.getSemverBump('1234', '123')).toBe(SEMVER.minor);
    });

    test('should default to publish a prepatch', async () => {
      const gh = new GithubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['no-release']);
      getLabels.mockReturnValueOnce([]);
      getLabels.mockReturnValueOnce([]);

      expect(await gh.getSemverBump('1234', '123')).toBe('');
    });

    test('should not publish a release in onlyPublishWithReleaseLabel without label', async () => {
      const gh = new GithubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['patch']);
      getLabels.mockReturnValueOnce(['major']);
      getLabels.mockReturnValueOnce(['patch']);

      expect(await gh.getSemverBump('1234', '123', true)).toBe('');
    });

    test('should publish a release in onlyPublishWithReleaseLabel with label', async () => {
      const gh = new GithubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['release', 'patch']);
      getLabels.mockReturnValueOnce(['patch']);
      getLabels.mockReturnValueOnce(['minor']);

      expect(await gh.getSemverBump('1234', '123', true)).toBe(SEMVER.minor);
    });

    test('should be able to configure labels', async () => {
      const gh = new GithubRelease(undefined, {
        logger,
        labels: {
          major: 'Version: Major',
          minor: 'Version: Minor',
          patch: 'Version: Patch',
          release: 'Deploy'
        }
      });
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      // Test default labels do nothing
      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['Version: Major']);
      getLabels.mockReturnValueOnce(['Version: Patch']);
      getLabels.mockReturnValueOnce(['Version: Minor', 'release']);

      expect(await gh.getSemverBump('1234', '123', true)).toBe('');

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['Version: Minor', 'Deploy']);
      getLabels.mockReturnValueOnce(['Version: Major']);
      getLabels.mockReturnValueOnce(['Version: Patch']);

      expect(await gh.getSemverBump('1234', '123', true)).toBe(SEMVER.major);
    });
  });
});
