import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import SbtPlugin, { ISbtPluginOptions, sbtClient, sbtGetVersion } from "../src";

const exec = jest.fn();

jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args),
);

const rawOutput =
  `[[0minfo[0m] entering *experimental* thin client - BEEP WHIRR
[[0minfo[0m] terminate the server with \`shutdown\`
> print version
1.2.3[0J
[0J[[32msuccess[0m] Total time: 2 s, completed Apr 27, 2021 3:39:23 AM
[0J`;

const cleanedOutput = `1.2.3
[success] Total time: 2 s, completed Apr 27, 2021 3:39:23 AM`;

const rawAggregationOutput =
  `[[0minfo[0m] entering *experimental* thin client - BEEP WHIRR
[[0minfo[0m] terminate the server with \`shutdown\`
> set version/aggregate := false
[info] Defining version / aggregate[0J
[0J[info] The new value will be used by no settings or tasks.[0J
[0J[info] Reapplying settings...[0J
[0J[info] set current project to auto-release-test-scala (in build file:/Users/user/project/)[0J
[0J[[32msuccess[0m] Total time: 2 s, completed Apr 27, 2021 3:52:04 AM
[0Jv`;

describe("sbt plugin", () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    (version) => `v${version}`,
  );
  const options: ISbtPluginOptions = {};
  const logger = dummyLog();

  const setup = (options: ISbtPluginOptions) => {
    const plugin = new SbtPlugin(options);
    hooks = makeHooks();
    plugin.apply(
      ({
        hooks,
        logger,
        remote: "stubRemote",
        prefixRelease,
        git: {
          getLastTagNotInBaseBranch: async () => undefined,
          getLatestRelease: async () => "0.0.1",
        },
        getCurrentVersion: async () => "0.0.1",
      } as unknown) as Auto.Auto,
    );
  };

  beforeEach(() => {
    exec.mockClear();
    setup(options);
  });

  describe("sbt client", () => {
    test("should clean output", async () => {
      exec.mockReturnValueOnce(rawOutput);
      const output = await sbtClient("");
      expect(output).toBe(cleanedOutput);
    });

    test("should parse version value", async () => {
      exec
        .mockReturnValueOnce(rawAggregationOutput)
        .mockReturnValueOnce(rawOutput);
      const output = await sbtGetVersion();
      expect(output).toBe("1.2.3");
    });

    test("should error if it can't parse version value", async () => {
      exec
        .mockReturnValueOnce(rawAggregationOutput)
        .mockReturnValueOnce("");
      await expect(sbtGetVersion()).rejects.toThrowError(
        `Failed to read version from sbt: `,
      );
    });
  });

  describe("version hook", () => {
    test("should set version in sbt", async () => {
      exec.mockReturnValue("");

      await hooks.version.promise({
        bump: Auto.SEMVER.minor,
      });
      expect(exec).toHaveBeenCalledTimes(2);
      expect(exec).lastCalledWith("sbt", [
        "--client",
        'set ThisBuild / version := \\"0.1.0\\"',
      ]);
    });
  });

  describe("publish hook", () => {
    test("should call sbt publish", async () => {
      exec.mockReturnValue("");

      await hooks.publish.promise({
        bump: Auto.SEMVER.minor,
      });

      expect(exec).toHaveBeenCalledWith("sbt", [
        "--client",
        "publish",
      ]);
    });

    test("should call sbt publish with custom command", async () => {
      setup({
        publishCommand: "+publishLocal",
      });
      exec.mockReturnValue("");

      await hooks.publish.promise({
        bump: Auto.SEMVER.minor,
      });

      expect(exec).toHaveBeenCalledWith("sbt", [
        "--client",
        "+publishLocal",
      ]);
    });
  });

  describe("canary hook", () => {
    test("should only read version from sbt on dry run", async () => {
      exec
        .mockReturnValueOnce(rawAggregationOutput)
        .mockReturnValueOnce(rawOutput);

      await hooks.canary.promise({
        bump: Auto.SEMVER.minor,
        canaryIdentifier: "-canary.42.1",
        dryRun: true,
      });

      expect(exec).toHaveBeenCalledTimes(2); // 2 calls in sbtGetVersion
    });

    test("should return version from sbt as canary", async () => {
      exec.mockReturnValue(rawOutput);

      const result = await hooks.canary.promise({
        bump: Auto.SEMVER.minor,
        canaryIdentifier: "-canary.42.1",
      });

      expect(exec).not.toHaveBeenCalledWith("sbt", [
        "--client",
        'set ThisBuild / version := \\"0.1.0\\"',
      ]);

      expect(result).toMatchObject({
        newVersion: "1.2.3",
        details: [
          "```",
          cleanedOutput,
          "```",
        ].join("\n"),
      });
    });

    test("should construct canary version when configured", async () => {
      setup({
        setCanaryVersion: true,
      });
      exec.mockReturnValue(rawOutput);

      const result = await hooks.canary.promise({
        bump: Auto.SEMVER.minor,
        canaryIdentifier: "-canary.42.1",
      });

      const newVersion = "0.0.0-canary.42.1-SNAPSHOT";

      expect(exec).toHaveBeenCalledWith("sbt", [
        "--client",
        `set ThisBuild / version := \\"${newVersion}\\"`,
      ]);

      expect(result).toMatchObject({ newVersion });
    });

    test("should call sbt publish with custom command", async () => {
      setup({
        publishCommand: "+publishLocal",
      });
      exec.mockReturnValue(rawOutput);

      await hooks.canary.promise({
        bump: Auto.SEMVER.minor,
        canaryIdentifier: "-canary.42.1",
      });

      expect(exec).toHaveBeenCalledWith("sbt", [
        "--client",
        "+publishLocal",
      ]);
    });
  });
});
