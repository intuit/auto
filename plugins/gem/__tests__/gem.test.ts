import glob from "fast-glob";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { execSync } from "child_process";
import { when } from 'jest-when';

import * as utils from "../src/utils";
import Gem from "../src";
import endent from "endent";
import { SEMVER } from "@auto-it/core";

const logger = dummyLog();

const execSyncSpy = jest.fn();
jest.mock("child_process");
// @ts-ignore
execSync.mockImplementation(execSyncSpy);

const execSpy = jest.fn();
execSpy.mockReturnValue("");

// @ts-ignore
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => execSpy(...args)
);

const globSpy = jest.fn();
jest.mock("fast-glob");
glob.sync = globSpy;

const readFile = jest.fn();
const writeFile = jest.fn();
jest.mock("../src/utils");
// @ts-ignore
utils.readFile = readFile as any;
// @ts-ignore
utils.writeFile = writeFile as any;

describe("Gem Plugin", () => {
  beforeEach(() => {
    globSpy.mockReset();
    readFile.mockReset();
  });

  test("throws without a gemspec", async () => {
    expect(() => new Gem()).toThrow();
  });

  test("loads with a gemspec", async () => {
    globSpy.mockReturnValueOnce(["test.gemspec"]);
    expect(() => new Gem()).not.toThrow();
  });

  describe("validateConfig", () => {
    test("validates invalid configuration", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks } as any);

      expect(
        await hooks.validateConfig.promise("gem", { command: "foo" })
      ).toMatchSnapshot();
    });

    test("validates valid configuration", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks } as any);

      expect(
        await hooks.validateConfig.promise("gem", { releaseCommand: "foo" })
      ).toStrictEqual([]);
    });
  });

  describe("getPreviousVersion", () => {
    test("gets previous version from gemspec", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValueOnce(endent`
      Gem::Specification.new do |spec|
        spec.version       = "0.1.0"
      end
    `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getPreviousVersion.promise()).toBe("0.1.0");
    });

    test("gets previous version from a version file", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      globSpy.mockReturnValueOnce("lib/version/version.rb");
      readFile.mockReturnValueOnce("");
      readFile.mockReturnValueOnce(endent`
      module HelloWorld
        VERSION = "0.1.14"
      end  
    `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getPreviousVersion.promise()).toBe("0.1.14");
    });

    test("throws if no version found", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      await expect(hooks.getPreviousVersion.promise()).rejects.toBeInstanceOf(
        Error
      );
    });
  });

  describe("getAuthor", () => {
    test("gets author from gemspec", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValueOnce(endent`
        Gem::Specification.new do |spec|
          spec.authors       = ["Andrew Lisowski"]
          spec.email         = ["lisowski54@gmail.com"]
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getAuthor.promise()).toStrictEqual({
        name: "Andrew Lisowski",
        email: "lisowski54@gmail.com",
      });
    });
  });

  describe("getRepository", () => {
    test("returns if no url found", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValueOnce(endent`
        Gem::Specification.new do |spec|
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getRepository.promise()).toBeUndefined();
    });

    test("returns if no repo found in url", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValueOnce(endent`
        Gem::Specification.new do |spec|
          spec.homepage      = "https://google.com/"
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getRepository.promise()).toBeUndefined();
    });

    test("find repo in homepage", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValueOnce(endent`
        Gem::Specification.new do |spec|
          spec.homepage      = "https://github.com/hipstersmoothie/auto-gem-test"
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getRepository.promise()).toStrictEqual({
        owner: "hipstersmoothie",
        repo: "auto-gem-test",
      });
    });

    test("prefer repo in source_code_uri", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValueOnce(endent`
        Gem::Specification.new do |spec|
          spec.homepage      = "https://github.com/hipstersmoothie/foo-bar"
          spec.metadata["source_code_uri"] = "https://github.com/hipstersmoothie/auto-gem-test"
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      expect(await hooks.getRepository.promise()).toStrictEqual({
        owner: "hipstersmoothie",
        repo: "auto-gem-test",
      });
    });
  });

  describe("version", () => {
    test("bump version", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValue(endent`
        Gem::Specification.new do |spec|
          spec.version       = "0.1.0"
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);
      await hooks.version.promise({ bump: SEMVER.minor });

      expect(writeFile).toHaveBeenCalledWith(
        "test.gemspec",
        endent`
          Gem::Specification.new do |spec|
            spec.version       = "0.2.0"
          end
        `
      );
    });

    test("throws with invalid version", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValue(endent`
        Gem::Specification.new do |spec|
          spec.version       = "0.1.avc"
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      await expect(
        hooks.version.promise({ bump: SEMVER.minor })
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe("publish", () => {
    beforeEach(() => {
      execSpy.mockClear();
    });

    test("uses bundler + rake as default publishing method", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValue(endent`
        Gem::Specification.new do |spec|
          spec.version       = "0.1.0"
        end
      `);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);
      await hooks.publish.promise({ bump: SEMVER.minor });

      expect(execSpy).toHaveBeenCalledWith("bundle", ["exec", "rake", "build"]);
    });

    test("user can configure release command", async () => {
      globSpy.mockReturnValueOnce(["test.gemspec"]);
      readFile.mockReturnValue(endent`
        Gem::Specification.new do |spec|
          spec.version       = "0.1.0"
        end
      `);

      const plugin = new Gem({
        releaseCommand: "gem release --tag --push",
      });
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);
      await hooks.publish.promise({ bump: SEMVER.minor });

      expect(execSyncSpy).toHaveBeenCalledWith("gem release --tag --push", {
        stdio: "inherit",
      });
    });
  });

  describe("canary", () => {
    beforeEach(() => {
      execSpy.mockClear();
    });
    test("uses (bundler + rake + gem push) as default publishing method", async () => {
      globSpy.mockReturnValue(["test.gemspec"]);
      readFile.mockReturnValue(endent`
        Gem::Specification.new do |spec|
          spec.name          = "test"
          spec.version       = "0.1.0"
        end
      `);

      const canaryIdentifier = '-canary-x'
      when(execSpy).calledWith("bundle", ["exec", "rake", "build"])
      .mockReturnValue(`test 0.2.0.pre${canaryIdentifier} built to pkg/test-0.2.0.pre${canaryIdentifier.replace('-','.')}.gem.`);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      const result = await hooks.canary
      .promise({ bump: SEMVER.minor, canaryIdentifier: "-canary-x", dryRun: false, quiet: false });

      expect(result.newVersion).toBe(`0.2.0.pre${canaryIdentifier.replace('-','.')}`)
      expect(result.details).toBe(endent`
       :sparkles: Test out this PR via:
      
       \`\`\`bash
       gem test, 0.2.0.pre${canaryIdentifier.replace('-','.')}
       or
       gem install test -v 0.2.0.pre${canaryIdentifier.replace('-','.')}
       \`\`\`
      `)

      expect(execSpy).toHaveBeenCalledWith("bundle", ["exec", "rake", "build"]);
      expect(execSpy).toHaveBeenCalledWith("gem", ["push", "pkg/test-0.2.0.pre.canary-x.gem"]);
    });

    test("dry-run not release", async () => {
      globSpy.mockReturnValue(["test.gemspec"]);
      readFile.mockReturnValue(endent`
        Gem::Specification.new do |spec|
          spec.name          = "test"
          spec.version       = "0.1.0"
        end
      `);

      const canaryIdentifier = '-canary-x'
      when(execSpy).calledWith("bundle", ["exec", "rake", "build"])
      .mockReturnValue(`test 0.2.0.pre${canaryIdentifier} built to pkg/test-0.2.0.pre${canaryIdentifier.replace('-','.')}.gem.`);

      const plugin = new Gem();
      const hooks = makeHooks();

      plugin.apply({ hooks, logger } as any);

      await hooks.canary
      .promise({ bump: SEMVER.minor, canaryIdentifier: "-canary-x", dryRun: true, quiet: false });

      expect(execSpy).not.toHaveBeenCalledWith("bundle", ["exec", "rake", "build"]);
      expect(execSpy).not.toHaveBeenCalledWith("gem", ["push", "pkg/test-0.2.0.pre.canary-x.gem"]);
    });

  });
});
