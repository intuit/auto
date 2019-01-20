import GitHub from '../git';

const authenticate = jest.fn();
const listLabelsOnIssue = jest.fn();
const createRelease = jest.fn();
const getLatestRelease = jest.fn();
const getUser = jest.fn();
const getByUsername = jest.fn();
const getPr = jest.fn();
const createStatus = jest.fn();
const createComment = jest.fn();
const listComments = jest.fn();
const deleteComment = jest.fn();
const listCommits = jest.fn();
const getProject = jest.fn();
const listLabelsForRepo = jest.fn();
const issuesAndPullRequests = jest.fn();
const createLabel = jest.fn();
const list = jest.fn();

jest.mock('@octokit/rest', () => () => ({
  authenticate,
  pulls: {
    get: getPr,
    listCommits,
    list
  },
  issues: {
    listLabelsOnIssue,
    createComment,
    listComments,
    deleteComment,
    listLabelsForRepo,
    createLabel
  },
  repos: {
    createStatus,
    createRelease,
    getLatestRelease,
    get: getProject
  },
  search: {
    users: getUser,
    issuesAndPullRequests
  },
  users: {
    getByUsername
  }
}));

const options = {
  owner: 'Adam Dierkens',
  repo: 'test',
  token: 'MyToken'
};

describe('github', () => {
  beforeEach(() => {
    authenticate.mockClear();
    listLabelsOnIssue.mockClear();
    createRelease.mockClear();
    getLatestRelease.mockClear();
    getUser.mockClear();
    getPr.mockClear();
    createStatus.mockClear();
    createComment.mockClear();
    listComments.mockClear();
    deleteComment.mockClear();
    listLabelsForRepo.mockClear();
  });

  describe('authenticate', () => {
    test('should reject without token', async () => {
      const gh = new GitHub({ owner: 'Adam Dierkens', repo: 'test' });
      expect.assertions(1);

      try {
        await gh.authenticate();
      } catch (error) {
        expect(error.message.trim()).toBe(
          'Authentication needs a GitHub token. Try setting up an access token https://github.com/settings/tokens/new'
        );
      }
    });

    test('should use token', async () => {
      const gh = new GitHub({ owner: 'Adam Dierkens', repo: 'test' });

      await gh.authenticate('MyToken');
      expect(authenticate).toHaveBeenCalledWith({
        type: 'token',
        token: 'MyToken'
      });
    });

    test('should use options token', async () => {
      const gh = new GitHub(options);

      await gh.authenticate();
      expect(authenticate).toHaveBeenCalledWith({
        type: 'token',
        token: 'MyToken'
      });
    });
  });

  describe('getLabels', async () => {
    test('successful', async () => {
      const gh = new GitHub(options);

      listLabelsOnIssue.mockReturnValueOnce({
        data: [
          { name: 'minor' },
          { name: 'documentation' },
          { name: 'major' },
          { name: 'internal' }
        ]
      });

      expect(await gh.getLabels(123)).toEqual([
        'minor',
        'documentation',
        'major',
        'internal'
      ]);
    });

    test('handles errors', async () => {
      const gh = new GitHub(options);

      expect(gh.getLabels(123)).rejects.toBeTruthy();
    });
  });

  test('publish', async () => {
    const gh = new GitHub(options);

    await gh.publish('releaseNotes', 'tag');

    expect(createRelease).toHaveBeenCalled();
  });

  test('getFirstCommit ', async () => {
    const gh = new GitHub(options);

    expect(await gh.getFirstCommit()).toBe(
      '0b2af75d8b55c8869cda93d0e5589ad9f2677e18'
    );
  });

  test('getCommitDate ', async () => {
    const gh = new GitHub(options);

    expect(
      await gh.getCommitDate('0b2af75d8b55c8869cda93d0e5589ad9f2677e18')
    ).toBe('2018-12-03T15:19:38-0800');
  });

  test('getSha', async () => {
    const gh = new GitHub(options);

    expect(await gh.getSha()).toBeDefined();
  });

  test('getGitLog ', async () => {
    const gh = new GitHub(options);

    expect(
      await gh.getGitLog(
        '0b2af75d8b55c8869cda93d0e5589ad9f2677e18',
        'a7f6634429731055a5a44bae24ac88c5f9822e58'
      )
    ).toMatchSnapshot();
  });

  test('getUser', async () => {
    const gh = new GitHub(options);

    getPr.mockReturnValueOnce('asdfasdf');

    expect(await gh.getPullRequest(22)).toBe('asdfasdf');
  });

  test('createStatus', async () => {
    const gh = new GitHub(options);

    createStatus.mockReturnValueOnce(true);

    expect(
      await gh.createStatus({
        state: 'pending',
        sha: '',
        context: 'foo',
        target_url: 'google.com',
        description: 'testing'
      })
    ).toBeTruthy();
  });

  test('search', async () => {
    const gh = new GitHub(options);

    issuesAndPullRequests.mockReturnValueOnce({ data: true });
    await gh.searchRepo({
      q: 'is:pr is:open',
      order: 'desc'
    });

    expect(issuesAndPullRequests).toHaveBeenCalledWith({
      q: 'repo:Adam Dierkens/test is:pr is:open',
      order: 'desc'
    });
  });

  test('getProject', async () => {
    const gh = new GitHub(options);

    getProject.mockReturnValueOnce({ data: true });

    expect(await gh.getProject()).toBeTruthy();
  });

  describe('createComment', async () => {
    test('should post comment if none exists', async () => {
      const gh = new GitHub(options);

      listComments.mockReturnValueOnce({ data: [] });
      await gh.createComment('Some long thing', 22, 'default');

      expect(createComment).toHaveBeenCalled();
    });

    test('should delete old comment', async () => {
      const gh = new GitHub(options);

      listComments.mockReturnValueOnce({
        data: [
          {
            body: '<!-- GITHUB_RELEASE COMMENT: default -->\nSome cool message',
            id: 1337
          }
        ]
      });

      await gh.createComment('Some long thing', 22, 'default');

      expect(deleteComment).toHaveBeenCalled();
      expect(deleteComment.mock.calls[0][0].comment_id).toBe(1337);
      expect(createComment).toHaveBeenCalled();
    });

    test('should be able to comment in different contexts', async () => {
      const gh = new GitHub(options);

      listComments.mockReturnValueOnce({
        data: [
          {
            body: '<!-- GITHUB_RELEASE COMMENT: default -->\nSome cool message',
            id: 1337
          }
        ]
      });

      await gh.createComment('Some long thing', 22, 'PERF');

      expect(deleteComment).not.toHaveBeenCalled();
      expect(createComment).toHaveBeenCalled();

      listComments.mockReturnValueOnce({
        data: [
          {
            body: '<!-- GITHUB_RELEASE COMMENT: default -->\nSome cool message',
            id: 1337
          },
          {
            body: '<!-- GITHUB_RELEASE COMMENT: PERF -->\nSome cool message',
            id: 1000
          }
        ]
      });

      await gh.createComment('Some new thing', 22, 'PERF');

      expect(deleteComment).toHaveBeenCalled();
      expect(deleteComment.mock.calls[0][0].comment_id).toBe(1000);
    });
  });

  test('getCommitsForPR', async () => {
    const gh = new GitHub(options);

    listCommits.mockReturnValueOnce({
      data: undefined
    });

    await gh.getCommitsForPR(22);
    expect(listCommits).toHaveBeenCalled();
  });

  test('getCommitsForPR', async () => {
    const gh = new GitHub(options);

    list.mockReturnValueOnce({
      data: undefined
    });

    await gh.getPullRequests();
    expect(listCommits).toHaveBeenCalled();
  });

  test('getUserByUsername', async () => {
    const gh = new GitHub(options);

    getByUsername.mockReturnValueOnce({
      data: { name: 'Andrew Lisowski' }
    });

    expect(await gh.getUserByUsername('andrew')).toEqual({
      name: 'Andrew Lisowski'
    });
  });

  describe('getUserByEmail', async () => {
    test('exists', async () => {
      const gh = new GitHub(options);

      getUser.mockReturnValueOnce({
        data: { items: [{ login: 'hipstersmoothie' }] }
      });

      expect(await gh.getUserByEmail('lisowski54@gmail.com')).toEqual({
        login: 'hipstersmoothie'
      });
    });

    test('doesnt exist', async () => {
      const gh = new GitHub(options);

      getUser.mockReturnValueOnce({
        data: undefined
      });

      expect(await gh.getUserByEmail('lisowski54@gmail.com')).toEqual({
        login: 'lisowski54@gmail.com'
      });
    });
  });

  describe('getLatestRelease ', async () => {
    test('has tag ', async () => {
      const gh = new GitHub(options);

      getLatestRelease.mockReturnValueOnce({ data: { tag_name: '1.0.0' } });

      expect(await gh.getLatestRelease()).toBe('1.0.0');
    });

    test('no tags', async () => {
      const gh = new GitHub(options);

      getLatestRelease.mockRejectedValueOnce({ status: 404 });

      expect(await gh.getLatestRelease()).toBe(
        '0b2af75d8b55c8869cda93d0e5589ad9f2677e18'
      );
    });

    test('handles errors', async () => {
      const gh = new GitHub(options);

      expect(gh.getLatestRelease()).rejects.toBeTruthy();
    });
  });

  describe('getProjectLabels ', () => {
    test('return labels', async () => {
      const gh = new GitHub(options);

      listLabelsForRepo.mockReturnValueOnce({
        data: [{ name: 'first label' }, { name: 'second label' }]
      });

      expect(await gh.getProjectLabels()).toEqual([
        'first label',
        'second label'
      ]);
    });

    test('throw for errors', async () => {
      const gh = new GitHub(options);

      expect(gh.getProjectLabels()).rejects.toBeTruthy();
    });
  });

  describe('createLabel', () => {
    test('should create a label', async () => {
      const gh = new GitHub(options);

      await gh.createLabel('release', 'Foo bar');

      expect(createLabel).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: 'Adam Dierkens',
          repo: 'test',
          name: 'Foo bar'
        })
      );
    });

    test('throw for errors', async () => {
      const gh = new GitHub(options);

      expect(gh.getProjectLabels()).rejects.toBeTruthy();
    });
  });
});
