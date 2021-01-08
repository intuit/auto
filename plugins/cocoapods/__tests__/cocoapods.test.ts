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

let exec = jest.fn();
// @ts-ignore
jest.mock("../../../packages/core/dist/utils/exec-promise", () => (...args) =>
  exec(...args)
);

describe("Cocoapods Plugin", () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = (version: string) => {
    return `v${version}`;
  };

  const options: ICocoapodsPluginOptions = {
    podspecPath: "./Test.podspec",
  };

  beforeEach(() => {
    jest.resetAllMocks();
    exec.mockClear();
    const plugin = new CocoapodsPlugin(options);
    hooks = makeHooks();
    plugin.apply({
      hooks,
      logger: dummyLog(),
      prefixRelease,
    } as Auto.Auto);
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
  describe("modifyConfig hook", () => {
    test("should set noVersionPrefix to true", () => {
      const config = {};
      expect(hooks.modifyConfig.call(config as any)).toStrictEqual({
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
  });
  describe("version hook", () => {
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
      const plugin = new CocoapodsPlugin(options);
      const hook = makeHooks();
      plugin.apply(({
        hooks: hook,
        logger: dummyLog(),
        prefixRelease,
        git: {
          getLatestRelease: async () => "0.0.1",
          getPullRequest: async () => ({
            data: {
              head: {
                repo: {
                  clone_url: "https://github.com/intuit/auto.git",
                },
              },
            },
          }),
        },
        getCurrentVersion: async () => "0.0.1",
      } as unknown) as Auto.Auto);

      const newVersion = await hook.canary.promise({
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
