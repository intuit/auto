import * as Auto from "@auto-it/core";

import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import {
  loadPackageJson,
  getAuthor,
  getRepo,
} from "@auto-it/package-json-utils";

import Vscode from "../src";

const exec = jest.fn();
const loadPackageJsonSpy = loadPackageJson as jest.Mock;
const getAuthorSpy = getAuthor as jest.Mock;
const getRepoSpy = getRepo as jest.Mock;

jest.mock("@auto-it/package-json-utils");
jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args)
);

const setup = (mockGit?: any) => {
  const plugin = new Vscode();
  const hooks = makeHooks();

  plugin.apply(({
    hooks,
    git: mockGit,
    remote: "origin",
    logger: dummyLog(),
    prefixRelease: (r: string) => `v${r}`,
    config: { prereleaseBranches: ["next"] },
    getCurrentVersion: () => "v1.0.0",
  } as unknown) as Auto.Auto);

  return hooks;
};

describe("VSCode Plugin", () => {
  beforeEach(() => {
    loadPackageJsonSpy.mockClear();
    getAuthorSpy.mockClear();
    getRepoSpy.mockClear();
    exec.mockClear();
  });

  describe("getAuthor", () => {
    test("doesn't break if no author found", async () => {
      const hooks = setup();
      getAuthorSpy.mockResolvedValueOnce(undefined);
      const previousVersion = await hooks.getAuthor.promise();
      expect(previousVersion).toBeUndefined();
    });

    test("should get author", async () => {
      const hooks = setup();
      getAuthorSpy.mockResolvedValueOnce({
        name: "This me",
        email: "me@this.com",
      });
      const previousVersion = await hooks.getAuthor.promise();
      expect(previousVersion).toStrictEqual({
        name: "This me",
        email: "me@this.com",
      });
    });
  });

  describe("getRepo", () => {
    test("doesn't break if no repo found", async () => {
      const hooks = setup();
      getRepoSpy.mockResolvedValueOnce(undefined);
      const previousVersion = await hooks.getRepository.promise();
      expect(previousVersion).toBeUndefined();
    });

    test("should get author", async () => {
      const hooks = setup();
      getRepoSpy.mockResolvedValueOnce({
        owner: "org",
        repo: "project",
      });
      const previousVersion = await hooks.getRepository.promise();
      expect(previousVersion).toStrictEqual({
        owner: "org",
        repo: "project",
      });
    });
  });

  describe("getPreviousVersion", () => {
    test("default to v0", async () => {
      const hooks = setup();
      loadPackageJsonSpy.mockResolvedValueOnce({});
      const previousVersion = await hooks.getPreviousVersion.promise();
      expect(previousVersion).toBe("v0.0.0");
    });

    test("should get previous version", async () => {
      const hooks = setup();
      loadPackageJsonSpy.mockResolvedValueOnce({ version: "1.0.0" });
      const previousVersion = await hooks.getPreviousVersion.promise();
      expect(previousVersion).toBe("v1.0.0");
    });
  });

  describe("version", () => {
    test("should not version the repo during a dry run", async () => {
      const hooks = setup();
      loadPackageJsonSpy.mockResolvedValueOnce({ version: "1.0.0" });
      await hooks.version.promise({ bump: Auto.SEMVER.patch, dryRun: true });
      expect(exec).not.toHaveBeenCalled();
    });

    test("should tag next version", async () => {
      const hooks = setup();
      loadPackageJsonSpy.mockResolvedValueOnce({ version: "1.0.0" });
      await hooks.version.promise({ bump: Auto.SEMVER.patch });
      expect(exec).toHaveBeenCalledWith("npm", [
        "version",
        "1.0.1",
        "--no-commit-hooks",
        "-m",
        "Bump version to: %s [skip ci]",
      ]);
    });
  });

  describe("publish", () => {
    test("should push tags and call vsce", async () => {
      const hooks = setup();
      loadPackageJsonSpy.mockResolvedValueOnce({ version: "1.0.0" });
      await hooks.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec).toHaveBeenCalledWith("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        "origin",
        undefined,
      ]);

      expect(exec).toHaveBeenCalledWith("npx", [
        "vsce",
        "publish",
        "1.0.0",
        "--pat",
        undefined,
      ]);
    });
  });
});
