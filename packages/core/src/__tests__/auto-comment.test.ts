import Auto from "../auto";
import { dummyLog } from "../utils/logger";

jest.mock("env-ci", () => () => ({ pr: 123 }));

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

describe("comment", () => {
  test("should find PR number from CI", async () => {
    const auto = new Auto(defaults);
    auto.logger = dummyLog();
    await auto.loadConfig();

    const createComment = jest.fn();
    auto.git!.createComment = createComment;

    await auto.comment({ message: "foo" });
    expect(createComment).toHaveBeenCalled();
  });
});
