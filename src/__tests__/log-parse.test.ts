import { defaultChangelogTitles, defaultLabels } from '../github-release';
import LogParse, {
  filterServiceAccounts,
  IGenerateReleaseNotesOptions,
  normalizeCommits,
  parseJira,
  parsePR,
  parseSquashPR
} from '../log-parse';

import { dummyLog } from '../utils/logger';
import makeCommitFromMsg from './make-commit-from-msg';

describe('createUserLink', () => {
  test('should ', () => {
    const logParse = new LogParse(dummyLog(), {
      owner: '',
      repo: '',
      baseUrl: 'https://github.custom.com/',
      changelogTitles: {},
      versionLabels: defaultLabels
    });
    logParse.loadDefaultHooks();

    expect(
      logParse.createUserLink(
        {
          name: 'none',
          email: undefined,
          username: 'invalid-email-address'
        },
        {
          hash: '1',
          labels: [],
          pullRequest: {
            number: 22
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
        }
      )
    ).toBe(undefined);
  });

  test('should find email', () => {
    const logParse = new LogParse(dummyLog(), {
      owner: '',
      repo: '',
      baseUrl: 'https://github.custom.com/',
      changelogTitles: {},
      versionLabels: defaultLabels
    });
    logParse.loadDefaultHooks();

    expect(
      logParse.createUserLink(
        {
          name: 'none',
          email: undefined
        },
        {
          hash: '1',
          labels: [],
          pullRequest: {
            number: 22
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

const testOptions = (): IGenerateReleaseNotesOptions => ({
  owner: 'foobar',
  repo: 'auto-release',
  baseUrl: 'https://github.custom.com/foobar/auto-release',
  jira: 'https://jira.custom.com/browse',
  versionLabels: defaultLabels,
  changelogTitles: defaultChangelogTitles
});

describe('Hooks', () => {
  test('title', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)')
    ]);

    logParse.hooks.renderChangelogTitle.tap(
      'test',
      (label, changelogTitles) => `:heart: ${changelogTitles[label]} :heart:`
    );
    logParse.loadDefaultHooks();

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('author', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)')
    ]);

    logParse.hooks.renderChangelogAuthor.tap(
      'test',
      (author, commit) => `:heart: ${author.name}/${commit.authorEmail} :heart:`
    );

    logParse.hooks.renderChangelogAuthorLine.tap(
      'test',
      (author, user) => `:shipit: ${author.name} (${user})`
    );
    logParse.loadDefaultHooks();

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });
});

describe('generateReleaseNotes', () => {
  test('should create note for PR commits', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['minor'] })
    ]);

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should omit authors with invalid email addresses', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['minor'] })
    ]);
    normalized[0].authors[0].username = 'invalid-email-address';

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should create note for PR commits without labels', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)')
    ]);

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should create note for jira commits without labels', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('[PLAYA-5052] - Fix P0')
    ]);

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should use username if present', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)', {
        labels: ['minor'],
        username: 'adam'
      })
    ]);

    normalized[0].authors[0].username = 'adam';

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should create note for JIRA commits', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('[PLAYA-5052] - Some Feature (#12345)', {
        labels: ['major'],
        packages: []
      }),
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['internal'] }),
      makeCommitFromMsg('Third', { labels: ['patch'] })
    ]);

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should combine pr w/no label and labelled pr', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)'),
      makeCommitFromMsg('Third', { labels: ['patch'] })
    ]);

    expect(await logParse.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should use only email if author name doesn't exist", async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();
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

    expect(await logParse.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test('should include PR-less commits as patches', async () => {
    const logParse = new LogParse(dummyLog(), testOptions());
    logParse.loadDefaultHooks();

    const commits = normalizeCommits([
      {
        hash: '1',
        authorName: 'Adam Dierkens',
        authorEmail: 'adam@dierkens.com',
        subject: 'I was a push to master',
        labels: ['pushToMaster']
      },
      {
        hash: '2',
        authorName: 'Adam Dierkens',
        authorEmail: 'adam@dierkens.com',
        subject: 'First Feature (#1235)',
        labels: ['minor']
      }
    ]);

    expect(await logParse.generateReleaseNotes(commits)).toMatchSnapshot();
  });
});
