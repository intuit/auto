import makeCommitFromMsg from '../../__tests__/make-commit-from-msg';
import Auto from '../../auto';
import Git from '../../git';
import LogParse from '../../log-parse';
import { makeHooks, makeLogParseHooks } from '../../utils/make-hooks';

import FilterNonPullRequestPlugin from '../filter-non-pull-request';

const getPr = jest.fn();

const setup = () => {
  const plugin = new FilterNonPullRequestPlugin();
  const hooks = makeHooks();
  const logParseHooks = makeLogParseHooks();

  plugin.apply({ hooks, git: ({ getPr } as unknown) as Git } as Auto);
  hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

  return logParseHooks;
};

describe('Filter Non Pull Request Plugin', () => {
  test('should do nothing for non-prs', async () => {
    const hooks = setup();
    const commit = makeCommitFromMsg('foo');
    expect(await hooks.omitCommit.promise(commit)).toBeUndefined();
  });

  test('should not filter bad PR numbers', async () => {
    const hooks = setup();
    const commit = makeCommitFromMsg('foo', { pullRequest: { number: 404 } });

    getPr.mockRejectedValueOnce(new Error('Not Found'));
    expect(await hooks.omitCommit.promise(commit)).toBe(true);
  });

  test('should throw unknown errors', async () => {
    const hooks = setup();
    const commit = makeCommitFromMsg('foo', { pullRequest: { number: 123 } });

    getPr.mockRejectedValueOnce(new Error('Some error'));
    await expect(hooks.omitCommit.promise(commit)).rejects.toBeInstanceOf(
      Error
    );
  });

  test('should with no PR return value', async () => {
    const hooks = setup();
    const commit = makeCommitFromMsg('foo', { pullRequest: { number: 123 } });

    getPr.mockReturnValueOnce(Promise.resolve());
    await expect(hooks.omitCommit.promise(commit)).rejects.toBeInstanceOf(
      Error
    );
  });

  test('should filter issues', async () => {
    const hooks = setup();
    const commit = makeCommitFromMsg('foo', { pullRequest: { number: 123 } });

    getPr.mockReturnValueOnce(Promise.resolve({ data: {} }));
    expect(await hooks.omitCommit.promise(commit)).toBe(true);
  });

  test('should not filter PRs', async () => {
    const hooks = setup();
    const commit = makeCommitFromMsg('foo', { pullRequest: { number: 123 } });

    getPr.mockReturnValueOnce(
      Promise.resolve({ data: { pull_request: true } })
    );
    expect(await hooks.omitCommit.promise(commit)).toBeUndefined();
  });
});
