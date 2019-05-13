import JiraPlugin, { parseJira } from '..';
import makeCommitFromMsg from '../../../__tests__/make-commit-from-msg';
import Auto from '../../../auto';
import Changelog from '../../../changelog';
import { dummyLog } from '../../../utils/logger';
import { makeChangelogHooks, makeHooks } from '../../../utils/make-hooks';

describe('parse jira', () => {
  test('no story', () => {
    const commit = {
      ...makeCommitFromMsg('Add log')
    };

    expect(parseJira(commit)).toEqual(commit);
  });

  test('story found', () => {
    const jira = {
      number: ['PLAYA-5052']
    };

    expect(parseJira(makeCommitFromMsg('PLAYA-5052: Add log')).jira).toEqual(
      jira
    );
    expect(parseJira(makeCommitFromMsg('[PLAYA-5052] - Add log')).jira).toEqual(
      jira
    );
    expect(parseJira(makeCommitFromMsg('[PLAYA-5052] Add log')).jira).toEqual(
      jira
    );
  });

  test('story found, pr no title', () => {
    const jira = {
      number: ['PLAYA-5052']
    };

    expect(parseJira(makeCommitFromMsg('[PLAYA-5052]')).jira).toEqual(jira);
  });

  test('story found', () => {
    const jira = {
      number: ['PLAYA-5052', 'PLAYA-6000']
    };

    expect(
      parseJira(makeCommitFromMsg('PLAYA-5052 PLAYA-6000: Add log')).jira
    ).toEqual(jira);
    expect(
      parseJira(makeCommitFromMsg('[PLAYA-5052][PLAYA-6000] - Add log')).jira
    ).toEqual(jira);
    expect(
      parseJira(makeCommitFromMsg('[PLAYA-5052] PLAYA-6000: Add log')).jira
    ).toEqual(jira);
    expect(
      parseJira(makeCommitFromMsg('PLAYA-5052 [PLAYA-6000] - Add log')).jira
    ).toEqual(jira);
  });
});

describe('render jira', () => {
  test('no jira number', async () => {
    const plugin = new JiraPlugin('jira.com');
    const hooks = makeHooks();
    const changelogHooks = makeChangelogHooks();
    const commit = makeCommitFromMsg('Add log');

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    hooks.onCreateChangelog.promise({ hooks: changelogHooks } as Changelog);

    expect(
      (await changelogHooks.renderChangelogLine.promise([commit, 'Add log']))[1]
    ).toBe('Add log');
  });

  test('with jira number', async () => {
    const plugin = new JiraPlugin({ url: 'jira.com' });
    const hooks = makeHooks();
    const changelogHooks = makeChangelogHooks();

    plugin.apply({ hooks, logger: dummyLog() } as Auto);
    hooks.onCreateChangelog.promise({ hooks: changelogHooks } as Changelog);

    const [, line] = await changelogHooks.renderChangelogLine.promise([
      makeCommitFromMsg('[PLAYA-5052] Add log'),
      '[PLAYA-5052] Add log [author](link/to/author)'
    ]);

    expect(line).toBe(
      '[PLAYA-5052](jira.com/PLAYA-5052): Add log [author](link/to/author)'
    );
  });
});
