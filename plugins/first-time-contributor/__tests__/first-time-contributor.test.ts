import * as Auto from "@auto-it/core";
import makeCommitFromMsg from "@auto-it/core/dist/__tests__/make-commit-from-msg";
import Changelog from "@auto-it/core/dist/changelog";
import { RestEndpointMethodTypes } from "@octokit/rest";
import {
  makeChangelogHooks,
  makeHooks,
} from "@auto-it/core/dist/utils/make-hooks";

import FirstTimeContributor from "../src";

const graphql = jest.fn();
const exec = jest.fn();
exec.mockReturnValue("");
// @ts-ignore
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args)
);

const setup = (
  contributors: Array<
    Partial<
      RestEndpointMethodTypes["repos"]["listContributors"]["response"]["data"][number]
    >
  > = []
) => {
  const plugin = new FirstTimeContributor();
  const hooks = makeHooks();
  const changelogHooks = makeChangelogHooks();

  plugin.apply({
    hooks,
    git: {
      graphql,
      options: { repo: "repo", owner: "test" },
      github: {
        repos: {
          listContributors: () => Promise.resolve({ data: contributors }),
        },
      },
    } as any,
  } as Auto.Auto);
  hooks.onCreateChangelog.call(
    {
      hooks: changelogHooks,
      options: { baseUrl: "https://github.com" },
    } as Changelog,
    { bump: Auto.SEMVER.patch }
  );

  return changelogHooks;
};

describe("First Time Contributor Plugin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should include all authors with no past contributors", async () => {
    const hooks = setup();
    const commits = [
      makeCommitFromMsg("foo", { name: "Jeff", username: "Jeff" }),
      makeCommitFromMsg("foo", { name: "Andrew", username: "Andrew" }),
    ];

    graphql.mockReturnValueOnce({
      search: { issueCount: 0 },
    });
    graphql.mockReturnValueOnce({
      search: { issueCount: 0 },
    });

    expect(await hooks.addToBody.promise([], commits)).toMatchSnapshot();
  });

  test("should exclude a past contributor", async () => {
    const hooks = setup();
    const commits = [
      makeCommitFromMsg("foo", { name: "Jeff", username: "Jeff" }),
      makeCommitFromMsg("foo", { name: "Andrew", username: "Andrew" }),
    ];

    graphql.mockReturnValueOnce({
      search: { issueCount: 1 },
    });

    expect(await hooks.addToBody.promise([], commits)).toMatchSnapshot();
  });

  test("should exclude a past contributor by username", async () => {
    const hooks = setup([{ login: "Andrew420" }]);
    const commits = [
      makeCommitFromMsg("foo", { name: "Jeff123", username: "Jeff123" }),
      makeCommitFromMsg("foo", { name: "Andrew420", username: "Andrew420" }),
    ];

    graphql.mockReturnValueOnce({
      search: { issueCount: 1 },
    });

    expect(await hooks.addToBody.promise([], commits)).toMatchSnapshot();
  });

  test("should not include past contributors", async () => {
    const hooks = setup();
    const commits = [
      makeCommitFromMsg("foo", { name: "Jeff", username: "Jeff" }),
      makeCommitFromMsg("foo", { name: "Andrew", username: "Andrew" }),
    ];

    graphql.mockReturnValue({
      search: { issueCount: 2 },
    });

    expect(await hooks.addToBody.promise([], commits)).toMatchSnapshot();
  });

  test("should include a username if it exists", async () => {
    const hooks = setup();
    const commits = [
      makeCommitFromMsg("foo", { name: "Jeff", username: "jeff-the-snake" }),
      makeCommitFromMsg("foo", { name: "Andrew", username: "hipstersmoothie" }),
    ];

    graphql.mockReturnValue({
      search: { issueCount: 1 },
    });

    expect(await hooks.addToBody.promise([], commits)).toMatchSnapshot();
  });

  test("should include only username if no name exists", async () => {
    const hooks = setup();
    const commits = [
      makeCommitFromMsg("foo", { username: "jeff-the-snake", name: "" }),
    ];

    graphql.mockReturnValue({
      search: { issueCount: 1 },
    });

    expect(await hooks.addToBody.promise([], commits)).toMatchSnapshot();
  });

  test("should exclude bots", async () => {
    const hooks = setup();
    const commits = [
      makeCommitFromMsg("foo", {
        username: "jeff-the-snake",
        name: "jeff",
        type: "Bot",
      }),
    ];

    graphql.mockReturnValue({
      search: { issueCount: 1 },
    });

    expect(await hooks.addToBody.promise([], commits)).toMatchSnapshot();
  });
});
