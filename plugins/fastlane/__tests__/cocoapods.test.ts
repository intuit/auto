import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import * as utilities from "../src/utilities";
import CocoapodsPlugin, {
  ICocoapodsPluginOptions,
  getParsedPodspecContents,
  getVersion,
  updatePodspecVersion,
  updateSourceLocation,
  getSourceInfo,
} from "../src";

const specWithVersion = (
  version: string,
  source = "{ :git => 'https://github.com/intuit/auto.git', :tag => s.version.to_s }"
) => `
      Pod:: Spec.new do | s |
        s.name             = 'Test'
        s.version = '${version}'
        s.summary = 'A short description of Test.'

      # This description is used to generate tags and improve search results.
      #   * Think: What does it do? Why did you write it ? What is the focus ?
      #   * Try to keep it short, snappy and to the point.
      #   * Write the description between the DESC delimiters below.
      #   * Finally, don't worry about the indent, CocoaPods strips it!

      s.description = << -DESC
      TODO: Add long description of the pod here.
        DESC

      s.homepage = 'https://github.com/intuit/auto'
      # s.screenshots = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
      s.license = { : type => 'MIT', : file => 'LICENSE' }
      s.author = { 'hborawski' => 'harris_borawski@intuit.com' }
      s.source = ${source}

      s.ios.deployment_target = '11.0'

      s.source_files = 'Test/Classes/**/*'


      # s.public_header_files = 'Pod/Classes/**/*.h'
      # s.frameworks = 'UIKit', 'MapKit'
      # s.dependency 'Alamofire'
      end
      `;

const mockPodspec = (contents: string) => {
  return jest.spyOn(utilities, "getPodspecContents").mockReturnValue(contents);
};

interface FakePodspec {
  path: string;
  contents: string;
}
const mockPodspecs = (contents: FakePodspec[]) => {
  return jest
    .spyOn(utilities, "getPodspecContents")
    .mockImplementation((path) => {
      return contents.find((podspec) => podspec.path === path).contents;
    });
};

let exec = jest.fn();
// @ts-ignore
jest.mock("../../../packages/core/dist/utils/exec-promise", () => (...args) =>
  exec(...args)
);
const logger = dummyLog();

describe("Cocoapods Plugin", () => {
  let hooks: Auto.IAutoHooks;
  let multiHooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = (version: string) => {
    return `v${version}`;
  };

  const options: ICocoapodsPluginOptions = {
    podspecPath: "./Test.podspec",
  };

  const multiOptions: ICocoapodsPluginOptions = {
    podspecPath: ["./Test.podspec", "./Test2.podspec"],
  };

  beforeEach(() => {
    jest.resetAllMocks();
    exec.mockClear();
    const plugin = new CocoapodsPlugin(options);
    const multiPlugin = new CocoapodsPlugin(multiOptions);
    hooks = makeHooks();
    multiHooks = makeHooks();
    const apply = (p: CocoapodsPlugin, h: Auto.IAutoHooks) => {
      p.apply(({
        hooks: h,
        logger: logger,
        prefixRelease,
        git: {
          getLastTagNotInBaseBranch: async () => undefined,
          getLatestRelease: async () => "0.0.1",
          getPullRequest: async () => ({
            data: {
              head: {
                repo: {
                  clone_url: "https://github.com/intuit-fork/auto.git",
                },
              },
            },
          }),
        },
        remote: "https://github.com/intuit/auto.git",
        getCurrentVersion: async () => "0.0.1",
      } as unknown) as Auto.Auto);
    };

    apply(plugin, hooks);
    apply(multiPlugin, multiHooks);
  });

  describe("getParsedPodspecContents", () => {
    test("should return null if contents cant be parsed with regex", () => {
      mockPodspec("bad podspec");

      expect(getParsedPodspecContents("./Test.podspec")).toBeNull();
    });
    test("should return parsed contents", () => {
      mockPodspec(specWithVersion("0.0.1"));
      const contents = getParsedPodspecContents("./Test.podspec");
      expect(contents).toHaveProperty("groups", { version: "0.0.1" });
    });
  });
  describe("getVersion", () => {
    test("should throw error if parsed podspec is returned as null", () => {
      mockPodspec("bad podspec");

      expect(() => getVersion("./Test.podspec")).toThrow();
    });
    test("should return version", () => {
      mockPodspec(specWithVersion("0.0.1"));

      expect(getVersion("./Test.podspec")).toBe("0.0.1");
    });
    test("should return canary version", () => {
      mockPodspec(specWithVersion("0.0.1-canary.1.0.0"));

      expect(getVersion("./Test.podspec")).toBe("0.0.1-canary.1.0.0");
    });
  });
  describe("getSourceInfo", () => {
    test("should throw error if source line cant be found", () => {
      mockPodspec(specWithVersion("0.0.1", "no source"));

      expect(() => getSourceInfo("./Test.podspec")).toThrow();
    });
    test("should retrieve source info", () => {
      mockPodspec(specWithVersion("0.0.1"));

      expect(getSourceInfo("./Test.podspec")).toBe(
        "{ :git => 'https://github.com/intuit/auto.git', :tag => s.version.to_s }"
      );
    });
  });
  describe("updatePodspecVersion", () => {
    test("should throw error if there is an error writing file", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementationOnce(() => {
          throw new Error("Filesystem Error");
        });

      expect(
        updatePodspecVersion.bind(null, "./Test.podspec", "0.0.2")
      ).toThrowError("Error updating version in podspec: ./Test.podspec");
    });
    test("should successfully write new version", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const mock = jest.spyOn(utilities, "writePodspecContents");

      await updatePodspecVersion("./Test.podspec", "0.0.2");
      expect(mock).lastCalledWith(expect.any(String), specWithVersion("0.0.2"));
    });
  });
  describe("updateSourceLocation", () => {
    test("should throw error if there is an error writing file", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      exec.mockReturnValue("commithash");

      jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementationOnce(() => {
          throw new Error("Filesystem Error");
        });

      await expect(
        updateSourceLocation(
          "./Test.podspec",
          "https://github.com/somefork/auto.git"
        )
      ).rejects.toThrowError(
        "Error updating source location in podspec: ./Test.podspec"
      );
    });
    test("should successfully write new source location", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const mock = jest.spyOn(utilities, "writePodspecContents");

      exec.mockReturnValue(Promise.resolve("commithash"));

      await updateSourceLocation(
        "./Test.podspec",
        "https://github.com/somefork/auto.git"
      );
      expect(mock).lastCalledWith(
        expect.any(String),
        specWithVersion(
          "0.0.1",
          "{ :git => 'https://github.com/somefork/auto.git', :commit => 'commithash' }"
        )
      );
    });
  });
  describe("validateConfig hook", () => {
    test("should validate options", async () => {
      expect(
        ((await hooks.validateConfig.promise("cocoapods", {})) || [])
      ).toHaveLength(1);
      expect(
        ((await hooks.validateConfig.promise("cocoapods", options)) || [])
          
      ).toHaveLength(0);
      expect(
        ((await hooks.validateConfig.promise("cocoapods", multiOptions)) || [])
          
      ).toHaveLength(0);
    });
  });
  describe("modifyConfig hook", () => {
    test("should set noVersionPrefix to true", async () => {
      const config = {};
      expect(await hooks.modifyConfig.promise(config as any)).toStrictEqual({
        noVersionPrefix: true,
      });
    });
  });
  describe("getPreviousVersion hook", () => {
    test("should get previous version from podspec", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      expect(await hooks.getPreviousVersion.promise()).toBe("v0.0.1");
    });

    test("should throw if no version found", async () => {
      mockPodspec(specWithVersion(""));

      await expect(hooks.getPreviousVersion.promise()).rejects.toThrowError(
        "Version could not be found in podspec: ./Test.podspec"
      );
    });

    test("should get version if multiple podspecs", async () => {
      mockPodspecs([
        {
          path: "./Test.podspec",
          contents: specWithVersion("0.0.1"),
        },
        {
          path: "./Test2.podspec",
          contents: specWithVersion("0.0.1"),
        },
      ]);
      expect(await multiHooks.getPreviousVersion.promise()).toBe("v0.0.1");
    });
  });
  describe("version hook", () => {
    test("should do nothing on dryRun", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const mockLog = jest.spyOn(logger.log, "info");

      await hooks.version.promise({ bump: Auto.SEMVER.patch, dryRun: true });

      expect(exec).toHaveBeenCalledTimes(0);
      expect(mockLog).toHaveBeenCalledTimes(1);
    });
    test("should not use logger on quiet dryRun", async () => {
      mockPodspec(specWithVersion("0.0.1"));

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
    test("should version release - patch version", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const mock = jest.spyOn(utilities, "writePodspecContents");

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(mock).lastCalledWith(expect.any(String), specWithVersion("0.0.2"));
    });
    test("should version release - minor version", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const mock = jest.spyOn(utilities, "writePodspecContents");

      await hooks.version.promise({ bump: Auto.SEMVER.minor });

      expect(mock).lastCalledWith(expect.any(String), specWithVersion("0.1.0"));
    });
    test("should version release - major version", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const mock = jest.spyOn(utilities, "writePodspecContents");

      await hooks.version.promise({ bump: Auto.SEMVER.major });

      expect(mock).lastCalledWith(expect.any(String), specWithVersion("1.0.0"));
    });
    test("should release version multiple podspecs - patch", async () => {
      mockPodspecs([
        {
          path: "./Test.podspec",
          contents: specWithVersion("0.0.1"),
        },
        {
          path: "./Test2.podspec",
          contents: specWithVersion("0.0.1"),
        },
      ]);
      const mock = jest.spyOn(utilities, "writePodspecContents");
      await multiHooks.version.promise({ bump: Auto.SEMVER.patch });
      expect(mock).toHaveBeenCalledTimes(2);
      expect(mock).toHaveBeenNthCalledWith(
        1,
        "./Test.podspec",
        specWithVersion("0.0.2")
      );
      expect(mock).toHaveBeenNthCalledWith(
        2,
        "./Test2.podspec",
        specWithVersion("0.0.2")
      );
    });
    test("should release version multiple podspecs - minor", async () => {
      mockPodspecs([
        {
          path: "./Test.podspec",
          contents: specWithVersion("0.0.1"),
        },
        {
          path: "./Test2.podspec",
          contents: specWithVersion("0.0.1"),
        },
      ]);
      const mock = jest.spyOn(utilities, "writePodspecContents");
      await multiHooks.version.promise({ bump: Auto.SEMVER.minor });
      expect(mock).toHaveBeenCalledTimes(2);
      expect(mock).toHaveBeenNthCalledWith(
        1,
        "./Test.podspec",
        specWithVersion("0.1.0")
      );
      expect(mock).toHaveBeenNthCalledWith(
        2,
        "./Test2.podspec",
        specWithVersion("0.1.0")
      );
    });
    test("should release version multiple podspecs - major", async () => {
      mockPodspecs([
        {
          path: "./Test.podspec",
          contents: specWithVersion("0.0.1"),
        },
        {
          path: "./Test2.podspec",
          contents: specWithVersion("0.0.1"),
        },
      ]);
      const mock = jest.spyOn(utilities, "writePodspecContents");
      await multiHooks.version.promise({ bump: Auto.SEMVER.major });
      expect(mock).toHaveBeenCalledTimes(2);
      expect(mock).toHaveBeenNthCalledWith(
        1,
        "./Test.podspec",
        specWithVersion("1.0.0")
      );
      expect(mock).toHaveBeenNthCalledWith(
        2,
        "./Test2.podspec",
        specWithVersion("1.0.0")
      );
    });
    test("should throw if there is an error writing new version", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const mock = jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementation((path, contents) => {
          if (contents.includes("1.0.0")) {
            throw new Error("Filesystem Error");
          }
        });

      await expect(
        hooks.version.promise({ bump: Auto.SEMVER.major })
      ).rejects.toThrowError(
        "Error updating version in podspec: ./Test.podspec"
      );

      expect(mock).lastCalledWith(expect.any(String), specWithVersion("1.0.0"));
    });
  });

  describe("beforeShipit hook", () => {
    test("should call pod lib lint with dryRun flag", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const plugin = new CocoapodsPlugin(options);
      const hook = makeHooks();

      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.beforeShipIt.promise({ releaseType: "latest", dryRun: true });

      expect(exec).toBeCalledTimes(1);
      expect(exec).lastCalledWith("pod", ["lib", "lint", "./Test.podspec"]);
    });
    test("should call pod lib lint for each podspec with dryRun flag", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const plugin = new CocoapodsPlugin(multiOptions);
      const hook = makeHooks();

      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.beforeShipIt.promise({ releaseType: "latest", dryRun: true });

      expect(exec).toBeCalledTimes(2);
      expect(exec).toHaveBeenNthCalledWith(1, "pod", [
        "lib",
        "lint",
        "./Test.podspec",
      ]);
      expect(exec).toHaveBeenNthCalledWith(2, "pod", [
        "lib",
        "lint",
        "./Test2.podspec",
      ]);
    });
    test("should call pod lib lint with options with dryRun flag", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const plugin = new CocoapodsPlugin({
        ...options,
        flags: ["--flag"],
        podCommand: "notpod",
      });
      const hook = makeHooks();

      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.beforeShipIt.promise({ releaseType: "latest", dryRun: true });

      expect(exec).toBeCalledTimes(1);
      expect(exec).lastCalledWith("notpod", [
        "lib",
        "lint",
        "--flag",
        "./Test.podspec",
      ]);
    });
  });

  describe("canary hook", () => {
    test("should do nothing on dryRun", async () => {
      mockPodspec(specWithVersion("0.0.1"));
      jest.spyOn(Auto, "getPrNumberFromEnv").mockReturnValue(1);

      const mockLog = jest.spyOn(logger.log, "info");

      await hooks.canary.promise({
        bump: Auto.SEMVER.patch,
        canaryIdentifier: "canary.1.0",
        dryRun: true,
      });

      expect(exec).toHaveBeenCalledTimes(0);
      expect(mockLog).toHaveBeenCalledTimes(1);
    });
    test("should not use logger on quiet dryRun", async () => {
      mockPodspec(specWithVersion("0.0.1"));
      jest.spyOn(Auto, "getPrNumberFromEnv").mockReturnValue(1);

      const mockLog = jest.spyOn(logger.log, "info");
      const mockConsole = jest.spyOn(console, "log");

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
    test("should tag with canary version", async () => {
      jest.spyOn(Auto, "getPrNumberFromEnv").mockReturnValue(1);
      let podSpec = specWithVersion("0.0.1");
      jest
        .spyOn(utilities, "getPodspecContents")
        .mockImplementation(() => podSpec);
      const mock = jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementation((path, contents) => {
          podSpec = contents;
        });

      const newVersion = await hooks.canary.promise({
        bump: "minor" as Auto.SEMVER,
        canaryIdentifier: "canary.1.1.1",
      });

      expect(newVersion).toBe("0.1.0-canary.1.1.1");
      expect(exec).toBeCalledTimes(3);
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Test.podspec"]);

      expect(mock).toHaveBeenLastCalledWith(
        expect.any(String),
        specWithVersion(
          "0.1.0-canary.1.1.1",
          "{ :git => 'https://github.com/intuit-fork/auto.git', :commit => 'undefined' }"
        )
      );
    });
    test("should tag multiple podspeccs with canary version", async () => {
      jest.spyOn(Auto, "getPrNumberFromEnv").mockReturnValue(1);
      const specs = {
        "./Test.podspec": specWithVersion("0.0.1"),
        "./Test2.podspec": specWithVersion("0.0.1"),
      };
      jest
        .spyOn(utilities, "getPodspecContents")
        .mockImplementation((path) => specs[path]);
      const mock = jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementation((path, contents) => {
          specs[path] = contents;
        });

      const newVersion = await multiHooks.canary.promise({
        bump: "minor" as Auto.SEMVER,
        canaryIdentifier: "canary.1.1.1",
      });

      expect(newVersion).toBe("0.1.0-canary.1.1.1");
      expect(exec).toBeCalledTimes(6);
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Test.podspec"]);
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Test2.podspec"]);
      expect(mock).toBeCalledTimes(4);
      expect(mock).toHaveBeenCalledWith(
        "./Test.podspec",
        specWithVersion(
          "0.1.0-canary.1.1.1",
          "{ :git => 'https://github.com/intuit-fork/auto.git', :commit => 'undefined' }"
        )
      );
      expect(mock).toHaveBeenCalledWith(
        "./Test2.podspec",
        specWithVersion(
          "0.1.0-canary.1.1.1",
          "{ :git => 'https://github.com/intuit-fork/auto.git', :commit => 'undefined' }"
        )
      );
    });
    test("should tag with canary version with no PR number", async () => {
      let podSpec = specWithVersion("0.0.1");
      jest
        .spyOn(utilities, "getPodspecContents")
        .mockImplementation(() => podSpec);
      const mock = jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementation((path, contents) => {
          podSpec = contents;
        });

      const newVersion = await hooks.canary.promise({
        bump: "minor" as Auto.SEMVER,
        canaryIdentifier: "canary.1.1.1",
      });

      expect(newVersion).toBe("0.1.0-canary.1.1.1");
      expect(exec).toBeCalledTimes(3);
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Test.podspec"]);

      expect(mock).toHaveBeenLastCalledWith(
        expect.any(String),
        specWithVersion(
          "0.1.0-canary.1.1.1",
          "{ :git => 'https://github.com/intuit/auto.git', :commit => 'undefined' }"
        )
      );
    });
  });

  describe("next hook", () => {
    test("should return prerelease versions on dryrun", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const versions = await hooks.next.promise(["0.0.1", "0.0.2"], {
        bump: Auto.SEMVER.minor,
        dryRun: true,
        commits: [],
        fullReleaseNotes: "",
        releaseNotes: "",
      });
      expect(versions).toStrictEqual(["0.0.1", "0.0.2", "0.1.0-next.0"]);
    });
    test("should tag with next version", async () => {
      jest.spyOn(Auto, "getCurrentBranch").mockReturnValue("next");
      const specs = {
        "./Test.podspec": specWithVersion("0.0.1"),
        "./Test2.podspec": specWithVersion("0.0.1"),
      };
      jest
        .spyOn(utilities, "getPodspecContents")
        .mockImplementation((path) => specs[path]);
      const mock = jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementation((path, contents) => {
          specs[path] = contents;
        });

      const versions = await multiHooks.next.promise([], {
        bump: Auto.SEMVER.major,
        dryRun: false,
        commits: [],
        fullReleaseNotes: "",
        releaseNotes: "",
      });

      expect(versions).toContain("1.0.0-next.0");
      expect(exec).toBeCalledTimes(6);
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Test.podspec"]);

      expect(mock).toBeCalledTimes(2);
      expect(mock).toHaveBeenCalledWith(
        "./Test.podspec",
        specWithVersion("1.0.0-next.0")
      );
      expect(mock).toHaveBeenCalledWith(
        "./Test2.podspec",
        specWithVersion("1.0.0-next.0")
      );
    });
    test("should tag with next version for multiple podspecs", async () => {
      jest.spyOn(Auto, "getCurrentBranch").mockReturnValue("next");
      let podSpec = specWithVersion("0.0.1");
      jest
        .spyOn(utilities, "getPodspecContents")
        .mockImplementation(() => podSpec);
      const mock = jest
        .spyOn(utilities, "writePodspecContents")
        .mockImplementation((path, contents) => {
          podSpec = contents;
        });

      const versions = await hooks.next.promise([], {
        bump: Auto.SEMVER.major,
        dryRun: false,
        commits: [],
        fullReleaseNotes: "",
        releaseNotes: "",
      });

      expect(versions).toContain("1.0.0-next.0");
      expect(exec).toBeCalledTimes(4);
      expect(exec).toHaveBeenCalledWith("git", ["checkout", "./Test.podspec"]);

      expect(mock).toHaveBeenLastCalledWith(
        expect.any(String),
        specWithVersion("1.0.0-next.0")
      );
    });
  });

  describe("publish hook", () => {
    test("should push to trunk if no specsRepo in options", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const plugin = new CocoapodsPlugin(options);
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(2);
      expect(exec).lastCalledWith("pod", ["trunk", "push", "./Test.podspec"]);
    });
    test("should push multiple podspecs to trunk if no specsRepo in options", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const plugin = new CocoapodsPlugin(multiOptions);
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(3);
      expect(exec).toHaveBeenCalledWith("pod", [
        "trunk",
        "push",
        "./Test.podspec",
      ]);
      expect(exec).toHaveBeenCalledWith("pod", [
        "trunk",
        "push",
        "./Test2.podspec",
      ]);
    });

    test("should push with different pod command if in options", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const plugin = new CocoapodsPlugin({ ...options, podCommand: "notpod" });
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(2);
      expect(exec).lastCalledWith("notpod", [
        "trunk",
        "push",
        "./Test.podspec",
      ]);
    });

    test("should push with different pod command with spaces if in options", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const plugin = new CocoapodsPlugin({
        ...options,
        podCommand: "bundle exec pod",
      });
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(2);
      expect(exec).lastCalledWith("bundle", [
        "exec",
        "pod",
        "trunk",
        "push",
        "./Test.podspec",
      ]);
    });

    test("should push to trunk if no specsRepo in options with flags", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const logger = dummyLog();
      logger.logLevel = "verbose";

      const plugin = new CocoapodsPlugin({
        ...options,
        flags: ["--sources", "someOtherSpecsRepo"],
      });
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger,
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(2);
      expect(exec).lastCalledWith("pod", [
        "trunk",
        "push",
        "--sources",
        "someOtherSpecsRepo",
        "./Test.podspec",
        "--verbose",
      ]);
    });

    test("should push to specs repo if specsRepo in options", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const logger = dummyLog();
      logger.logLevel = "quiet";

      const plugin = new CocoapodsPlugin({
        ...options,
        specsRepo: "someSpecsRepo",
      });
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger,
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(5);
      expect(exec).toHaveBeenNthCalledWith(2, "pod", ["repo", "list"]);
      expect(exec).toHaveBeenNthCalledWith(3, "pod", [
        "repo",
        "add",
        "autoPublishRepo",
        "someSpecsRepo",
        "--silent",
      ]);
      expect(exec).toHaveBeenNthCalledWith(4, "pod", [
        "repo",
        "push",
        "autoPublishRepo",
        "./Test.podspec",
        "--silent",
      ]);
      expect(exec).toHaveBeenNthCalledWith(5, "pod", [
        "repo",
        "remove",
        "autoPublishRepo",
        "--silent",
      ]);
    });
    test("should push multiple podspecs to specs repo if specsRepo in options", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const logger = dummyLog();
      logger.logLevel = "quiet";

      const plugin = new CocoapodsPlugin({
        ...multiOptions,
        specsRepo: "someSpecsRepo",
      });
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger,
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(6);
      expect(exec).toHaveBeenNthCalledWith(2, "pod", ["repo", "list"]);
      expect(exec).toHaveBeenNthCalledWith(3, "pod", [
        "repo",
        "add",
        "autoPublishRepo",
        "someSpecsRepo",
        "--silent",
      ]);
      expect(exec).toHaveBeenNthCalledWith(4, "pod", [
        "repo",
        "push",
        "autoPublishRepo",
        "./Test.podspec",
        "--silent",
      ]);
      expect(exec).toHaveBeenNthCalledWith(5, "pod", [
        "repo",
        "push",
        "autoPublishRepo",
        "./Test2.podspec",
        "--silent",
      ]);
      expect(exec).toHaveBeenNthCalledWith(6, "pod", [
        "repo",
        "remove",
        "autoPublishRepo",
        "--silent",
      ]);
    });

    test("should push to specs repo if specsRepo in options with flags", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      const logger = dummyLog();
      logger.logLevel = "veryVerbose";

      const plugin = new CocoapodsPlugin({
        ...options,
        specsRepo: "someSpecsRepo",
        flags: ["--sources", "someOtherSpecsRepo"],
      });
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger,
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(5);
      expect(exec).toHaveBeenNthCalledWith(2, "pod", ["repo", "list"]);
      expect(exec).toHaveBeenNthCalledWith(3, "pod", [
        "repo",
        "add",
        "autoPublishRepo",
        "someSpecsRepo",
        "--verbose",
      ]);
      expect(exec).toHaveBeenNthCalledWith(4, "pod", [
        "repo",
        "push",
        "--sources",
        "someOtherSpecsRepo",
        "autoPublishRepo",
        "./Test.podspec",
        "--verbose",
      ]);
      expect(exec).toHaveBeenNthCalledWith(5, "pod", [
        "repo",
        "remove",
        "autoPublishRepo",
        "--verbose",
      ]);
    });

    test("should delete autoPublishRepo if it exists and push to specs repo if specsRepo in options", async () => {
      mockPodspec(specWithVersion("0.0.1"));

      exec = jest.fn().mockImplementation((...args) => {
        if (args[1]?.[1] === "list") {
          return `
autoPublishRepo
- Type: git (master)
- URL:  someSpecsRepo
- Path: /Users/someUser/.cocoapods/repos/autoPublishRepo

master
- Type: git (master)
- URL:  https://github.com/CocoaPods/Specs.git
- Path: /Users/someUser/.cocoapods/repos/master

trunk
- Type: CDN
- URL:  https://cdn.cocoapods.org/
- Path: /Users/someUser/.cocoapods/repos/trunk
          `;
        }
      });

      const plugin = new CocoapodsPlugin({
        ...options,
        specsRepo: "someSpecsRepo",
      });
      const hook = makeHooks();
      plugin.apply({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
      } as Auto.Auto);

      await hook.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toBeCalledTimes(6);
      expect(exec).toHaveBeenNthCalledWith(2, "pod", ["repo", "list"]);
      expect(exec).toHaveBeenNthCalledWith(3, "pod", [
        "repo",
        "remove",
        "autoPublishRepo",
      ]);
      expect(exec).toHaveBeenNthCalledWith(4, "pod", [
        "repo",
        "add",
        "autoPublishRepo",
        "someSpecsRepo",
      ]);
      expect(exec).toHaveBeenNthCalledWith(5, "pod", [
        "repo",
        "push",
        "autoPublishRepo",
        "./Test.podspec",
      ]);
      expect(exec).toHaveBeenNthCalledWith(6, "pod", [
        "repo",
        "remove",
        "autoPublishRepo",
      ]);
    });
  });
});
