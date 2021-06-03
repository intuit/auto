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

const listLabelsOnIssue = jest.fn();

process.env.GH_TOKEN = "XXXX";

jest.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    repos = {
      get: jest.fn().mockReturnValue({}),
    };

    issues = {
      listLabelsOnIssue: listLabelsOnIssue.mockReturnValue({ data: [] }),
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

test("shipit should publish canary in locally when not on baseBranch", async () => {
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
      canaryIdentifier: "-canary.abcdefg",
    })
  );
});

test("shipit should not publish canary if required canary label missing", async () => {
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

  await auto.shipit({ onlyReleaseCanaryOnLabel: true });
  expect(canary).not.toBeCalled();
});

test("canary should use PR labels correctly", async () => {
  const auto = new Auto({
    ...defaults,
    onlyPublishWithReleaseLabel: true,
    plugins: [],
  });
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
  listLabelsOnIssue.mockReturnValueOnce({
    data: [{ name: "internal" }, { name: "release" }],
  });

  await auto.canary({ pr: 123 });
  expect(canary).toHaveBeenCalled();
});

test("canary should release if requires canary label and its present", async () => {
  const auto = new Auto({
    ...defaults,
    onlyPublishWithReleaseLabel: true,
    plugins: [],
  });
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
  listLabelsOnIssue.mockReturnValueOnce({
    data: [{ name: "internal" }, { name: "release" }, { name: "canary" }],
  });

  await auto.canary({ pr: 123, onlyReleaseCanaryOnLabel: true });
  expect(canary).toHaveBeenCalled();
});
