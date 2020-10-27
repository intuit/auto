import { dummyLog } from "@auto-it/core/src/utils/logger";
import { sanitizeMarkdown } from "@auto-it/slack";
import createHttpsProxyAgent from "https-proxy-agent";

import MicrosoftTeamsPlugin from "../src";

const fetchSpy = jest.fn();
// @ts-ignore
jest.mock("node-fetch", () => (...args) => {
  fetchSpy(...args);
});

beforeEach(() => {
  fetchSpy.mockClear();
});

const mockAuto = {
  git: {},
  logger: dummyLog(),
} as any;

describe("postToMicrosoftTeams", () => {
  test("should call microsoft-teams api with minimal config", async () => {
    const plugin = new MicrosoftTeamsPlugin("https://microsoft-teams-url");

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown("# My Notes\n- PR [some link](google.com)"),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      undefined
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe("https://microsoft-teams-url");
    expect(fetchSpy.mock.calls[0][1].agent).toBeUndefined();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });

  test("should call microsoft-teams api through http proxy", async () => {
    const plugin = new MicrosoftTeamsPlugin("https://microsoft-teams-url");
    process.env.http_proxy = "http-proxy";

    await plugin.createPost(
      mockAuto,
      sanitizeMarkdown("# My Notes\n- PR [some link](google.com)"),
      "*<https://git.hub/some/project/releases/v1.0.0|v1.0.0>*",
      createHttpsProxyAgent("mock-url")
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe("https://microsoft-teams-url");
    expect(fetchSpy.mock.calls[0][1].agent).not.toBeUndefined();
    expect(fetchSpy.mock.calls[0][1].body).toMatchSnapshot();
  });
});
