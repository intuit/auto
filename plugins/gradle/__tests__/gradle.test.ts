import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import GradleReleasePlugin, {
  IGradleReleasePluginPluginOptions,
  getProperties,
} from "../src";

const exec = jest.fn();

jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args)
);

describe("Gradle Plugin", () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    (version) => `v${version}`
  );
  const options: IGradleReleasePluginPluginOptions = {};

  beforeEach(() => {
    exec.mockClear();
    const plugin = new GradleReleasePlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog(), prefixRelease } as Auto.Auto);
  });

  describe("getPreviousVersion", () => {
    test("should get previous version from gradle properties", async () => {
      exec.mockReturnValueOnce("version: 1.0.0");
      expect(await hooks.getPreviousVersion.promise()).toBe("v1.0.0");
    });

    test("should get previous version snapshot from gradle properties", async () => {
      exec.mockReturnValueOnce("version: 1.0.0-SNAPSHOT");
      expect(await hooks.getPreviousVersion.promise()).toBe("v1.0.0");
    });
  });

  describe("beforeRun & version", () => {
    test("should version release - patch version", async () => {
      const properties = "version: 1.0.0";
      exec.mockReturnValueOnce(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      exec.mockReturnValueOnce(properties).mockImplementation(spy);

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(spy).toHaveBeenCalledWith(expect.stringMatching("gradle"), [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=1.0.1`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
      ]);
    });

    test("should version release - major version", async () => {
      const properties = "version: 1.0.0";
      exec.mockReturnValueOnce(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      exec.mockReturnValueOnce(properties).mockImplementation(spy);

      await hooks.version.promise({ bump: Auto.SEMVER.major });

      expect(spy).toHaveBeenCalledWith(expect.stringMatching("gradle"), [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=2.0.0`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
      ]);
    });

    test("should version release - major version - w/build", async () => {
      const properties = `version: 1.0.0`;

      exec.mockReturnValueOnce(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      exec.mockReturnValueOnce(properties).mockImplementation(spy);

      await hooks.version.promise({ bump: Auto.SEMVER.major });

      expect(spy).toHaveBeenCalledWith(expect.stringMatching("gradle"), [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=2.0.0`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
      ]);
    });

    test("should version release - minor version", async () => {
      const properties = "version: 1.1.0";
      exec.mockReturnValueOnce(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      exec.mockReturnValueOnce(properties).mockImplementation(spy);

      await hooks.version.promise({ bump: Auto.SEMVER.minor });

      expect(spy).toHaveBeenCalledWith(expect.stringMatching("gradle"), [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=1.2.0`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
      ]);
    });

    test("should version release - patch w/ default snapshot", async () => {
      const properties = "version: 1.0.0-SNAPSHOT";
      exec.mockReturnValueOnce(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      exec.mockReturnValueOnce(properties).mockImplementation(spy);

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(spy).toHaveBeenCalledWith(expect.stringMatching("gradle"), [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=1.0.0`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
      ]);
    });

    test("should version release - patch w/ custom snapshot", async () => {
      const properties = `
      version: 1.0.0.SNAP
      snapshotSuffix: .SNAP
      `;

      exec.mockReturnValueOnce(properties);
      await hooks.beforeRun.promise({} as any);

      const spy = jest.fn();
      exec.mockReturnValueOnce(properties).mockImplementation(spy);

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(spy).toHaveBeenCalledWith(expect.stringMatching("gradle"), [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=1.0.0`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
      ]);
    });
  });
});

describe("Gradle Plugin - Custom Command", () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    (version) => `v${version}`
  );
  const options: IGradleReleasePluginPluginOptions = {
    gradleCommand: "./gradlew",
    gradleOptions: ["-P prop=val"],
  };

  beforeEach(() => {
    const plugin = new GradleReleasePlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog(), prefixRelease } as Auto.Auto);
  });

  describe("version", () => {
    test("should version release - patch version - with custom gradle command", async () => {
      const spy = jest.fn();
      exec.mockReturnValueOnce("version: 1.0.0").mockImplementation(spy);

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(spy).toHaveBeenCalledWith(expect.stringMatching("gradlew"), [
        "release",
        "-Prelease.useAutomaticVersion=true",
        `-Prelease.newVersion=1.0.1`,
        "-x createReleaseTag",
        "-x preTagCommit",
        "-x commitNewVersion",
        "-P prop=val",
      ]);
    });
  });
});

describe("getProperties", () => {
  test("should read properties from file", async () => {
    exec.mockReturnValueOnce(`
      version: 1.0.0
      snapshotSuffix: :SNAPSHOT
    `);
    expect(await getProperties("", [])).toStrictEqual({
      version: "1.0.0",
      snapshotSuffix: ":SNAPSHOT",
    });
  });

  test("should read properties from file with options", async () => {
    exec.mockResolvedValueOnce("version: 1.0.0");

    expect(await getProperties("gradle", ["-someOpt"])).toStrictEqual({
      version: "1.0.0",
    });
    expect(exec).toHaveBeenCalledWith(expect.stringMatching("gradle"), [
      "-q",
      "properties",
      "-someOpt",
    ]);
  });

  test("should read nothing from empty file", async () => {
    exec.mockReturnValueOnce("");
    expect(await getProperties("", [])).toStrictEqual({});
  });
});
