import { execSync } from "child_process";

import * as Auto from "@auto-it/core";
import makeCommitFromMsg from "@auto-it/core/dist/__tests__/make-commit-from-msg";
import Changelog from "@auto-it/core/dist/changelog";
import LogParse from "@auto-it/core/dist/log-parse";
import { defaultLabels } from "@auto-it/core/dist/semver";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";

import NpmPlugin from "../src";

const exec = jest.fn();
const execPromise = jest.fn();
const getLernaPackages = jest.fn();
const readFileSync = jest.fn();

jest.mock("child_process");
// @ts-ignore
execSync.mockImplementation(exec);

jest.mock(
  "../../../packages/core/dist/utils/get-lerna-packages",
  () => (...args: any[]) => getLernaPackages(...args)
);
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => execPromise(...args)
);
jest.mock("fs", () => ({
  // @ts-ignore
  existsSync: jest.fn().mockReturnValue(true),
  // @ts-ignore
  readFile: jest.fn(),
  // @ts-ignore
  readFileSync: () => readFileSync(),
  // @ts-ignore
  read: (a, b, cb) => {
    cb(undefined);
  },
  ReadStream: function () {},
  WriteStream: function () {},
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: jest.fn(),
}));

const logParse = new LogParse();
const commitsPromise = logParse.normalizeCommits([
  makeCommitFromMsg("[PLAYA-5052] - Some Feature (#12345)", {
    labels: ["major"],
    files: ["packages/@foobar/release/package.json"],
  }),
  makeCommitFromMsg("[PLAYA-5052] - Some Feature - Revert (#12345)", {
    labels: ["major"],
  }),
  makeCommitFromMsg("woot (#12343)", {
    labels: ["major"],
  }),
  makeCommitFromMsg("Another Feature (#1234)", {
    labels: ["internal"],
  }),
]);

test("should group sections for packages", async () => {
  let changed = 0;

  getLernaPackages.mockImplementation(async () =>
    Promise.resolve([
      {
        path: "packages/@foobar/release",
        name: "@foobar/release",
        version: "1.0.0",
      },
      {
        path: "packages/@foobar/party",
        name: "@foobar/party",
        version: "1.0.0",
      },
    ])
  );
  exec.mockImplementation((cmd: string) => {
    if (!cmd.startsWith("git --no-pager show")) {
      return;
    }

    changed++;

    if (changed === 3) {
      return "";
    }

    if (changed === 4) {
      return "packages/@foobar/release/README.md";
    }

    return "packages/@foobar/release/README.md\npackages/@foobar/party/package.jso";
  });

  readFileSync.mockReturnValue("{}");

  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const changelog = new Changelog(dummyLog(), {
    owner: "andrew",
    repo: "test",
    baseUrl: "https://github.custom.com/",
    labels: defaultLabels,
    baseBranch: "main",
    prereleaseBranches: ["next"],
  });

  plugin.apply({
    config: { prereleaseBranches: ["next"] },
    hooks,
    logger: dummyLog(),
  } as Auto.Auto);
  hooks.onCreateChangelog.call(changelog, { bump: Auto.SEMVER.patch });
  changelog.loadDefaultHooks();

  const commits = await commitsPromise;
  expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
});

test("should create sections for packages", async () => {
  let changed = 0;

  getLernaPackages.mockImplementation(async () =>
    Promise.resolve([
      {
        path: "packages/@foobar/release",
        name: "@foobar/release",
        version: "1.0.0",
      },
      {
        path: "packages/@foobar/party",
        name: "@foobar/party",
        version: "1.0.0",
      },
    ])
  );
  exec.mockImplementation((cmd: string) => {
    if (!cmd.startsWith("git --no-pager show")) {
      return;
    }

    changed++;

    if (changed === 3) {
      return "";
    }

    if (changed === 4) {
      return "packages/@foobar/release/README.md";
    }

    if (changed === 2) {
      return "packages/@foobar/release/README.md";
    }

    return "packages/@foobar/party/package.json";
  });

  readFileSync.mockReturnValue("{}");

  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const changelog = new Changelog(dummyLog(), {
    owner: "andrew",
    repo: "test",
    baseUrl: "https://github.custom.com/",
    labels: defaultLabels,
    baseBranch: "main",
    prereleaseBranches: ["next"],
  });

  plugin.apply({
    config: { prereleaseBranches: ["next"] },
    hooks,
    logger: dummyLog(),
  } as Auto.Auto);
  hooks.onCreateChangelog.call(changelog, { bump: Auto.SEMVER.patch });
  changelog.loadDefaultHooks();

  const commits = await commitsPromise;
  expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
});

test("should be able to disable sections for packages", async () => {
  let changed = 0;

  getLernaPackages.mockImplementation(async () =>
    Promise.resolve([
      {
        path: "packages/@foobar/release",
        name: "@foobar/release",
        version: "1.0.0",
      },
      {
        path: "packages/@foobar/party",
        name: "@foobar/party",
        version: "1.0.0",
      },
    ])
  );
  exec.mockImplementation((cmd: string) => {
    if (!cmd.startsWith("git --no-pager show")) {
      return;
    }

    changed++;

    if (changed === 3) {
      return "";
    }

    if (changed === 4) {
      return "packages/@foobar/release/README.md";
    }

    return "packages/@foobar/release/README.md\npackages/@foobar/party/package.jso";
  });

  readFileSync.mockReturnValue("{}");

  const plugin = new NpmPlugin({ monorepoChangelog: false });
  const hooks = makeHooks();
  const changelog = new Changelog(dummyLog(), {
    owner: "andrew",
    repo: "test",
    baseUrl: "https://github.custom.com/",
    labels: defaultLabels,
    baseBranch: "main",
    prereleaseBranches: ["next"],
  });

  plugin.apply({
    config: { prereleaseBranches: ["next"] },
    hooks,
    logger: dummyLog(),
  } as Auto.Auto);
  hooks.onCreateChangelog.call(changelog, { bump: Auto.SEMVER.patch });
  changelog.loadDefaultHooks();

  const commits = await commitsPromise;
  expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
});

test("should add versions for independent packages", async () => {
  let changed = 0;

  getLernaPackages.mockImplementation(async () =>
    Promise.resolve([
      {
        path: "packages/@foobar/release",
        name: "@foobar/release",
        version: "1.0.0",
      },
      {
        path: "packages/@foobar/party",
        name: "@foobar/party",
        version: "1.0.2",
      },
    ])
  );
  exec.mockImplementation((cmd: string) => {
    if (!cmd.startsWith("git --no-pager show")) {
      return;
    }

    changed++;

    if (changed === 3) {
      return "";
    }

    if (changed === 4) {
      return "packages/@foobar/release/README.md";
    }

    return "packages/@foobar/release/README.md\npackages/@foobar/party/package.jso";
  });

  readFileSync.mockReturnValue('{ "version": "independent" }');

  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const changelog = new Changelog(dummyLog(), {
    owner: "andrew",
    repo: "test",
    baseUrl: "https://github.custom.com/",
    labels: defaultLabels,
    baseBranch: "main",
    prereleaseBranches: ["next"],
  });

  plugin.apply({
    config: { prereleaseBranches: ["next"] },
    hooks,
    logger: dummyLog(),
  } as Auto.Auto);
  hooks.onCreateChangelog.call(changelog, { bump: Auto.SEMVER.patch });
  changelog.loadDefaultHooks();

  const commits = await commitsPromise;
  expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
});

test("should create extra change logs for sub-packages", async () => {
  readFileSync.mockReturnValue('{ "version": "independent" }');

  getLernaPackages.mockImplementation(async () =>
    Promise.resolve([
      {
        path: "packages/@foobar/release",
        name: "@foobar/release",
        version: "1.0.0",
      },
      {
        path: "packages/@foobar/party",
        name: "@foobar/party",
        version: "1.0.0",
      },
    ])
  );

  exec.mockImplementation(
    async () =>
      "packages/@foobar/release/README.md\npackages/@foobar/party/package.json"
  );

  execPromise.mockResolvedValueOnce("@foobar/release");

  const plugin = new NpmPlugin();
  const hooks = makeHooks();
  const update = jest.fn();

  plugin.apply({
    config: { prereleaseBranches: ["next"] },
    hooks,
    logger: dummyLog(),
    release: {
      updateChangelogFile: update,
      makeChangelog: () => {
        const t = new Changelog(dummyLog(), {
          owner: "andrew",
          repo: "test",
          baseUrl: "https://github.custom.com/",
          labels: defaultLabels,
          baseBranch: "main",
          prereleaseBranches: ["next"],
        });
        t.hooks.renderChangelogTitle.tap("test", (label) => label);
        return t;
      },
    } as any,
  } as Auto.Auto);
  await hooks.beforeCommitChangelog.promise({
    bump: Auto.SEMVER.patch,
    commits: await commitsPromise,
    currentVersion: "1.0.0",
    lastRelease: "0.1.0",
    releaseNotes: "",
  });

  expect(update).toHaveBeenCalledWith(
    "v1.0.1",
    "major\n- [PLAYA-5052] - Some Feature [#12345](https://github.custom.com/pull/12345)",
    "packages/@foobar/release/CHANGELOG.md"
  );
});
