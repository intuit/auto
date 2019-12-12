import Auto from '../auto';
import SEMVER from '../semver';
import { dummyLog } from '../utils/logger';
import makeCommitFromMsg from './make-commit-from-msg';
import endent from 'endent';

jest.mock('env-ci', () => () => ({
  pr: 123,
  build: 1,
  isCi: true,
  isPr: true,
  branch: 'ci-test'
}));

const defaults = {
  owner: 'foo',
  repo: 'bar',
  token: 'XXXX'
};

describe('canary in ci', () => {
  test('calls the canary hook with the canary version', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg('Test Commit')]);
    const canary = jest.fn();
    auto.hooks.canary.tap('test', canary);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, 'getCommits').mockImplementation();

    await auto.canary();
    expect(canary).toHaveBeenCalledWith(SEMVER.patch, '.123.1');
  });

  test('comments on PR in CI', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.getLatestRelease = () => Promise.resolve('1.2.3');
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg('Test Commit')]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, 'getCommits').mockImplementation();
    auto.hooks.canary.tap('test', () => '1.2.4-canary.123.1');

    const version = await auto.canary({ pr: 123, build: 1 });
    expect(addToPrBody).toHaveBeenCalled();
    expect(version!.newVersion).toBe('1.2.4-canary.123.1');
  });

  test('should fail when canaries not implemented', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    // @ts-ignore
    jest.spyOn(process, 'exit').mockImplementationOnce(() => {});
    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.getLatestRelease = () => Promise.resolve('1.2.3');
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg('Test Commit')]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, 'getCommits').mockImplementation();

    await auto.canary({ pr: 123, build: 1, message: 'false' });
    expect(process.exit).toHaveBeenCalled();
  });

  test('should not comment when passed "false"', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.getLatestRelease = () => Promise.resolve('1.2.3');
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg('Test Commit')]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, 'getCommits').mockImplementation();
    auto.hooks.canary.tap('test', (bump, post) => `1.2.4-canary${post}`);

    await auto.canary({ pr: 123, build: 1, message: 'false' });
    expect(addToPrBody).not.toHaveBeenCalled();
  });

  test('can override pr and build', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg('Test Commit')]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, 'getCommits').mockImplementation();
    auto.hooks.canary.tap('test', (bump, post) => `1.2.4-canary${post}`);

    const version = await auto.canary({ pr: 456, build: 5 });
    expect(version!.newVersion).toBe('1.2.4-canary.456.5');
  });
});

describe('shipit in ci', () => {
  test('should publish canary in PR', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();

    auto.git!.getLatestRelease = () => Promise.resolve('1.2.3');
    jest.spyOn(auto.git!, 'addToPrBody').mockImplementation();
    auto.release!.getCommitsInRelease = () => Promise.resolve([]);
    auto.release!.getCommits = () => Promise.resolve([]);
    const canary = jest.fn();
    auto.hooks.canary.tap('test', canary);

    await auto.shipit();
    expect(canary).toHaveBeenCalledWith(SEMVER.patch, '.123.1');
  });
});

describe('next in ci', () => {
  test('should post comment with new version', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });

    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);
    const prBody = jest.fn();
    // @ts-ignore
    auto.prBody = prBody;
    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.publish = () => Promise.resolve({} as any);
    auto.git!.getLatestTagInBranch = () => Promise.resolve('1.2.3');
    auto.git!.getLatestRelease = () => Promise.resolve('1.2.3');
    auto.release!.generateReleaseNotes = () => Promise.resolve('notes');
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg('Test Commit')]);

    const afterRelease = jest.fn();
    auto.hooks.afterRelease.tap('test', afterRelease);
    auto.hooks.next.tap('test', () => ['1.2.4-next.0']);
    jest.spyOn(auto.release!, 'getCommits').mockImplementation();

    await auto.next({});
    expect(prBody).toHaveBeenCalledWith({
      context: 'prerelease-version',
      pr: 123,
      message: endent`
        # Version

        Published prerelease version: \`1.2.4-next.0\`

        <details>
          <summary>Changelog</summary>
          notes
        </details>
      `
    });
  });
});
