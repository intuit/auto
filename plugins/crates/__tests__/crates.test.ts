import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import CratesPlugin, {
  bumpVersion,
  checkForCreds,
  getCargoConfig,
} from "../src";

const sampleCargoToml = `[package]
name = "example"
version = "1.2.3"
authors = ["example <example@example.com>"]
edition = "2018"
description = "example"
repository = "https://github.com/example/example"
readme = "README.md"
keywords = ["example", "example"]
categories = ["example"]
license = "Apache-2.0 AND MIT"
exclude = [
    "example_1",
    "example_2",
    "example_3"
]

[dependencies]
example_1 = {version = "1.0.0", features = ["example_ft"]}
example_2 = "2.0.0"
example_3 = "3.0.0"
example_4 = "4.0.0"

[dev-dependencies]
example_5 = "5.0.0"
`;

const exec = jest.fn();
const existsSync = jest.fn();
const readFileSync = jest.fn();
const writeFile = jest.fn();
const writeFileSync = jest.fn();
const readResult = "{}";

jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args)
);
// @ts-ignore
jest.mock("env-ci", () => () => ({ isCi: false }));
jest.mock("fs", () => ({
  // @ts-ignore
  existsSync: (...args) => existsSync(...args),
  // @ts-ignore
  readFile: (a, b, cb) => {
    cb(undefined, readResult);
  },
  // @ts-ignore
  readFileSync: (...args) => readFileSync(...args),
  ReadStream: function () {},
  WriteStream: function () {},
  // @ts-ignore
  closeSync: () => undefined,
  // @ts-ignore
  writeFile: (file, data, cb) => {
    cb(undefined, writeFile(file, data));
  },
  // @ts-ignore
  writeFileSync: (file, data) => {
    writeFileSync(file, data);
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("CratesPlugin", () => {
  describe("getCargoConfig", () => {
    test("returns an error if the file does not exist", () => {
      const error = new Error("file does not exist");

      readFileSync.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => getCargoConfig()).toThrow(error);
      expect(readFileSync).toHaveBeenCalledTimes(1);
    });

    test("returns data if file exists", () => {
      readFileSync.mockReturnValueOnce(sampleCargoToml);
      const data = getCargoConfig();
      expect(data.dependencies.example_1.features[0]).toBe("example_ft");
      expect(readFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe("checkForCreds", () => {
    test("returns false if file does not exist", () => {
      existsSync.mockReturnValueOnce(false);
      const res = checkForCreds();
      expect(res).toBe(false);
      expect(existsSync).toHaveBeenCalledTimes(1);
    });

    test("returns true if the file exists", () => {
      existsSync.mockReturnValueOnce(true);
      const res = checkForCreds();
      expect(res).toBe(true);
      expect(existsSync).toHaveBeenCalledTimes(1);
    });
  });

  describe("bumpVersion", () => {
    beforeEach(() => {
      readFileSync.mockReturnValueOnce(sampleCargoToml);
    });

    test("throws error if could not bump version", () => {
      // @ts-ignore
      expect(() => bumpVersion("wrong")).toThrow(
        "Could not increment previous version"
      );
      expect(readFileSync).toHaveBeenCalledTimes(1);
    });

    describe("bumps version and writes to file", () => {
      test("patch", () => {
        const versionNew = bumpVersion(Auto.SEMVER.patch);
        expect(versionNew).toBe("1.2.4");
        expect(writeFileSync).toHaveBeenCalledTimes(1);
      });

      test("minor", () => {
        const versionNew = bumpVersion(Auto.SEMVER.minor);
        expect(versionNew).toBe("1.3.0");
        expect(writeFileSync).toHaveBeenCalledTimes(1);
      });

      test("major", () => {
        const versionNew = bumpVersion(Auto.SEMVER.major);
        expect(versionNew).toBe("2.0.0");
        expect(writeFileSync).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("hooks", () => {
    describe("beforeShipIt", () => {
      test("throws error if no Cargo creds", async () => {
        existsSync.mockReturnValueOnce(false);
        const plugin = new CratesPlugin();
        const hooks = makeHooks();
        plugin.apply({ hooks, logger: dummyLog() } as Auto.Auto);

        await expect(
          hooks.beforeShipIt.promise({ releaseType: "canary" })
        ).rejects.toThrow("Cargo token is needed for the Crates plugin");
      });

      test("does not throw error if Cargo creds", async () => {
        existsSync.mockReturnValueOnce(true);
        const plugin = new CratesPlugin();
        const hooks = makeHooks();
        plugin.apply({ hooks, logger: dummyLog() } as Auto.Auto);

        await expect(
          hooks.beforeShipIt.promise({ releaseType: "canary" })
        ).resolves.not.toThrow();
      });
    });

    describe("getAuthor", () => {
      test("returns author", async () => {
        readFileSync.mockReturnValueOnce(sampleCargoToml);
        const plugin = new CratesPlugin();
        const hooks = makeHooks();
        plugin.apply({ hooks, logger: dummyLog() } as Auto.Auto);
        expect(await hooks.getAuthor.promise()).toStrictEqual([
          "example <example@example.com>",
        ]);
      });
    });

    describe("getPreviousVersion", () => {
      test("returns version", async () => {
        const prefixRelease = (str: string) => str;
        readFileSync.mockReturnValueOnce(sampleCargoToml);
        const plugin = new CratesPlugin();
        const hooks = makeHooks();
        plugin.apply({ hooks, logger: dummyLog(), prefixRelease } as Auto.Auto);
        expect(await hooks.getPreviousVersion.promise()).toStrictEqual("1.2.3");
      });
    });

    describe("version", () => {
      test("does versioning", async () => {
        const plugin = new CratesPlugin();
        readFileSync.mockReturnValueOnce(sampleCargoToml);

        const hooks = makeHooks();
        plugin.apply({ hooks, logger: dummyLog() } as Auto.Auto);
        await hooks.version.promise({ bump: Auto.SEMVER.patch });
        expect(exec).toHaveBeenCalledWith("cargo", ["build"]);
        expect(exec).toHaveBeenCalledWith("git", [
          "add",
          "Cargo.toml",
          "Cargo.lock",
        ]);
        expect(exec).toHaveBeenCalledWith("git", [
          "commit",
          "-m",
          `'Bump version to: 1.2.4 [skip ci]'`,
          "--no-verify",
        ]);
      });
    });

    describe("publish", () => {
      test("does publishing", async () => {
        const plugin = new CratesPlugin();
        const hooks = makeHooks();
        plugin.apply({
          hooks,
          logger: dummyLog(),
          remote: "origin",
          baseBranch: "master",
        } as Auto.Auto);
        await hooks.publish.promise(Auto.SEMVER.patch);
        expect(exec).toHaveBeenCalledWith("cargo", ["publish"]);
        expect(exec).toHaveBeenCalledWith("git", [
          "push",
          "--follow-tags",
          "--set-upstream",
          "origin",
          "master",
        ]);
      });
    });
  });
});
