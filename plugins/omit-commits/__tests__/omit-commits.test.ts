import Auto from '@auto-it/core';
import makeCommitFromMsg from '@auto-it/core/dist/__tests__/make-commit-from-msg';
import LogParse from '@auto-it/core/dist/log-parse';
import {
  makeHooks,
  makeLogParseHooks
} from '@auto-it/core/dist/utils/make-hooks';
import OmitCommits from '../src';

describe('Omit Commits Plugin', () => {
  test('should not filter the commit', async () => {
    const plugin = new OmitCommits({ name: ['pdbf'] });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = makeCommitFromMsg('foo');
    expect(await logParseHooks.omitCommit.promise(commit)).toBeUndefined();
  });

  test('should filter the commit by name', async () => {
    const plugin = new OmitCommits({ name: ['pdbf'] });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = makeCommitFromMsg('foo', { name: 'pdbf' });
    expect(await logParseHooks.omitCommit.promise(commit)).toBe(true);
  });

  test('should filter the commit by username', async () => {
    const plugin = new OmitCommits({ username: ['pdbf'] });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = makeCommitFromMsg('foo', { username: 'pdbf' });
    expect(await logParseHooks.omitCommit.promise(commit)).toBe(true);
  });

  test('should filter the commit by email', async () => {
    const plugin = new OmitCommits({ email: ['foo@bar.com'] });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = makeCommitFromMsg('foo', { email: 'foo@bar.com' });
    expect(await logParseHooks.omitCommit.promise(commit)).toBe(true);
  });

  test('should filter the commit by label', async () => {
    const plugin = new OmitCommits({ labels: ['me'] });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = makeCommitFromMsg('foo', { labels: ['me'] });
    expect(await logParseHooks.omitCommit.promise(commit)).toBe(true);
  });

  test('should filter the commit by subject', async () => {
    const plugin = new OmitCommits({ subject: 'WIP' });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = makeCommitFromMsg('[WIP] foo');
    expect(await logParseHooks.omitCommit.promise(commit)).toBe(true);
  });
});
