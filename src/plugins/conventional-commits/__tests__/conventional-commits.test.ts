import ConventionalCommitsPlugin from '..';
import makeCommitFromMsg from '../../../__tests__/make-commit-from-msg';
import Auto from '../../../auto';
import LogParse from '../../../log-parse';
import { defaultLabels } from '../../../release';
import { dummyLog } from '../../../utils/logger';
import { makeHooks, makeLogParseHooks } from '../../../utils/make-hooks';

test('should do nothing when conventional commit message is not present', async () => {
  const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
  const autoHooks = makeHooks();
  conventionalCommitsPlugin.apply({
    hooks: autoHooks,
    semVerLabels: defaultLabels,
    logger: dummyLog()
  } as Auto);

  const logParseHooks = makeLogParseHooks();
  autoHooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

  const commit = makeCommitFromMsg('normal commit with no bump');
  expect(await logParseHooks.parseCommit.promise({ ...commit })).toEqual(
    commit
  );
});

test('should add correct semver label to commit', async () => {
  const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
  const autoHooks = makeHooks();
  conventionalCommitsPlugin.apply({
    hooks: autoHooks,
    semVerLabels: defaultLabels,
    logger: dummyLog()
  } as Auto);

  const logParseHooks = makeLogParseHooks();
  autoHooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

  const commit = makeCommitFromMsg('fix: normal commit with no bump');
  expect(await logParseHooks.parseCommit.promise({ ...commit })).toEqual({
    ...commit,
    labels: ['patch']
  });
});

test('should add major semver label to commit', async () => {
  const conventionalCommitsPlugin = new ConventionalCommitsPlugin();
  const autoHooks = makeHooks();
  conventionalCommitsPlugin.apply({
    hooks: autoHooks,
    semVerLabels: defaultLabels,
    logger: dummyLog()
  } as Auto);

  const logParseHooks = makeLogParseHooks();
  autoHooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

  const commit = makeCommitFromMsg('BREAKING: normal commit with no bump');
  expect(await logParseHooks.parseCommit.promise({ ...commit })).toEqual({
    ...commit,
    labels: ['major']
  });
});
