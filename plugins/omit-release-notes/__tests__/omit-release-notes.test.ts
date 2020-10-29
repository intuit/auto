import Auto, { SEMVER } from "@auto-it/core";
import makeCommitFromMsg from "@auto-it/core/dist/__tests__/make-commit-from-msg";
import Changelog from "@auto-it/core/dist/changelog";
import {
  makeChangelogHooks,
  makeHooks,
} from "@auto-it/core/dist/utils/make-hooks";
import OmitReleaseNotesPlugin, { IReleaseNotesPluginOptions } from "../src";

const setup = (options: IReleaseNotesPluginOptions) => {
  const plugin = new OmitReleaseNotesPlugin(options);
  const hooks = makeHooks();
  const changelogHooks = makeChangelogHooks();

  plugin.apply({ hooks } as Auto);
  hooks.onCreateChangelog.call({ hooks: changelogHooks } as Changelog, {
    bump: SEMVER.patch,
  });

  return changelogHooks;
};

describe("Omit Release Notes Plugin", () => {
  test("should not filter the commit", async () => {
    const hooks = setup({ name: ["pdbf"] });
    const commit = makeCommitFromMsg("foo");
    expect(await hooks.omitReleaseNotes.promise(commit)).toBeUndefined();
  });

  test("should filter the commit by name", async () => {
    const hooks = setup({ name: ["pdbf"] });
    const commit = makeCommitFromMsg("foo", { name: "pdbf" });
    expect(await hooks.omitReleaseNotes.promise(commit)).toBe(true);
  });

  test("should filter the commit by username", async () => {
    const hooks = setup({ username: ["pdbf"] });
    const commit = makeCommitFromMsg("foo", { username: "pdbf" });
    expect(await hooks.omitReleaseNotes.promise(commit)).toBe(true);
  });

  test("should filter the commit by email", async () => {
    const hooks = setup({ email: ["foo@bar.com"] });
    const commit = makeCommitFromMsg("foo", { email: "foo@bar.com" });
    expect(await hooks.omitReleaseNotes.promise(commit)).toBe(true);
  });

  test("should filter the commit by label", async () => {
    const hooks = setup({ labels: ["me"] });
    const commit = makeCommitFromMsg("foo", { labels: ["me"] });
    expect(await hooks.omitReleaseNotes.promise(commit)).toBe(true);
  });
});
