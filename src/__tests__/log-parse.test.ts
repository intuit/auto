import { AsyncSeriesBailHook } from 'tapable';
import { defaultLabels } from '../github-release';
import generateReleaseNotes, {
  createUserLink,
  filterServiceAccounts,
  normalizeCommits,
  parseJira,
  parsePR,
  parseSquashPR
} from '../log-parse';

import { renderChangelogLineHook } from '../main';
import { dummyLog } from '../utils/logger';
import makeCommitFromMsg from './make-commit-from-msg';

const logger = dummyLog();

describe('createUserLink', () => {
  test('should ', () => {
    expect(
      createUserLink(
        {
          name: 'none',
          email: undefined,
          username: 'invalid-email-address'
        },
        {
          hash: '1',
          labels: [],
          pullRequest: {
            number: '22'
          },
          authorName: 'none',
          authorEmail: 'default@email.com',
          authors: [
            {
              name: 'none',
              email: undefined
            }
          ],
          subject: ''
        },
        {
          owner: '',
          repo: '',
          baseUrl: 'https://github.custom.com/',
          changelogTitles: {},
          versionLabels: defaultLabels,
          renderChangelogLine: new AsyncSeriesBailHook([
            'commits',
            'lineRender'
          ])
        }
      )
    ).toBe(undefined);
  });

  test('should find email', () => {
    expect(
      createUserLink(
        {
          name: 'none',
          email: undefined
        },
        {
          hash: '1',
          labels: [],
          pullRequest: {
            number: '22'
          },
          authorName: 'none',
          authorEmail: 'default@email.com',
          authors: [
            {
              name: 'none',
              email: undefined
            }
          ],
          subject: ''
        },
        {
          owner: '',
          repo: '',
          baseUrl: 'https://github.custom.com/',
          changelogTitles: {},
          versionLabels: defaultLabels,
          renderChangelogLine: new AsyncSeriesBailHook([
            'commits',
            'lineRender'
          ])
        }
      )
    ).toBe('default@email.com');
  });
});

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
        number: '1234',
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
        number: '1234'
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

const options = {
  owner: 'foobar',
  repo: 'auto-release',
  baseUrl: 'https://github.custom.com/foobar/auto-release',
  jira: 'https://jira.custom.com/browse',
  logger,
  versionLabels: defaultLabels,
  // tslint:disable-next-line no-unnecessary-type-assertion
  renderChangelogLine: new AsyncSeriesBailHook([
    'commits',
    'lineRender'
  ]) as renderChangelogLineHook,
  changelogTitles: {
    major: '💥  Breaking Change',
    minor: '🚀  Enhancement',
    patch: '🐛  Bug Fix',
    internal: '🏠  Internal',
    documentation: '📝  Documentation'
  }
};

describe('generateReleaseNotes', () => {
  test('should not create notes for normal commits', async () => {
    expect(
      await generateReleaseNotes(
        [
          makeCommitFromMsg('First'),
          makeCommitFromMsg('Second'),
          makeCommitFromMsg('Third')
        ],
        dummyLog(),
        options
      )
    ).toBe('');
  });

  test('should create note for PR commits', async () => {
    const normalized = normalizeCommits([
      makeCommitFromMsg('First'),
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['minor'] }),
      makeCommitFromMsg('Third')
    ]);

    expect(
      await generateReleaseNotes(normalized, dummyLog(), options)
    ).toMatchSnapshot();
  });

  test('should create note for PR commits without labels', async () => {
    const normalized = normalizeCommits([
      makeCommitFromMsg('First'),
      makeCommitFromMsg('Some Feature (#1234)'),
      makeCommitFromMsg('Third')
    ]);

    expect(
      await generateReleaseNotes(normalized, dummyLog(), options)
    ).toMatchSnapshot();
  });

  test('should create note for jira commits without labels', async () => {
    const normalized = normalizeCommits([
      makeCommitFromMsg('First'),
      makeCommitFromMsg('[PLAYA-5052] - Fix P0'),
      makeCommitFromMsg('Third')
    ]);

    expect(
      await generateReleaseNotes(normalized, dummyLog(), options)
    ).toMatchSnapshot();
  });

  test('should use username if present', async () => {
    const normalized = normalizeCommits([
      makeCommitFromMsg('First'),
      makeCommitFromMsg('Some Feature (#1234)', {
        labels: ['minor'],
        username: 'adam'
      }),
      makeCommitFromMsg('Third')
    ]);

    normalized[1].authors[0].username = 'adam';

    expect(
      await generateReleaseNotes(normalized, dummyLog(), options)
    ).toMatchSnapshot();
  });

  test('should create note for JIRA commits', async () => {
    const normalized = normalizeCommits([
      makeCommitFromMsg('[PLAYA-5052] - Some Feature (#12345)', {
        labels: ['major'],
        packages: []
      }),
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['internal'] }),
      makeCommitFromMsg('Third', { labels: ['patch'] }),
      makeCommitFromMsg('Fourth')
    ]);

    expect(
      await generateReleaseNotes(normalized, dummyLog(), options)
    ).toMatchSnapshot();
  });

  test('should combine pr w/no label and labelled pr', async () => {
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)'),
      makeCommitFromMsg('Third', { labels: ['patch'] }),
      makeCommitFromMsg('Fourth')
    ]);

    expect(
      await generateReleaseNotes(normalized, dummyLog(), options)
    ).toMatchSnapshot();
  });

  test("should use only email if author name doesn't exist", async () => {
    const commits = normalizeCommits([
      {
        hash: 'foo',
        labels: [],
        authorEmail: 'adam@dierkens.com',
        subject: 'Another Feature (#1234)'
      },
      {
        hash: 'foo',
        labels: [],
        subject: 'One Feature (#1235)'
      }
    ]);

    expect(
      await generateReleaseNotes(commits, dummyLog(), options)
    ).toMatchSnapshot();
  });
});
