import { Auto } from "../auto";
import SEMVER from "../semver";
import { dummyLog } from "../utils/logger";

jest.mock("env-ci", () => () => ({
  branch: "local-test",
}));

const defaults = {
  owner: "foo",
  repo: "bar",
};

process.env.GH_TOKEN = "XXXX";

jest.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    repos = {
      get: jest.fn().mockReturnValue({}),
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

test("shipit should publish canary in locally when not on master", async () => {
  const auto = new Auto({ ...defaults, plugins: [] });
  auto.logger = dummyLog();
  // @ts-ignore
  auto.checkClean = () => Promise.resolve(true);
  await auto.loadConfig();

  auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
  auto.git!.getSha = () => Promise.resolve("abcdefghijklmnop");
  jest.spyOn(auto.git!, "createComment").mockImplementation();
  auto.release!.getCommitsInRelease = () => Promise.resolve([]);
  auto.release!.getCommits = () => Promise.resolve([]);
  const canary = jest.fn();
  auto.hooks.canary.tap("test", canary);

  await auto.shipit();
  expect(canary).toHaveBeenCalledWith(
    expect.objectContaining({
      bump: SEMVER.patch,
      canaryIdentifier: "canary.abcdefg",
    })
  );
});
