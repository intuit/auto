import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import * as utilities from "../src/utilities";
import PlistPlugin, {
  IPlistPluginOptions,
  getVersion,
  updatePlistVersion,
} from "../src";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const plistWithVersion = (version: string, buildNumber?: string) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleShortVersionString</key>
	<string>${version}</string>
	<key>CFBundleVersion</key>
	<string>${buildNumber ?? version}</string>
</dict>
</plist>`;

const plistWithCustomKey = (version: string) => `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
	<key>LibraryVersion</key>
	<string>${version}</string>
</dict>
</plist>`;

const mockPlist = (contents: string) =>
  jest.spyOn(utilities, "getPlistContents").mockReturnValue(contents);

interface FakePlist {
  path: string;
  contents: string;
}
const mockPlists = (plists: FakePlist[]) =>
  jest
    .spyOn(utilities, "getPlistContents")
    .mockImplementation(
      (p) => plists.find((f) => f.path === p)!.contents
    );

let exec = jest.fn();
// @ts-ignore
jest.mock("../../../packages/core/dist/utils/exec-promise", () => (...args) =>
  exec(...args)
);

const logger = dummyLog();

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Plist Plugin", () => {
  let hooks: Auto.IAutoHooks;
  let multiHooks: Auto.IAutoHooks;

  const prefixRelease = (version: string) => `v${version}`;

  const options: IPlistPluginOptions = {
    plistPath: "./Info.plist",
  };

  const multiOptions: IPlistPluginOptions = {
    plistPath: ["./Info.plist", "./Framework/Info.plist"],
  };

  beforeEach(() => {
    jest.resetAllMocks();
    exec.mockClear();

    const plugin = new PlistPlugin(options);
    const multiPlugin = new PlistPlugin(multiOptions);
    hooks = makeHooks();
    multiHooks = makeHooks();

    const apply = (p: PlistPlugin, h: Auto.IAutoHooks) => {
      p.apply({
        hooks: h,
        logger,
        prefixRelease,
        config: { prereleaseBranches: ["next"] },
        git: {
          getLastTagNotInBaseBranch: async () => undefined,
          getLatestRelease: async () => "0.0.1",
        },
        remote: "https://github.com/intuit/auto.git",
        baseBranch: "main",
        getCurrentVersion: async () => "0.0.1",
      } as unknown as Auto.Auto);
    };

    apply(plugin, hooks);
    apply(multiPlugin, multiHooks);
  });

  // -------------------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------------------

  describe("getVersion", () => {
    test("should return the version for the default key", () => {
      mockPlist(plistWithVersion("1.2.3"));
      expect(getVersion("./Info.plist", "CFBundleShortVersionString")).toBe("1.2.3");
    });

    test("should return a canary version string", () => {
      mockPlist(plistWithVersion("1.2.3-canary.1.0.0"));
      expect(
        getVersion("./Info.plist", "CFBundleShortVersionString")
      ).toBe("1.2.3-canary.1.0.0");
    });

    test("should return the version for a custom key", () => {
      mockPlist(plistWithCustomKey("2.0.0"));
      expect(getVersion("./Info.plist", "LibraryVersion")).toBe("2.0.0");
    });

    test("should throw when the key is not found", () => {
      mockPlist(plistWithVersion("1.0.0"));
      expect(() =>
        getVersion("./Info.plist", "NonExistentKey")
      ).toThrow('Version key "NonExistentKey" not found in plist: ./Info.plist');
    });
  });

  describe("updatePlistVersion", () => {
    test("should write the bumped version to the plist", () => {
      mockPlist(plistWithVersion("1.0.0"));
      const writeMock = jest.spyOn(utilities, "writePlistContents");

      updatePlistVersion("./Info.plist", "1.0.1", "CFBundleShortVersionString");

      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("1.0.1", "1.0.0")
      );
    });

    test("should update both versionKey and buildNumberKey when provided", () => {
      mockPlist(plistWithVersion("1.0.0"));
      const writeMock = jest.spyOn(utilities, "writePlistContents");

      updatePlistVersion(
        "./Info.plist",
        "1.0.1",
        "CFBundleShortVersionString",
        "CFBundleVersion"
      );

      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("1.0.1", "1.0.1")
      );
    });

    test("should throw when the version key is missing from the file", () => {
      mockPlist(plistWithCustomKey("1.0.0"));

      expect(() =>
        updatePlistVersion("./Info.plist", "1.0.1", "CFBundleShortVersionString")
      ).toThrow('Could not update key "CFBundleShortVersionString" in plist: ./Info.plist');
    });
  });

  // -------------------------------------------------------------------------
  // validateConfig hook
  // -------------------------------------------------------------------------

  describe("validateConfig hook", () => {
    test("should fail validation when plistPath is missing", async () => {
      const errors = (await hooks.validateConfig.promise("plist", {})) ?? [];
      expect(errors.length).toBeGreaterThan(0);
    });

    test("should pass validation with a single plistPath", async () => {
      const errors =
        (await hooks.validateConfig.promise("plist", options)) ?? [];
      expect(errors).toHaveLength(0);
    });

    test("should pass validation with an array of plistPaths", async () => {
      const errors =
        (await hooks.validateConfig.promise("plist", multiOptions)) ?? [];
      expect(errors).toHaveLength(0);
    });

    test("should pass validation with all optional fields", async () => {
      const errors =
        (await hooks.validateConfig.promise("plist", {
          plistPath: "./Info.plist",
          versionKey: "LibraryVersion",
          buildNumberKey: "CFBundleVersion",
          publishScript: "./scripts/publish.sh",
        })) ?? [];
      expect(errors).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // modifyConfig hook
  // -------------------------------------------------------------------------

  describe("modifyConfig hook", () => {
    test("should set noVersionPrefix to true", async () => {
      const config = await hooks.modifyConfig.promise({} as any);
      expect(config).toStrictEqual({ noVersionPrefix: true });
    });
  });

  // -------------------------------------------------------------------------
  // getPreviousVersion hook
  // -------------------------------------------------------------------------

  describe("getPreviousVersion hook", () => {
    test("should return the version from the plist prefixed with v", async () => {
      mockPlist(plistWithVersion("1.2.3"));
      expect(await hooks.getPreviousVersion.promise()).toBe("v1.2.3");
    });

    test("should throw when the version key is missing", async () => {
      mockPlist("<plist><dict></dict></plist>");
      await expect(hooks.getPreviousVersion.promise()).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // version hook
  // -------------------------------------------------------------------------

  describe("version hook", () => {
    test("should log and skip git commands on dryRun", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      const mockLog = jest.spyOn(logger.log, "info");

      await hooks.version.promise({ bump: Auto.SEMVER.patch, dryRun: true });

      expect(exec).toHaveBeenCalledTimes(0);
      expect(mockLog).toHaveBeenCalledTimes(1);
    });

    test("should print to stdout on quiet dryRun", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      const mockLog = jest.spyOn(logger.log, "info");
      const mockConsole = jest.spyOn(console, "log");

      await hooks.version.promise({
        bump: Auto.SEMVER.patch,
        dryRun: true,
        quiet: true,
      });

      expect(exec).toHaveBeenCalledTimes(0);
      expect(mockLog).toHaveBeenCalledTimes(0);
      expect(mockConsole).toHaveBeenCalledTimes(1);
    });

    test("should bump patch version", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      const writeMock = jest.spyOn(utilities, "writePlistContents");

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("0.0.2", "0.0.1")
      );
    });

    test("should bump minor version", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      const writeMock = jest.spyOn(utilities, "writePlistContents");

      await hooks.version.promise({ bump: Auto.SEMVER.minor });

      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("0.1.0", "0.0.1")
      );
    });

    test("should bump major version", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      const writeMock = jest.spyOn(utilities, "writePlistContents");

      await hooks.version.promise({ bump: Auto.SEMVER.major });

      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("1.0.0", "0.0.1")
      );
    });

    test("should also update buildNumberKey when configured", async () => {
      const plugin = new PlistPlugin({
        plistPath: "./Info.plist",
        buildNumberKey: "CFBundleVersion",
      });
      const h = makeHooks();
      plugin.apply({
        hooks: h,
        logger,
        prefixRelease,
        config: { prereleaseBranches: ["next"] },
        git: {
          getLastTagNotInBaseBranch: async () => undefined,
          getLatestRelease: async () => "0.0.1",
        },
        remote: "https://github.com/intuit/auto.git",
        baseBranch: "main",
        getCurrentVersion: async () => "0.0.1",
      } as unknown as Auto.Auto);

      mockPlist(plistWithVersion("0.0.1"));
      const writeMock = jest.spyOn(utilities, "writePlistContents");

      await h.version.promise({ bump: Auto.SEMVER.patch });

      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("0.0.2", "0.0.2")
      );
    });

    test("should update all plists when multiple paths are configured", async () => {
      mockPlists([
        { path: "./Info.plist", contents: plistWithVersion("0.0.1") },
        { path: "./Framework/Info.plist", contents: plistWithVersion("0.0.1") },
      ]);
      const writeMock = jest.spyOn(utilities, "writePlistContents");

      await multiHooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(writeMock).toHaveBeenCalledTimes(2);
      expect(writeMock).toHaveBeenNthCalledWith(
        1,
        "./Info.plist",
        plistWithVersion("0.0.2", "0.0.1")
      );
      expect(writeMock).toHaveBeenNthCalledWith(
        2,
        "./Framework/Info.plist",
        plistWithVersion("0.0.2", "0.0.1")
      );
    });

    test("should create a commit and a tag", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      jest.spyOn(utilities, "writePlistContents").mockImplementation(() => {});

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toHaveBeenCalledWith("git", [
        "commit",
        "-am",
        '"update version: 0.0.2 [skip ci]"',
        "--no-verify",
      ]);
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "0.0.2",
        "-m",
        '"Update version to 0.0.2"',
      ]);
    });
  });

  // -------------------------------------------------------------------------
  // canary hook
  // -------------------------------------------------------------------------

  describe("canary hook", () => {
    test("should log and skip on dryRun", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      const mockLog = jest.spyOn(logger.log, "info");

      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "canary.1.0",
        dryRun: true,
      });

      expect(exec).toHaveBeenCalledTimes(0);
      expect(mockLog).toHaveBeenCalledTimes(1);
    });

    test("should print to stdout on quiet dryRun", async () => {
      mockPlist(plistWithVersion("0.0.1"));
      const mockConsole = jest.spyOn(console, "log");
      const mockLog = jest.spyOn(logger.log, "info");

      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "canary.1.0",
        dryRun: true,
        quiet: true,
      });

      expect(exec).toHaveBeenCalledTimes(0);
      expect(mockLog).toHaveBeenCalledTimes(0);
      expect(mockConsole).toHaveBeenCalledTimes(1);
    });

    test("should write canary version and reset the file", async () => {
      let contents = plistWithVersion("0.0.1");
      jest
        .spyOn(utilities, "getPlistContents")
        .mockImplementation(() => contents);
      const writeMock = jest
        .spyOn(utilities, "writePlistContents")
        .mockImplementation((_, c) => {
          contents = c;
        });

      const result = await hooks.canary.promise({
        bump: Auto.SEMVER.minor,
        canaryIdentifier: "canary.1.2.3",
      });

      expect(result).toBe("0.1.0-canary.1.2.3");
      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("0.1.0-canary.1.2.3", "0.0.1")
      );
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Info.plist"]);
    });

    test("should reset all plists when multiple paths are configured", async () => {
      const plists: Record<string, string> = {
        "./Info.plist": plistWithVersion("0.0.1"),
        "./Framework/Info.plist": plistWithVersion("0.0.1"),
      };
      jest
        .spyOn(utilities, "getPlistContents")
        .mockImplementation((p) => plists[p]);
      jest
        .spyOn(utilities, "writePlistContents")
        .mockImplementation((p, c) => {
          plists[p] = c;
        });

      await multiHooks.canary.promise({
        bump: Auto.SEMVER.minor,
        canaryIdentifier: "canary.1.2.3",
      });

      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Info.plist"]);
      expect(exec).toHaveBeenCalledWith("git", [
        "checkout",
        "./Framework/Info.plist",
      ]);
    });

    test("should call publishScript when configured", async () => {
      const plugin = new PlistPlugin({
        plistPath: "./Info.plist",
        publishScript: "./scripts/publish.sh",
      });
      const h = makeHooks();
      plugin.apply({
        hooks: h,
        logger,
        prefixRelease,
        config: { prereleaseBranches: ["next"] },
        git: {
          getLastTagNotInBaseBranch: async () => undefined,
          getLatestRelease: async () => "0.0.1",
        },
        remote: "https://github.com/intuit/auto.git",
        baseBranch: "main",
        getCurrentVersion: async () => "0.0.1",
      } as unknown as Auto.Auto);

      mockPlist(plistWithVersion("0.0.1"));
      jest.spyOn(utilities, "writePlistContents").mockImplementation(() => {});

      await h.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "canary.1.0",
      });

      expect(exec).toHaveBeenCalledWith("./scripts/publish.sh", ["canary"]);
    });
  });

  // -------------------------------------------------------------------------
  // next hook
  // -------------------------------------------------------------------------

  describe("next hook", () => {
    test("should return pre-release versions on dryRun", async () => {
      mockPlist(plistWithVersion("0.0.1"));

      const versions = await hooks.next.promise(["0.0.1"], {
        bump: Auto.SEMVER.minor,
        dryRun: true,
        commits: [],
        fullReleaseNotes: "",
        releaseNotes: "",
      });

      expect(versions).toContain("0.1.0-next.0");
      expect(exec).toHaveBeenCalledTimes(0);
    });

    test("should tag and push next version then reset plist", async () => {
      jest.spyOn(Auto, "getCurrentBranch").mockReturnValue("next");
      let contents = plistWithVersion("0.0.1");
      jest
        .spyOn(utilities, "getPlistContents")
        .mockImplementation(() => contents);
      const writeMock = jest
        .spyOn(utilities, "writePlistContents")
        .mockImplementation((_, c) => {
          contents = c;
        });

      const versions = await hooks.next.promise([], {
        bump: Auto.SEMVER.major,
        dryRun: false,
        commits: [],
        fullReleaseNotes: "",
        releaseNotes: "",
      });

      expect(versions).toContain("1.0.0-next.0");
      expect(writeMock).toHaveBeenLastCalledWith(
        expect.any(String),
        plistWithVersion("1.0.0-next.0", "0.0.1")
      );
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Info.plist"]);
      expect(exec).toHaveBeenCalledWith("git", [
        "tag",
        "1.0.0-next.0",
        "-m",
        '"Tag pre-release: 1.0.0-next.0"',
      ]);
    });
  });

  // -------------------------------------------------------------------------
  // publish hook
  // -------------------------------------------------------------------------

  describe("publish hook", () => {
    test("should push tags to remote", async () => {
      jest.spyOn(Auto, "getCurrentBranch").mockReturnValue("main");

      await hooks.publish.promise();

      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "--atomic",
        "--follow-tags",
        "--set-upstream",
        "https://github.com/intuit/auto.git",
        "main",
      ]);
    });

    test("should call publishScript before pushing when configured", async () => {
      jest.spyOn(Auto, "getCurrentBranch").mockReturnValue("main");

      const plugin = new PlistPlugin({
        plistPath: "./Info.plist",
        publishScript: "./scripts/publish.sh",
      });
      const h = makeHooks();
      plugin.apply({
        hooks: h,
        logger,
        prefixRelease,
        config: { prereleaseBranches: ["next"] },
        git: {
          getLastTagNotInBaseBranch: async () => undefined,
          getLatestRelease: async () => "0.0.1",
        },
        remote: "https://github.com/intuit/auto.git",
        baseBranch: "main",
        getCurrentVersion: async () => "0.0.1",
      } as unknown as Auto.Auto);

      await h.publish.promise();

      expect(exec).toHaveBeenCalledWith("./scripts/publish.sh", ["release"]);
      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "--atomic",
        "--follow-tags",
        "--set-upstream",
        "https://github.com/intuit/auto.git",
        "main",
      ]);
    });
  });
});
