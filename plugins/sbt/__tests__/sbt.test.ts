import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import SbtPlugin, { ISbtPluginOptions, sbtClient } from "../src";

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
  });
});
