import {
  filterServiceAccounts,
  normalizeCommits,
  parseJira,
  parsePR,
  parseSquashPR
} from '../log-parse';

import makeCommitFromMsg from './make-commit-from-msg';

describe('parsePR', () => {
  test('should do nothing without merge commit', () => {
    const commit = makeCommitFromMsg('Not a merge');
    expect(parsePR(commit)).toEqual(commit);
  });

  test('should parse number base and comment', () => {
    const commit = makeCommitFromMsg(
      'Merge pull request #1234 from Another PR\nComments about the PR'
    );

    expect(parsePR(commit)).toEqual({
      ...commit,
      pullRequest: {
        number: 1234,
        base: 'Another PR'
      },
      subject: 'Comments about the PR'
    });
  });
});

describe('parseSquashPR', () => {
  test('should do nothing squash merge commit', () => {
    const commit = makeCommitFromMsg('Not a squash');
    expect(parseSquashPR(commit)).toEqual(commit);
  });

  test('should parse PR number and comment', () => {
    const commit = makeCommitFromMsg('Some Message (#1234)');
    expect(parseSquashPR(commit)).toEqual({
      ...commit,
      pullRequest: {
        number: 1234
      },
      subject: 'Some Message'
    });
  });
});

describe('filterServiceAccounts', () => {
  test('should not filter the commit', () => {
    const commit = makeCommitFromMsg('foo');
    expect(filterServiceAccounts(commit)).toEqual(commit);
  });

  test('should filter the commit', () => {
    const commit = {
      ...makeCommitFromMsg('foo'),
      authorName: 'pdbf',
      authorEmail: ''
    };

    expect(filterServiceAccounts(commit)).toBeUndefined();
  });
});

describe('jira', () => {
  test('no story', () => {
    const commit = {
      ...makeCommitFromMsg('Add log')
    };

    expect(parseJira(commit)).toEqual(commit);
  });

  test('story found', () => {
    const commit = {
      ...makeCommitFromMsg('Add log'),
      jira: {
        number: ['PLAYA-5052']
      }
    };

    expect(parseJira(makeCommitFromMsg('PLAYA-5052: Add log'))).toEqual(commit);
    expect(parseJira(makeCommitFromMsg('[PLAYA-5052] - Add log'))).toEqual(
      commit
    );
    expect(parseJira(makeCommitFromMsg('[PLAYA-5052] Add log'))).toEqual(
      commit
    );
  });

  test('story found', () => {
    const commit = {
      ...makeCommitFromMsg('Add log'),
      jira: {
        number: ['PLAYA-5052', 'PLAYA-6000']
      }
    };

    expect(
      parseJira(makeCommitFromMsg('PLAYA-5052 PLAYA-6000: Add log'))
    ).toEqual(commit);
    expect(
      parseJira(makeCommitFromMsg('[PLAYA-5052][PLAYA-6000] - Add log'))
    ).toEqual(commit);
    expect(
      parseJira(makeCommitFromMsg('[PLAYA-5052] PLAYA-6000: Add log'))
    ).toEqual(commit);
    expect(
      parseJira(makeCommitFromMsg('PLAYA-5052 [PLAYA-6000] - Add log'))
    ).toEqual(commit);
  });
});

describe('normalizeCommits', () => {
  test('should handle undefined', () => {
    const commits = [makeCommitFromMsg('Filtered', { name: 'pdbf' })];

    expect(normalizeCommits(commits)).toEqual([]);
  });

  test('should do nothing with normal commits', () => {
    const commits = [
      makeCommitFromMsg('First'),
      makeCommitFromMsg('Second'),
      makeCommitFromMsg('Third')
    ];

    expect(normalizeCommits(commits)).toMatchSnapshot();
  });

  test('should use parsing functions to normalize', () => {
    const commits = [
      makeCommitFromMsg('First'),
      makeCommitFromMsg('Second'),
      makeCommitFromMsg('[PLAYA-5052] Add log')
    ];

    expect(normalizeCommits(commits)[2]).toEqual({
      authorEmail: 'adam@dierkens.com',
      authorName: 'Adam Dierkens',
      authors: [
        {
          email: 'adam@dierkens.com',
          name: 'Adam Dierkens'
        }
      ],
      labels: [],
      subject: 'Add log',
      hash: 'foo',
      jira: {
        number: ['PLAYA-5052']
      }
    });
  });
});
