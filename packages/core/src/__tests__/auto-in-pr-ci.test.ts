import { Auto } from "../auto";
import SEMVER from "../semver";
import { dummyLog } from "../utils/logger";
import makeCommitFromMsg from "./make-commit-from-msg";
import endent from "endent";
import execPromise from "../utils/exec-promise";

const exec = jest.fn();
jest.mock("../utils/exec-promise");
// @ts-ignore
execPromise.mockImplementation(exec);
exec.mockResolvedValue("");

jest.mock("env-ci", () => () => ({
  pr: 123,
  build: 1,
  isCi: true,
  isPr: true,
  branch: "ci-test",
}));

const defaults = {
  owner: "foo",
  repo: "bar",
};

process.env.GH_TOKEN = "XXX";

jest.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    repos = {
      get: jest.fn().mockReturnValue({}),
    };

    issues = {
      listLabelsOnIssue: jest.fn().mockReturnValue({ data: []}),
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

describe("canary in ci", () => {
  test("calls the canary hook with the canary version", async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg("Test Commit")]);
    const canary = jest.fn();
    auto.hooks.canary.tap("test", canary);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, "getCommits").mockImplementation();

    await auto.canary();
    expect(canary).toHaveBeenCalledWith(
      expect.objectContaining({
        bump: SEMVER.patch,
        canaryIdentifier: "canary.123.1",
      })
    );
  });

  test("comments on PR in CI", async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg("Test Commit")]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, "getCommits").mockImplementation();
    auto.hooks.canary.tap("test", () => "1.2.4-canary.123.1");

    const version = await auto.canary({ pr: 123, build: 1 });
    expect(addToPrBody).toHaveBeenCalled();
    expect(version!.newVersion).toBe("1.2.4-canary.123.1");
  });

  test("should fail when canaries not implemented", async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    // @ts-ignore
    jest.spyOn(process, "exit").mockImplementationOnce(() => {});
    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg("Test Commit")]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, "getCommits").mockImplementation();

    await auto.canary({ pr: 123, build: 1, message: "false" });
    expect(process.exit).toHaveBeenCalled();
  });

  test('should not comment when passed "false"', async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg("Test Commit")]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, "getCommits").mockImplementation();
    auto.hooks.canary.tap(
      "test",
      ({ canaryIdentifier }) => `1.2.4-${canaryIdentifier}`
    );

    await auto.canary({ pr: 123, build: 1, message: "false" });
    expect(addToPrBody).not.toHaveBeenCalled();
  });

  test("can override pr and build", async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg("Test Commit")]);
    const addToPrBody = jest.fn();
    auto.git!.addToPrBody = addToPrBody;
    jest.spyOn(auto.release!, "getCommits").mockImplementation();
    auto.hooks.canary.tap(
      "test",
      ({ canaryIdentifier }) => `1.2.4-${canaryIdentifier}`
    );

    const version = await auto.canary({ pr: 456, build: 5 });
    expect(version!.newVersion).toBe("1.2.4-canary.456.5");
  });
});

describe("shipit in ci", () => {
  test("should publish canary in PR", async () => {
    const auto = new Auto({ ...defaults, plugins: [] });
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);

    auto.logger = dummyLog();
    await auto.loadConfig();

    auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
    jest.spyOn(auto.git!, "addToPrBody").mockImplementation();
    auto.release!.getCommitsInRelease = () => Promise.resolve([]);
    auto.release!.getCommits = () => Promise.resolve([]);
    const canary = jest.fn();
    auto.hooks.canary.tap("test", canary);

    await auto.shipit();
    expect(canary).toHaveBeenCalledWith(
      expect.objectContaining({
        bump: SEMVER.patch,
        canaryIdentifier: "canary.123.1",
      })
    );
  });
});

describe("next in ci", () => {
  test("should post comment with new version", async () => {
    const auto = new Auto({ ...defaults, plugins: [] });

    // @ts-ignore
    jest.spyOn(console, "log").mockImplementation();
    exec.mockResolvedValue("v1.0.0");
    // @ts-ignore
    auto.checkClean = () => Promise.resolve(true);
    const prBody = jest.fn();
    // @ts-ignore
    auto.prBody = prBody;
    auto.logger = dummyLog();
    await auto.loadConfig();
    auto.git!.publish = () => Promise.resolve({ data: {} } as any);
    auto.git!.getLatestTagInBranch = () => Promise.resolve("1.2.3");
    auto.git!.getLatestRelease = () => Promise.resolve("1.2.3");
    auto.release!.generateReleaseNotes = () => Promise.resolve("notes");
    auto.release!.getCommitsInRelease = () =>
      Promise.resolve([makeCommitFromMsg("Test Commit")]);

    const afterRelease = jest.fn();
    auto.hooks.afterRelease.tap("test", afterRelease);
    auto.hooks.next.tap("test", () => ["1.2.4-next.0"]);
    jest.spyOn(auto.release!, "getCommits").mockImplementation();

    await auto.next({});
    expect(prBody).toHaveBeenCalledWith({
      context: "prerelease-version",
      pr: 123,
      message: endent`
        # Version

        Published prerelease version: \`1.2.4-next.0\`

        <details>
          <summary>Changelog</summary>

          notes
        </details>
      `,
    });
  });

  test("should use labels on next branch PR", async () => {
    const auto = new Auto({ ...defaults, plugins: [] });

    auto.logger = dummyLog();
    await auto.loadConfig();

    // @ts-ignore
    auto.inPrereleaseBranch = () => true;
    // @ts-ignore
    jest.spyOn(console, "log").mockImplementation();
    auto.git!.getLatestTagInBranch = () => Promise.resolve("1.4.0-next.0");
    auto.release!.getSemverBump = () => Promise.resolve(SEMVER.patch);
    
    auto.git!.getLabels = () => Promise.resolve([]);
    expect(await auto.getVersion()).toBe(SEMVER.prepatch);

    auto.git!.getLabels = () => Promise.resolve([SEMVER.major]);
    expect(await auto.getVersion()).toBe(SEMVER.premajor);
  });
});
