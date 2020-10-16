import { Auto } from "../auto";
import { dummyLog } from "../utils/logger";

const defaultRemote = "git@github.foo.com";
const defaults = {
  owner: "foo",
  repo: "bar",
};

process.env.GH_TOKEN = "XXXX";

const reposGet = jest.fn();

jest.mock("@octokit/rest", () => {
  const Octokit = class MockOctokit {
    static plugin = () => Octokit;

    authenticate = () => undefined;

    repos = {
      get: reposGet,
    };

    hook = {
      error: () => undefined,
    };
  };

  return { Octokit };
});

const execSpy = jest.fn();
// @ts-ignore
jest.mock("../utils/exec-promise.ts", () => (...args) => execSpy(...args));

describe("remote parsing", () => {
  test("should fall back to origin when no git", async () => {
    const auto = new Auto(defaults);
    auto.logger = dummyLog();

    execSpy.mockReturnValue(Promise.resolve());

    // @ts-ignore
    expect(await auto.getRemote()).toBe("origin");
  });

  test("should fall back to configured remote when no git", async () => {
    const auto = new Auto(defaults);
    auto.logger = dummyLog();

    execSpy.mockReturnValue(Promise.resolve(defaultRemote));

    // @ts-ignore
    expect(await auto.getRemote()).toBe(defaultRemote);
  });

  test("should fall back to configured remote", async () => {
    const auto = new Auto(defaults);
    auto.logger = dummyLog();

    execSpy.mockReturnValue(Promise.resolve(defaultRemote));
    auto.git = {
      getProject: () => {},
      verifyAuth: () => false,
    } as any;

    // @ts-ignore
    expect(await auto.getRemote()).toBe(defaultRemote);
  });

  test("use html_url when authed", async () => {
    const html_url = "https://my.repo";
    const auto = new Auto(defaults);
    auto.logger = dummyLog();

    execSpy.mockReturnValue(Promise.resolve(defaultRemote));
    auto.git = {
      getProject: () => ({ html_url }),
      verifyAuth: (url: string) => url === html_url,
    } as any;

    // @ts-ignore
    expect(await auto.getRemote()).toBe(html_url);
  });

  test("use fall back to default when not authed", async () => {
    const html_url = "https://my.repo";
    const auto = new Auto(defaults);
    auto.logger = dummyLog();

    execSpy.mockReturnValue(Promise.resolve(defaultRemote));
    auto.git = {
      getProject: () => ({ html_url }),
      verifyAuth: () => false,
    } as any;

    // @ts-ignore
    expect(await auto.getRemote()).toBe(defaultRemote);
  });

  test("add token to url if html doesn't auth", async () => {
    const html_url = "https://my.repo";
    const auto = new Auto(defaults);
    process.env.GH_TOKEN = "XXXX";
    auto.logger = dummyLog();

    execSpy.mockReturnValue(Promise.resolve(defaultRemote));
    auto.git = {
      getProject: () => ({ html_url, permissions: { push: true } }),
      verifyAuth: (url: string) => url !== html_url,
    } as any;

    // @ts-ignore
    expect(await auto.getRemote()).toBe("https://XXXX@my.repo/");
  });
});
