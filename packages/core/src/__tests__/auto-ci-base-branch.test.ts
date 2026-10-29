import type { Mock } from "vitest";
import { dummyLog } from "../utils/logger";

const envSpy: Mock = vi.hoisted(() =>
  vi.fn(() => ({
    isCi: true,
    branch: "main",
  }))
);

vi.mock("env-ci", () => ({ default: envSpy }));

import { Auto } from "../auto";

const defaults = {
  baseBranch: "main",
  owner: "foo",
  repo: "bar",
};

vi.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } }),
    };

    repos = {
      get: vi.fn().mockReturnValue({}),
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

describe("Auto", () => {
  describe("pr-check", () => {
    vi.setConfig({ testTimeout: 10 * 1000 });
    let createStatus: Mock;

    beforeEach(() => {
      createStatus = vi.fn();
    });

    const required = {
      url: "https://google.com",
    };

    test("should exit successfully if ran from main + CI", async () => {
      const auto = new Auto(defaults);
      const exit = vi.fn();

      envSpy.mockImplementationOnce(() => ({
        isCi: true,
        branch: "main",
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
