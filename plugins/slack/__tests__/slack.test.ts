import Auto from "@auto-it/core";
import makeCommitFromMsg from "@auto-it/core/src/__tests__/make-commit-from-msg";
import { dummyLog } from "@auto-it/core/src/utils/logger";
import { makeHooks } from "@auto-it/core/src/utils/make-hooks";
import { defaultLabels } from "@auto-it/core/dist/semver";
import { execSync } from "child_process";
import createHttpsProxyAgent from "https-proxy-agent";

import SlackPlugin, { sanitizeMarkdown } from "../src";

const fetchSpy = jest.fn();
// @ts-ignore
jest.mock("node-fetch", () => (...args) => {
  fetchSpy(...args);
});

beforeEach(() => {
  fetchSpy.mockClear();
});

const mockResponse = [
  {
    data: {
      html_url: "https://git.hub/some/project/releases/v1.0.0",
      name: "v1.0.0",
    },
  },
];

// For the purpose of this test, we use the current branch as the "prerelease" branch to fake being on a "next" branch
const nextBranch = execSync("git rev-parse --abbrev-ref HEAD", {
  encoding: "utf8",
}).trim();

const mockAuto = {
  git: {},
  logger: dummyLog(),
} as any;

describe("postToSlack", () => {
  test("doesn't post with no new version", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    const hooks = makeHooks();

    jest.spyOn(plugin, "createPost").mockImplementation();
    // @ts-ignore
    plugin.apply({ hooks } as Auto);

    await hooks.afterRelease.promise({
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "# My Notes",
    });

    expect(plugin.createPost).not.toHaveBeenCalled();
  });

  test("doesn't post with no commits", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    const hooks = makeHooks();

    jest.spyOn(plugin, "createPost").mockImplementation();
    // @ts-ignore
    plugin.apply({ hooks, options: {} } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "# My Notes",
    });

    expect(plugin.createPost).not.toHaveBeenCalled();
  });

  test("doesn't post with skip release label", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    const hooks = makeHooks();

    jest.spyOn(plugin, "createPost").mockImplementation();
    // @ts-ignore
    plugin.apply({
      hooks,
      options: {},
      config: { labels: defaultLabels },
    } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("skipped", { labels: ["skip-release"] })],
      releaseNotes: "# My Notes",
    });

    expect(plugin.createPost).not.toHaveBeenCalled();
  });

  test("doesn't post without url", async () => {
    // @ts-ignore
    const plugin = new SlackPlugin({ url: undefined });
    const hooks = makeHooks();

    jest.spyOn(plugin, "createPost").mockImplementation();
    // @ts-ignore
    plugin.apply({ hooks, options: {} } as Auto);

    await expect(
      hooks.afterRelease.promise({
        newVersion: "1.0.0",
        lastRelease: "0.1.0",
        commits: [makeCommitFromMsg("a patch")],
        releaseNotes: "# My Notes",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  test("doesn't post when prerelease branch and using default prereleasePublish setting", async () => {
    // @ts-ignore
    const plugin = new SlackPlugin({
      url: "https://custom-slack-url",
    });
    const hooks = makeHooks();

    jest.spyOn(plugin, "createPost").mockImplementation();
    // @ts-ignore
    plugin.apply({
      ...mockAuto,
      hooks,
      options: {},
      config: {
        prereleaseBranches: [nextBranch],
        labels: defaultLabels,
      },
    } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("a patch")],
      releaseNotes: "# My Notes",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("doesn't post when prerelease branch setting is false", async () => {
    // @ts-ignore
    const plugin = new SlackPlugin({
      url: "https://custom-slack-url",
      publishPreRelease: false,
    });
    const hooks = makeHooks();

    jest.spyOn(plugin, "createPost").mockImplementation();
    // @ts-ignore
    plugin.apply({
      ...mockAuto,
      hooks,
      options: {},
      config: {
        prereleaseBranches: [nextBranch],
        labels: defaultLabels,
      },
    } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("a patch")],
      releaseNotes: "# My Notes",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("posts when prerelease branch setting is true", async () => {
    // @ts-ignore
    const plugin = new SlackPlugin({
      url: "https://custom-slack-url",
      publishPreRelease: true,
    });
    const hooks = makeHooks();

    jest.spyOn(plugin, "createPost").mockImplementation();
    // @ts-ignore
    plugin.apply({
      ...mockAuto,
      hooks,
      options: {},
      config: { prereleaseBranches: ["next"], labels: defaultLabels },
    } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("a patch")],
      releaseNotes: "# My Notes",
      // @ts-ignore
      response: mockResponse,
    });
    expect(plugin.createPost).toHaveBeenCalledTimes(1);
  });

  test("should warn when no token", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    const logger = dummyLog();
    jest.spyOn(logger.verbose, "warn").mockImplementation();
    process.env.SLACK_TOKEN = "";

    await plugin.createPost(
      { ...mockAuto, logger } as Auto,
      sanitizeMarkdown("# My Notes\n- PR [some link](google.com)"),
      "",
      undefined
    );

    expect(logger.verbose.warn).toHaveBeenCalled();
  });

  test("should call slack api with minimal config", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    process.env.SLACK_TOKEN = "MY_TOKEN";

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown("# My Notes\n- PR [some link](google.com)"),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      undefined
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://custom-slack-url?token=MY_TOKEN"
    );
    expect(fetchSpy.mock.calls[0][1].agent).toBeUndefined();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should add more indents to nested lists", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    process.env.SLACK_TOKEN = "MY_TOKEN";

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown(
        "# My Notes\n- PR [some link](google.com)\n - Another note"
      ),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      undefined
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://custom-slack-url?token=MY_TOKEN"
    );
    expect(fetchSpy.mock.calls[0][1].agent).toBeUndefined();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should add more indents to nested lists - 2 spaces", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    process.env.SLACK_TOKEN = "MY_TOKEN";

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown(
        "# My Notes\n- PR [some link](google.com)\n  - Another note"
      ),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      undefined
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://custom-slack-url?token=MY_TOKEN"
    );
    expect(fetchSpy.mock.calls[0][1].agent).toBeUndefined();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should call slack api through http proxy", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    process.env.SLACK_TOKEN = "MY_TOKEN";
    process.env.http_proxy = "http-proxy";

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown("# My Notes\n- PR [some link](google.com)"),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      createHttpsProxyAgent("mock-url")
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://custom-slack-url?token=MY_TOKEN"
    );
    expect(fetchSpy.mock.calls[0][1].agent).not.toBeUndefined();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should remove markdown code types from block", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    process.env.SLACK_TOKEN = "MY_TOKEN";

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown(
        `# My Notes\n\`\`\`json\n{ "foo": "bar" }\`\`\`\n- PR [some link](google.com)`
      ),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      undefined
    );

    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should call slack api through https proxy", async () => {
    const plugin = new SlackPlugin("https://custom-slack-url");
    process.env.SLACK_TOKEN = "MY_TOKEN";
    process.env.https_proxy = "https-proxy";

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown("# My Notes\n- PR [some link](google.com)"),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      createHttpsProxyAgent("mock-url")
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://custom-slack-url?token=MY_TOKEN"
    );
    expect(fetchSpy.mock.calls[0][1].agent).not.toBeUndefined();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should call slack api", async () => {
    const plugin = new SlackPlugin({ url: "https://custom-slack-url" });
    const hooks = makeHooks();
    process.env.SLACK_TOKEN = "MY_TOKEN";
    plugin.apply({ hooks, options: {}, ...mockAuto } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("a patch")],
      releaseNotes: "# My Notes\n- PR [some link](google.com)",
      // @ts-ignore
      response: mockResponse,
    });

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://custom-slack-url?token=MY_TOKEN"
    );
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should call slack api with custom atTarget", async () => {
    const plugin = new SlackPlugin({
      url: "https://custom-slack-url",
      atTarget: "here",
    });
    const hooks = makeHooks();
    process.env.SLACK_TOKEN = "MY_TOKEN";
    plugin.apply({ hooks, options: {}, ...mockAuto } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("a patch")],
      releaseNotes: "# My Notes\n- PR [some link](google.com)",
      // @ts-ignore
      response: mockResponse,
    });

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://custom-slack-url?token=MY_TOKEN"
    );
    expect(fetchSpy.mock.calls[0][1].body.includes("@here")).toBe(true);
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should call slack api in env var", async () => {
    process.env.SLACK_WEBHOOK_URL = "https://foo.bar";
    const plugin = new SlackPlugin();
    const hooks = makeHooks();
    process.env.SLACK_TOKEN = "MY_TOKEN";
    plugin.apply({ hooks, options: {}, ...mockAuto } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("a patch")],
      releaseNotes: "# My Notes\n- PR [some link](google.com)",
      // @ts-ignore
      response: mockResponse,
    });

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe("https://foo.bar?token=MY_TOKEN");
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should add title", async () => {
    process.env.SLACK_WEBHOOK_URL = "https://foo.bar";
    const plugin = new SlackPlugin({ title: "My Cool Project" });
    const hooks = makeHooks();
    process.env.SLACK_TOKEN = "MY_TOKEN";
    plugin.apply({ hooks, options: {}, ...mockAuto } as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [makeCommitFromMsg("a patch")],
      releaseNotes: "# My Notes\n- PR [some link](google.com)",
      // @ts-ignore
      response: mockResponse,
    });

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });
});
