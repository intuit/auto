import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import SbtPlugin, {
  ISbtPluginOptions,
  sbtClient,
  sbtGetVersion,
  sbtPublish,
  sbtSetVersion,
} from "../src";

// const sbt = jest.fn();
const exec = jest.fn();

// @ts-ignore
// sbtClient.mockImplementation(sbt);

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

describe("sbt Plugin", () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    (version) => `v${version}`,
  );
  const options: ISbtPluginOptions = {};
  const logger = dummyLog();

  beforeEach(() => {
    exec.mockClear();
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
});
