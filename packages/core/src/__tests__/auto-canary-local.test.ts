import Auto from '../auto';
import SEMVER from '../semver';
import { dummyLog } from '../utils/logger';

jest.mock('env-ci', () => () => ({
  branch: 'local-test'
}));

const defaults = {
  owner: 'foo',
  repo: 'bar',
  token: 'XXXX'
};

test('shipit should publish canary in locally when not on master', async () => {
  const auto = new Auto({ ...defaults, plugins: [] });
  auto.logger = dummyLog();
  // @ts-ignore
  auto.checkClean = () => Promise.resolve(true);
  await auto.loadConfig();

  auto.git!.getLatestRelease = () => Promise.resolve('1.2.3');
  auto.git!.getSha = () => Promise.resolve('abc');
  jest.spyOn(auto.git!, 'createComment').mockImplementation();
  auto.release!.getCommitsInRelease = () => Promise.resolve([]);
  auto.release!.getCommits = () => Promise.resolve([]);
  const canary = jest.fn();
  auto.hooks.canary.tap('test', canary);

  await auto.shipit();
  expect(canary).toHaveBeenCalledWith(SEMVER.patch, '.abc');
});
