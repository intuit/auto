import Auto from '@intuit-auto/core';
import makeCommitFromMsg from '@intuit-auto/core/dist/__tests__/make-commit-from-msg';
import LogParse from '@intuit-auto/core/dist/log-parse';
import {
  makeHooks,
  makeLogParseHooks
} from '@intuit-auto/core/dist/utils/make-hooks';
import FilterAccountsPlugin from '..';

describe('filterServiceAccounts', () => {
  test('should not filter the commit', async () => {
    const plugin = new FilterAccountsPlugin({ accounts: ['pdbf'] });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = makeCommitFromMsg('foo');
    expect(await logParseHooks.omitCommit.promise(commit)).toBeUndefined();
  });

  test('should filter the commit', async () => {
    const plugin = new FilterAccountsPlugin({ accounts: ['pdbf'] });
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    const commit = {
      ...makeCommitFromMsg('foo'),
      authorName: 'pdbf',
      authorEmail: ''
    };
    expect(await logParseHooks.omitCommit.promise(commit)).toBe(true);
  });
});
