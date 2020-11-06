import envCi from "env-ci";
import { dummyLog } from "../utils/logger";

jest.mock("env-ci");

const envSpy = envCi as jest.Mock;
envSpy.mockImplementation(() => ({
  isCi: true,
  branch: "master",
}));

import { Auto } from "../auto";

const defaults = {
  owner: "foo",
  repo: "bar",
};

jest.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } }),
    };

    repos = {
      get: jest.fn().mockReturnValue({}),
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

describe("Auto", () => {
  describe("pr-check", () => {
    jest.setTimeout(10 * 1000);
    let createStatus: jest.Mock;

    beforeEach(() => {
      createStatus = jest.fn();
    });

    const required = {
      url: "https://google.com",
    };

    test("should exit successfully if ran from master + CI", async () => {
      const auto = new Auto(defaults);
      const exit = jest.fn();

      envSpy.mockImplementationOnce(() => ({
        isCi: true,
        branch: "master",
      }));

      // @ts-ignore
      process.exit = exit;
      auto.logger = dummyLog();
      await auto.loadConfig();
      auto.git!.createStatus = createStatus;

      await auto.prCheck({ ...required });
      expect(exit).toHaveBeenCalledWith(0);
    });
  });
});
