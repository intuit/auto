import { Auto } from "../auto";

jest.mock("child_process");

describe("getRemote", () => {
  test("should fall back to origin with no git client", async () => {
    const auto = new Auto();
    // @ts-ignore
    expect(await auto.getRemote()).toBe("origin");
  });

  test("should use html_url if we can push", async () => {
    const auto = new Auto();
    const html_url = "https://github.com/fake/remote";
    auto.git = {
      verifyAuth: (url: string) => url === html_url,
      getProject: () => Promise.resolve({ html_url }),
    } as any;
    // @ts-ignore
    expect(await auto.getRemote()).toBe(html_url);
  });

  test("should use ssh_url if we can push", async () => {
    const auto = new Auto();
    const ssh_url = "git@github.com:fake/remote.git";
    process.env.GH_TOKEN = undefined;
    process.env.GITHUB_ACTION = undefined;
    auto.git = {
      verifyAuth: (url: string) => url === ssh_url,
      getProject: () => Promise.resolve({ ssh_url }),
    } as any;
    // @ts-ignore
    expect(await auto.getRemote()).toBe(ssh_url);
  });

  test("should put token in url", async () => {
    const auto = new Auto();
    const html_url = "https://github.com/fake/remote";
    process.env.GH_TOKEN = "XXXX";
    auto.git = {
      verifyAuth: (url: string) => url.includes("XXXX"),
      getProject: () => Promise.resolve({ html_url }),
    } as any;
    // @ts-ignore
    expect(await auto.getRemote()).toBe("https://XXXX@github.com/fake/remote");
  });

  test("should GitHub action user in url", async () => {
    const auto = new Auto();
    const html_url = "https://github.com/fake/remote";
    process.env.GITHUB_TOKEN = "XXXX";
    process.env.GITHUB_ACTION = "true";
    auto.git = {
      verifyAuth: (url: string) => url.includes("x-access-token:"),
      getProject: () => Promise.resolve({ html_url }),
    } as any;
    // @ts-ignore
    expect(await auto.getRemote()).toBe(
      "https://x-access-token:XXXX@github.com/fake/remote"
    );
  });
});
