import Auto, { SEMVER } from "@auto-it/core";
import {
  makeHooks,
  makeReleaseHooks,
  makeLogParseHooks,
  makeChangelogHooks,
} from "@auto-it/core/dist/utils/make-hooks";
import { execSync } from "child_process";

import Exec from "../src";

const execSpy = execSync as jest.Mock;
jest.mock("child_process");
execSpy.mockReturnValue("");

describe("Exec Plugin", () => {
  beforeEach(() => {
    execSpy.mockClear();
  });

  test("should warn about invalid config", async () => {
    const options = { notAHook: "echo foo" };
    // @ts-ignore
    const plugins = new Exec(options);
    const hooks = makeHooks();

    plugins.apply({ hooks } as Auto);

    expect(
      await hooks.validateConfig.promise("exec", options)
    ).toMatchSnapshot();
  });

  test("should handle SyncHook hooks", async () => {
    const plugins = new Exec({ beforeRun: "echo foo" });
    const hooks = makeHooks();

    plugins.apply({ hooks } as Auto);
    await hooks.beforeRun.promise({} as any);

    expect(execSpy).toHaveBeenCalledWith("echo foo", expect.anything());
  });

  test("should handle AsyncParallelHook hooks", async () => {
    const plugins = new Exec({ version: "echo bar" });
    const hooks = makeHooks();

    plugins.apply({ hooks } as Auto);
    await hooks.version.promise({ bump: SEMVER.patch });

    expect(execSpy).toHaveBeenCalledWith("echo bar", expect.anything());
  });

  test("should handle AsyncSeriesHook hooks w/args", async () => {
    const plugins = new Exec({ beforeShipIt: "echo baz" });
    const hooks = makeHooks();

    plugins.apply({ hooks } as Auto);
    await hooks.beforeShipIt.promise({ releaseType: "latest" });

    expect(execSpy).toHaveBeenCalledWith(
      "echo baz",
      expect.objectContaining({
        env: expect.objectContaining({ ARG_0: '{"releaseType":"latest"}' }),
      })
    );
  });

  test("should handle Bail hooks", async () => {
    const plugins = new Exec({
      getRepository: `echo "{ "repo": "foo", "owner": "bar" }"`,
    });
    const hooks = makeHooks();

    execSpy.mockReturnValueOnce('{ "repo": "foo", "owner": "bar" }');
    plugins.apply({ hooks } as Auto);

    expect(await hooks.getRepository.promise()).toStrictEqual({
      repo: "foo",
      owner: "bar",
    });
  });

  describe("canary", () => {
    test("should handle string returns", async () => {
      const canaryVersion = "0.1.0-canary";
      const plugins = new Exec({
        canary: `echo ${canaryVersion}`,
      });
      const hooks = makeHooks();

      execSpy.mockReturnValueOnce(canaryVersion);
      plugins.apply({ hooks } as Auto);

      expect(
        await hooks.canary.promise({
          bump: SEMVER.patch,
          canaryIdentifier: "-canary",
        })
      ).toBe(canaryVersion);
    });

    test("should handle object return values", async () => {
      const canaryVersion = { newVersion: "0.1.0-canary", details: "foo" };
      const plugins = new Exec({
        canary: `echo ${JSON.stringify(canaryVersion)}`,
      });
      const hooks = makeHooks();

      execSpy.mockReturnValueOnce(JSON.stringify(canaryVersion));
      plugins.apply({ hooks } as Auto);

      expect(
        await hooks.canary.promise({
          bump: SEMVER.patch,
          canaryIdentifier: "-canary",
        })
      ).toStrictEqual(canaryVersion);
    });
  });

  describe("onCreateRelease", () => {
    test("should handle createChangelogTitle", async () => {
      const plugins = new Exec({
        onCreateRelease: { createChangelogTitle: "echo here" },
      });
      const hooks = makeHooks();
      const releaseHooks = makeReleaseHooks();

      execSpy.mockReturnValueOnce("here");
      plugins.apply({ hooks } as Auto);
      hooks.onCreateRelease.call({ hooks: releaseHooks } as any);

      expect(await releaseHooks.createChangelogTitle.promise()).toBe("here");
    });
  });

  describe("onCreateLogParse", () => {
    test("should omitCommit", async () => {
      const plugins = new Exec({
        onCreateLogParse: { omitCommit: "echo true" },
      });
      const hooks = makeHooks();
      const logParsehooks = makeLogParseHooks();

      execSpy.mockReturnValueOnce("true");
      plugins.apply({ hooks } as Auto);
      hooks.onCreateLogParse.call({ hooks: logParsehooks } as any);

      expect(
        await logParsehooks.omitCommit.promise({
          hash: "123",
          subject: "test",
          authors: [],
          files: [],
          labels: [],
        })
      ).toBe(true);
    });

    test("should not omitCommit", async () => {
      const plugins = new Exec({
        onCreateLogParse: { omitCommit: "echo" },
      });
      const hooks = makeHooks();
      const logParsehooks = makeLogParseHooks();

      plugins.apply({ hooks } as Auto);
      hooks.onCreateLogParse.call({ hooks: logParsehooks } as any);

      expect(
        await logParsehooks.omitCommit.promise({
          hash: "123",
          subject: "test",
          authors: [],
          files: [],
          labels: [],
        })
      ).toBeUndefined();
    });
  });

  describe("onCreateChangelog", () => {
    test("should omitReleaseNotes", async () => {
      const plugins = new Exec({
        onCreateChangelog: { omitReleaseNotes: "echo true" },
      });
      const hooks = makeHooks();
      const changelogHooks = makeChangelogHooks();

      execSpy.mockReturnValueOnce("true");
      plugins.apply({ hooks } as Auto);
      hooks.onCreateChangelog.call(
        { hooks: changelogHooks } as any,
        SEMVER.patch
      );

      expect(
        await changelogHooks.omitReleaseNotes.promise({
          hash: "123",
          subject: "test",
          authors: [],
          files: [],
          labels: [],
        })
      ).toBe(true);
    });
  });
});
