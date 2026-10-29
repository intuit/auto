import { Auto } from "../auto";
import { dummyLog } from "../utils/logger";
import child from "child_process";

vi.spyOn(child, "execSync")
  .mockImplementation(() => undefined)
  // @ts-ignore
  .mockReturnValue("");

const importMock = vi.fn();
vi.mock("import-cwd", () => ({ default: (path: string) => importMock(path) }));
vi.mock("env-ci", () => ({ default: () => ({ isCi: false, branch: "main" }) }));
vi.mock("../utils/exec-promise", () => ({
  default: () => Promise.resolve(""),
}));

const defaults = {
  owner: "foo",
  repo: "bar",
};

process.env.GH_TOKEN = "XXXX";

const search = vi.fn();
vi.mock("cosmiconfig", () => {
  const mod = {
    cosmiconfig: () => ({
      search,
    }),
  };
  return { ...mod, default: mod };
});

vi.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    search = {
      issuesAndPullRequests: () => ({ data: { items: [] } }),
    };

    repos = {
      get: vi.fn().mockReturnValue(Promise.resolve({})),
      getLatestRelease: vi.fn().mockReturnValue({ data: { tag_name: "" } }),
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

// @ts-ignore
vi.mock("gitlog", () => {
  const mod = {
    gitlogPromise: () =>
      Promise.resolve([
        {
          rawBody: "foo",
        },
        {
          rawBody: "foo",
        },
      ]),
  };
  return { ...mod, default: mod };
});

describe("Auto", () => {
  test("should add to changelog", async () => {
    const auto = new Auto({
      plugins: [],
      ...defaults,
    });

    auto.logger = dummyLog();
    await auto.loadConfig();

    const addToChangelog = vi.fn();
    auto.release!.addToChangelog = addToChangelog;
    vi.spyOn(auto.release!, "generateReleaseNotes").mockImplementation(
      () => undefined
    );
    vi.spyOn(auto.release!, "getCommitsInRelease").mockImplementation(
      () => undefined
    );

    await auto.changelog({ from: "v1.0.0" });
    expect(addToChangelog).toHaveBeenCalled();
  }, 10000);
});
