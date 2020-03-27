import Auto from "@auto-it/core";
import makeCommitFromMsg from "@auto-it/core/dist/__tests__/make-commit-from-msg";
import LogParse from "@auto-it/core/dist/log-parse";
import {
  makeHooks,
  makeLogParseHooks,
} from "@auto-it/core/dist/utils/make-hooks";
import OmitCommits, { IOmitCommitsPluginOptions } from "../src";

const setup = (options: IOmitCommitsPluginOptions) => {
  const plugin = new OmitCommits(options);
  const hooks = makeHooks();
  const logParseHooks = makeLogParseHooks();

  plugin.apply({ hooks } as Auto);
  hooks.onCreateLogParse.call({ hooks: logParseHooks } as LogParse);

  return logParseHooks;
};

describe("Omit Commits Plugin", () => {
  test("should not filter the commit", async () => {
    const hooks = setup({ name: ["pdbf"] });
    const commit = makeCommitFromMsg("foo");
    expect(await hooks.omitCommit.promise(commit)).toBeUndefined();
  });

  test("should filter the commit by name", async () => {
    const hooks = setup({ name: ["pdbf"] });
    const commit = makeCommitFromMsg("foo", { name: "pdbf" });
    expect(await hooks.omitCommit.promise(commit)).toBe(true);
  });

  test("should filter the commit by username", async () => {
    const hooks = setup({ username: ["pdbf"] });
    const commit = makeCommitFromMsg("foo", { username: "pdbf" });
    expect(await hooks.omitCommit.promise(commit)).toBe(true);
  });

  test("should filter the commit by email", async () => {
    const hooks = setup({ email: ["foo@bar.com"] });
    const commit = makeCommitFromMsg("foo", { email: "foo@bar.com" });
    expect(await hooks.omitCommit.promise(commit)).toBe(true);
  });

  test("should filter the commit by label", async () => {
    const hooks = setup({ labels: ["me"] });
    const commit = makeCommitFromMsg("foo", { labels: ["me"] });
    expect(await hooks.omitCommit.promise(commit)).toBe(true);
  });

  test("should filter the commit by subject", async () => {
    const hooks = setup({ subject: "WIP" });
    const commit = makeCommitFromMsg("[WIP] foo");
    expect(await hooks.omitCommit.promise(commit)).toBe(true);
  });
});
