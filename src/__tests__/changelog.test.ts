import Changelog from '../changelog';
import { defaultChangelogTitles, defaultLabels } from '../github-release';
import { IGenerateReleaseNotesOptions, normalizeCommits } from '../log-parse';
import { dummyLog } from '../utils/logger';
import makeCommitFromMsg from './make-commit-from-msg';

const testOptions = (): IGenerateReleaseNotesOptions => ({
  owner: 'foobar',
  repo: 'auto-release',
  baseUrl: 'https://github.custom.com/foobar/auto-release',
  jira: 'https://jira.custom.com/browse',
  versionLabels: defaultLabels,
  changelogTitles: defaultChangelogTitles
});

describe('createUserLink', () => {
  test('should ', () => {
    const changelog = new Changelog(dummyLog(), {
      owner: '',
      repo: '',
      baseUrl: 'https://github.custom.com/',
      changelogTitles: {},
      versionLabels: defaultLabels
    });
    changelog.loadDefaultHooks();

    expect(
      changelog.createUserLink(
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
    const changelog = new Changelog(dummyLog(), {
      owner: '',
      repo: '',
      baseUrl: 'https://github.custom.com/',
      changelogTitles: {},
      versionLabels: defaultLabels
    });
    changelog.loadDefaultHooks();

    expect(
      changelog.createUserLink(
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

describe('Hooks', () => {
  test('title', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)')
    ]);

    changelog.hooks.renderChangelogTitle.tap(
      'test',
      (label, changelogTitles) => `:heart: ${changelogTitles[label]} :heart:`
    );
    changelog.loadDefaultHooks();

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('author', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)')
    ]);

    changelog.hooks.renderChangelogAuthor.tap(
      'test',
      (author, commit) => `:heart: ${author.name}/${commit.authorEmail} :heart:`
    );

    changelog.hooks.renderChangelogAuthorLine.tap(
      'test',
      (author, user) => `:shipit: ${author.name} (${user})`
    );
    changelog.loadDefaultHooks();

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });
});

describe('generateReleaseNotes', () => {
  test('should create note for PR commits', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['minor'] })
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should omit authors with invalid email addresses', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['minor'] })
    ]);
    normalized[0].authors[0].username = 'invalid-email-address';

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should create note for PR commits without labels', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)')
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should create note for jira commits without labels', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('[PLAYA-5052] - Fix P0')
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should use username if present', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)', {
        labels: ['minor'],
        username: 'adam'
      })
    ]);

    normalized[0].authors[0].username = 'adam';

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should create note for JIRA commits', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('[PLAYA-5052] - Some Feature (#12345)', {
        labels: ['major'],
        packages: []
      }),
      makeCommitFromMsg('Some Feature (#1234)', { labels: ['internal'] }),
      makeCommitFromMsg('Third', { labels: ['patch'] })
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test('should combine pr w/no label and labelled pr', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = normalizeCommits([
      makeCommitFromMsg('Some Feature (#1234)'),
      makeCommitFromMsg('Third', { labels: ['patch'] })
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should use only email if author name doesn't exist", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
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

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test('should include PR-less commits as patches', async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

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

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });
});
