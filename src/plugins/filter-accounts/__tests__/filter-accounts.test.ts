import FilterAccountsPlugin from '..';
import makeCommitFromMsg from '../../../__tests__/make-commit-from-msg';
import Auto from '../../../auto';
import LogParse from '../../../log-parse';
import { makeHooks, makeLogParseHooks } from '../../../utils/make-hooks';

describe('filter accounts', () => {
  test('should not filter the commit', async () => {
    const plugin = new FilterAccountsPlugin(['pdbf']);
    const hooks = makeHooks();
    const logParseHooks = makeLogParseHooks();

    plugin.apply({ hooks } as Auto);
    hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

    expect(
      await logParseHooks.omitCommit.promise(makeCommitFromMsg('foo'))
    ).toBeUndefined();
  });

  test('should filter the commit', async () => {
    const plugin = new FilterAccountsPlugin(['pdbf']);
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
