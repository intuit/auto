import * as Auto from "@auto-it/core";
import generateReadme from "all-contributors-cli/dist/generate";
import addContributor from "all-contributors-cli/dist/contributors";
import {
  makeHooks,
  makeLogParseHooks,
} from "@auto-it/core/dist/utils/make-hooks";
import makeCommitFromMsg from "@auto-it/core/dist/__tests__/make-commit-from-msg";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import fs from "fs";
import env from "env-ci";

import AllContributors from "../src";

const generateMock = jest.fn();
const addContributorMock = jest.fn();
const envMock = jest.fn();
const gitShow = jest.fn();
const writeMock = jest.fn();
const getLernaPackages = jest.fn();

envMock.mockReturnValue({});
getLernaPackages.mockReturnValue(Promise.resolve([]));
gitShow.mockReturnValue(Promise.resolve(""));

jest.mock("env-ci");
jest.mock("child_process");
jest.mock("all-contributors-cli/dist/contributors");
jest.mock("all-contributors-cli/dist/generate");

// @ts-ignore 
generateReadme.mockImplementation(generateMock);
// @ts-ignore
addContributor.mockImplementation(addContributorMock);
// @ts-ignore
env.mockImplementation(envMock);
// @ts-ignore
jest.mock("../../../packages/core/dist/utils/exec-promise", () => (...args) =>
  gitShow(...args)
);
jest.mock("../../../packages/core/dist/utils/get-lerna-packages", () => (...args: any[]) => getLernaPackages(...args));
jest.spyOn(process, "chdir").mockReturnValue();

const mockRead = (result: string) =>
  jest
    .spyOn(fs, "readFileSync")
    // @ts-ignore
    .mockReturnValueOnce(result);

jest.spyOn(fs, "writeFileSync").mockImplementation(writeMock);

describe("All Contributors Plugin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("beforeShipit", () => {
    test("should not do anything for certain release types", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "latest",
      });

      expect(comment).not.toHaveBeenCalled();

      await autoHooks.beforeShipIt.promise({
        releaseType: "old",
      });

      expect(comment).not.toHaveBeenCalled();
    });

    test("should not do anything without a PR", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      envMock.mockReturnValueOnce({ pr: undefined });

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "canary",
      });

      expect(comment).not.toHaveBeenCalled();
    });

    test("should not do anything if PR doesn't exist", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      envMock.mockReturnValueOnce({ pr: 123 });

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "canary",
      });

      expect(comment).not.toHaveBeenCalled();
    });

    test("should not do anything if no extra contributions found", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      envMock.mockReturnValueOnce({ pr: 123 });

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
        git: {
          getPullRequest: () => ({
            data: { body: "A body with no contributions" },
          }),
        } as any,
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "canary",
      });

      expect(comment).not.toHaveBeenCalled();
    });

    test("should comment confirming extra contributions", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      envMock.mockReturnValueOnce({ pr: 123 });

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
        git: {
          getPullRequest: () => ({
            data: {
              body:
                "# What Changed\r\n\r\nsee title\r\n\r\n# Why\r\n\r\ncloses #1147 \r\n\r\n# Contributions\r\n\r\n- @andrew - design, doc\r\n\r\n",
            },
          }),
        } as any,
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "canary",
      });

      expect(comment.mock.calls[0][0].message).toMatchSnapshot();
    });

    test("should warn about unknown contribution types", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      envMock.mockReturnValueOnce({ pr: 123 });

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
        git: {
          getPullRequest: () => ({
            data: {
              body:
                "# What Changed\r\n\r\nsee title\r\n\r\n# Why\r\n\r\ncloses #1147 \r\n\r\n# Contributions\r\n\r\n- @andrew - design123, doc\r\n\r\n",
            },
          }),
        } as any,
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "canary",
      });

      expect(comment.mock.calls[0][0].message).toMatchSnapshot();
    });

    test("should warn about unknown contribution types - no valid", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      envMock.mockReturnValueOnce({ pr: 123 });

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
        git: {
          getPullRequest: () => ({
            data: {
              body:
                "# What Changed\r\n\r\nsee title\r\n\r\n# Why\r\n\r\ncloses #1147 \r\n\r\n# Contributions\r\n\r\n- @andrew - design123, doc456\r\n\r\n",
            },
          }),
        } as any,
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "canary",
      });

      expect(comment.mock.calls[0][0].message).toMatchSnapshot();
    });

    test("should warn about unknown contribution types - some valid", async () => {
      const releasedLabel = new AllContributors();
      const autoHooks = makeHooks();
      const comment = jest.fn();

      envMock.mockReturnValueOnce({ pr: 123 });

      releasedLabel.apply({
        comment: comment as any,
        hooks: autoHooks,
        logger: dummyLog(),
        git: {
          getPullRequest: () => ({
            data: {
              body:
                "# What Changed\r\n\r\nsee title\r\n\r\n# Why\r\n\r\ncloses #1147 \r\n\r\n# Contributions\r\n\r\n- @andrew - design123, doc456\r\n- @adam - doc\r\n\r\n",
            },
          }),
        } as any,
      } as Auto.Auto);

      await autoHooks.beforeShipIt.promise({
        releaseType: "canary",
      });

      expect(comment.mock.calls[0][0].message).toMatchSnapshot();
    });
  });

  test("should do nothing for username-less commits", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead('{ "contributors": [] }');

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        makeCommitFromMsg("Do the stuff"),
        makeCommitFromMsg("Do the thing", {
          files: ["src/index.ts"],
        }),
      ],
    });

    expect(addContributorMock).not.toHaveBeenCalled();
  });

  test("should find a single contribution", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();

    mockRead('{ "contributors": [] }');
    addContributorMock.mockResolvedValue({
      contributors: [
        {
          login: "Jeff",
          contributions: ["code"],
        },
      ],
    });

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "Do the thing",
          hash: "123",
          labels: [],
          files: ["src/index.ts"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
      ],
    });

    expect(addContributorMock.mock.calls[0][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[0][2]).toBe("code");
  });

  test("should work for single package", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();

    mockRead('{ "contributors": [] }');
    getLernaPackages.mockRejectedValueOnce(new Error("test"));

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "Do the thing",
          hash: "123",
          labels: [],
          files: ["src/index.ts"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
      ],
    });

    expect(addContributorMock.mock.calls[0][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[0][2]).toBe("code");
  });

  test("should find contributions from merge commit", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead('{ "contributors": [] }');
    gitShow.mockReturnValueOnce("src/index.ts");

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "Do the thing",
          hash: "123",
          labels: [],
          files: ["src/index.ts"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
      ],
    });

    expect(addContributorMock.mock.calls[0][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[0][2]).toBe("code");
  });

  test("should find a multiple contributions", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead('{ "contributors": [] }');

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "Do the thing",
          hash: "123",
          labels: [],
          files: ["src/index.ts"],

          authors: [{ username: "Jeff", hash: "123" }],
        },
        {
          subject: "Do other thing",
          hash: "123",
          labels: [],
          files: ["src/index.test.ts"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
      ],
    });

    expect(addContributorMock.mock.calls[0][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[0][2]).toBe("code,test");
  });

  test("should update sub-packages", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();

    getLernaPackages.mockReturnValueOnce(
      Promise.resolve([
        {
          path: "packages/app",
          name: "@foobar/app",
          version: "1.2.3",
        },
        {
          path: "packages/lib",
          name: "@foobar/lib",
          version: "1.2.3",
        },
      ])
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "Do the thing",
          hash: "123",
          labels: [],
          files: ["packages/app/src/index.ts"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
        {
          subject: "Do the docs",
          hash: "124",
          labels: [],
          files: ["packages/lib/README.md"],
          authors: [{ username: "Jeff", hash: "124" }],
        },
      ],
    });

    // root contributors
    expect(addContributorMock.mock.calls[0][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[0][2]).toBe("code,doc");
    // app contributors
    expect(addContributorMock.mock.calls[1][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[1][2]).toBe("code");
    // lib contributors
    expect(addContributorMock.mock.calls[2][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[2][2]).toBe("doc");
  });

  test("should update old contributors", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead(
      '{ "contributors": [ { "login": "Jeff", "contributions": ["infra"] } ] }'
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "Do the thing",
          hash: "123",
          labels: [],
          files: ["src/index.ts"],
          authors: [{ username: "Jeff", hash: "123" }],
        },
      ],
    });

    expect(addContributorMock.mock.calls[0][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[0][2]).toBe("infra,code");
  });

  test("should include sub-commit contributors", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead(
      '{ "contributors": [ { "login": "Jeff", "contributions": ["infra"] } ] }'
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        {
          subject: "Do the thing",
          hash: "123",
          labels: [],
          files: ["src/index.ts"],
          authors: [
            { username: "Jeff", hash: "123" },
            { username: "Adam", hash: "456" },
          ],
        },
      ],
    });

    expect(addContributorMock.mock.calls[0][1]).toBe("Jeff");
    expect(addContributorMock.mock.calls[0][2]).toBe("infra,code");
    expect(addContributorMock.mock.calls[1][1]).toBe("Adam");
    expect(addContributorMock.mock.calls[1][2]).toBe("code");
  });

  test("should not update if no new contribution types", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead(
      '{ "contributors": [ { "login": "Jeff", "contributions": ["code"] } ] }'
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        makeCommitFromMsg("Do the thing", {
          files: ["src/index.ts"],
          username: "Jeff",
        }),
      ],
    });

    expect(addContributorMock).not.toHaveBeenCalled();
  });

  test("should initialize contributors if not already initialized", async () => {
    const releasedLabel = new AllContributors();
    const autoHooks = makeHooks();
    mockRead(
      '{ "contributors": [ { "login": "Jeff", "contributions": ["code"] } ], "files": ["README.md"]}'
    );

    mockRead(
      "<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section --><!-- prettier-ignore-start -->\n<!-- markdownlint-disable -->\n<!-- markdownlint-restore -->\n<!-- prettier-ignore-end -->\n<!-- ALL-CONTRIBUTORS-LIST:END -->"
    );

    releasedLabel.apply({ hooks: autoHooks, logger: dummyLog() } as Auto.Auto);

    await autoHooks.afterAddToChangelog.promise({
      bump: Auto.SEMVER.patch,
      currentVersion: "0.0.0",
      lastRelease: "0.0.0",
      releaseNotes: "",
      commits: [
        makeCommitFromMsg("Do the thing", {
          files: ["src/index.ts"],
          username: "Jeff",
        }),
      ],
    });

    expect(generateMock).toHaveBeenCalled();
  });

  describe("parseCommit", () => {
    test("should do nothing if no extra contributions are found", async () => {
      const releasedLabel = new AllContributors();
      const hooks = makeHooks();
      const logParseHooks = makeLogParseHooks();

      mockRead('{ "contributors": [] }');

      releasedLabel.apply({ hooks } as any);
      hooks.onCreateLogParse.call({ hooks: logParseHooks } as any);

      const parsed = await logParseHooks.parseCommit.promise({
        subject: "test",
        files: [],
        hash: "123",
        labels: [],
        authors: [],
      });

      expect(parsed.authors).toHaveLength(0);
    });

    test("should add contributors mentioned in PR body", async () => {
      const releasedLabel = new AllContributors();
      const hooks = makeHooks();
      const logParseHooks = makeLogParseHooks();
      const getUserByUsername = jest.fn();
      getUserByUsername.mockReturnValueOnce({ login: "some_guy" });
      getUserByUsername.mockReturnValueOnce({ login: "other_guy" });

      mockRead('{ "contributors": [] }');

      releasedLabel.apply({ hooks, git: { getUserByUsername } } as any);
      hooks.onCreateLogParse.call({ hooks: logParseHooks } as any);

      const parsed = await logParseHooks.parseCommit.promise({
        subject: "test",
        rawBody: `# Contributions\n\n- @some_guy - design, doc\n- @other_guy - infra`,
        files: [],
        hash: "123",
        labels: [],
        authors: [],
      });

      expect(parsed.authors).toHaveLength(2);
      expect(parsed.authors[0]).toStrictEqual(
        expect.objectContaining({ username: "some_guy" })
      );
      expect(parsed.authors[1]).toStrictEqual(
        expect.objectContaining({ username: "other_guy" })
      );
    });
  });
});
