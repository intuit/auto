import GitHubRelease, { VersionLabel } from '../github-release';
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
const getProjectLabels = jest.fn();
const createLabel = jest.fn();
const getPullRequests = jest.fn();

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
    getUserByEmail,
    getProjectLabels,
    createLabel,
    getPullRequests
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

describe('GitHubRelease', () => {
  beforeEach(() => {
    getGitLog.mockClear();
    publish.mockClear();
    getLabels.mockClear();
    writeSpy.mockClear();
    execSpy.mockClear();
    execSpy.mockClear();
    createLabel.mockClear();
  });

  test('should use options owner, repo, and token', async () => {
    const gh = new GitHubRelease({
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
      const gh = new GitHubRelease();
      await gh.getCommits('12345');
      expect(getGitLog).toHaveBeenCalled();
    });

    test('should use configured HEAD', async () => {
      const gh = new GitHubRelease({ owner: 'Adam Dierkens', repo: 'test' });
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
      const gh = new GitHubRelease({ owner: 'Adam Dierkens', repo: 'test' });
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

      const gh = new GitHubRelease({ owner: 'Adam Dierkens', repo: 'test' });
      const modifiedCommits = await gh.getCommits('12345', '1234');
      expect(getUserByUsername).toHaveBeenCalled();
      expect(modifiedCommits).toMatchSnapshot();
    });
  });

  test('publish', async () => {
    const gh = new GitHubRelease();
    await gh.publish('release notes', '1.2.3');
    expect(publish).toHaveBeenCalled();
  });

  test('getLabels', async () => {
    const gh = new GitHubRelease();
    await gh.getLabels(123);
    expect(getLabels).toHaveBeenCalled();
  });

  test('getLatestRelease', async () => {
    const gh = new GitHubRelease();
    await gh.getLatestRelease();
    expect(getLatestRelease).toHaveBeenCalled();
  });

  test('getLatestRelease', async () => {
    const gh = new GitHubRelease();
    await gh.getPullRequest(22);
    expect(getLatestRelease).toHaveBeenCalled();
  });

  test('getSha', async () => {
    const gh = new GitHubRelease();
    await gh.getSha();
    expect(getLatestRelease).toHaveBeenCalled();
  });

  test('createStatus', async () => {
    const gh = new GitHubRelease();
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
    const gh = new GitHubRelease();
    await gh.createComment('Some long message', 22);
    expect(createComment).toHaveBeenCalled();
  });

  test('getPullRequests', async () => {
    const gh = new GitHubRelease();
    await gh.getPullRequests({ state: 'closed' });
    expect(getPullRequests).toHaveBeenCalled();
  });

  describe('addToChangelog', async () => {
    test("creates new changelog if one didn't exist", async () => {
      const gh = new GitHubRelease();
      await gh.addToChangelog(
        '# My new Notes',
        'klajsdlfk4lj51l43k5hj234l',
        'v0.0.0'
      );

      expect(writeSpy.mock.calls[0][1].includes(`# My new Notes`)).toBe(true);
    });

    test("creates new changelog if one didn't exist", async () => {
      const gh = new GitHubRelease();
      await gh.addToChangelog('# My new Notes', 'v1.0.0', 'v1.0.0', false);

      expect(writeSpy.mock.calls[0][1].includes(`v1.0.1`)).toBe(true);
    });

    test('prepends to old changelog', async () => {
      const gh = new GitHubRelease();

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
      const gh = new GitHubRelease();
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
    const gh = new GitHubRelease(undefined, {
      logger: dummyLog(),
      slack: 'https://custom-slack-url'
    });
    await gh.postToSlack('# My Notes', 'v1.0.0');
    expect(slackSpy).toHaveBeenCalled();
  });

  describe('generateReleaseNotes', async () => {
    test('should default to HEAD', async () => {
      const gh = new GitHubRelease();
      expect(await gh.generateReleaseNotes('1234')).toBe('');
    });

    test('should use configured HEAD', async () => {
      const gh = new GitHubRelease();
      expect(await gh.generateReleaseNotes('1234', '123')).toBe('');
    });

    test('should allow user to configure section headings', async () => {
      const gh = new GitHubRelease();

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
      const gh = new GitHubRelease();
      const commits = [
        makeCommitFromMsg('First'),
        makeCommitFromMsg('Second'),
        makeCommitFromMsg('Third')
      ];

      getGitLog.mockReturnValueOnce(commits);

      expect(await gh.getSemverBump('1234')).toBe(SEMVER.patch);
    });

    test('should use higher version', async () => {
      const gh = new GitHubRelease();
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
      const gh = new GitHubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['skip-release', 'patch']);
      getLabels.mockReturnValueOnce(['skip-release', 'patch']);
      getLabels.mockReturnValueOnce(['skip-release', 'minor']);

      expect(await gh.getSemverBump('1234', '123')).toBe('');
    });

    test('should publish a release', async () => {
      const gh = new GitHubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['patch']);
      getLabels.mockReturnValueOnce(['skip-release', 'patch']);
      getLabels.mockReturnValueOnce(['skip-release', 'minor']);

      expect(await gh.getSemverBump('1234', '123')).toBe(SEMVER.minor);
    });

    test('should default to publish a prepatch', async () => {
      const gh = new GitHubRelease();
      const commits = [
        makeCommitFromMsg('First (#1234)'),
        makeCommitFromMsg('Second (#1235)'),
        makeCommitFromMsg('Third (#1236)')
      ];

      getGitLog.mockReturnValueOnce(commits);
      getLabels.mockReturnValueOnce(['skip-release']);
      getLabels.mockReturnValueOnce([]);
      getLabels.mockReturnValueOnce([]);

      expect(await gh.getSemverBump('1234', '123')).toBe('');
    });

    test('should not publish a release in onlyPublishWithReleaseLabel without label', async () => {
      const gh = new GitHubRelease();
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
      const gh = new GitHubRelease();
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
      const labels = new Map();
      labels.set(SEMVER.major, 'Version: Major');
      labels.set(SEMVER.minor, 'Version: Minor');
      labels.set(SEMVER.patch, 'Version: Patch');
      labels.set('release', 'Deploy');

      const gh = new GitHubRelease(undefined, {
        logger,
        labels
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

  describe('addLabelsToProject', () => {
    test('should add labels', async () => {
      const gh = new GitHubRelease();
      const labels = new Map<VersionLabel, string>();
      labels.set(SEMVER.major, '1');
      labels.set(SEMVER.minor, '2');
      labels.set(SEMVER.patch, '3');

      await gh.addLabelsToProject(labels);

      expect(createLabel).toHaveBeenCalledWith(SEMVER.major, '1');
      expect(createLabel).toHaveBeenCalledWith(SEMVER.minor, '2');
      expect(createLabel).toHaveBeenCalledWith(SEMVER.patch, '3');
    });

    test('should not add old labels', async () => {
      const gh = new GitHubRelease();
      const labels = new Map<VersionLabel, string>();
      labels.set(SEMVER.major, '1');
      labels.set(SEMVER.minor, '2');

      getProjectLabels.mockReturnValueOnce(['1']);
      await gh.addLabelsToProject(labels);

      expect(createLabel).not.toHaveBeenCalledWith(SEMVER.major, '1');
      expect(createLabel).toHaveBeenCalledWith(SEMVER.minor, '2');
    });

    test('should add release label in onlyPublishWithReleaseLabel mode', async () => {
      const gh = new GitHubRelease();
      const labels = new Map<VersionLabel, string>();
      labels.set('release', 'deploy');

      await gh.addLabelsToProject(labels);
      expect(createLabel).not.toHaveBeenCalledWith('release', 'deploy');

      await gh.addLabelsToProject(labels, true);
      expect(createLabel).toHaveBeenCalledWith('release', 'deploy');
    });

    test('should add skip-release label not in onlyPublishWithReleaseLabel mode', async () => {
      const gh = new GitHubRelease();
      const labels = new Map<VersionLabel, string>();
      labels.set('skip-release', 'no!');

      await gh.addLabelsToProject(labels, true);
      expect(createLabel).not.toHaveBeenCalledWith('skip-release', 'no!');

      await gh.addLabelsToProject(labels);
      expect(createLabel).toHaveBeenCalledWith('skip-release', 'no!');
    });
  });
});
