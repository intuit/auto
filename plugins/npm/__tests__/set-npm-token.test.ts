/* eslint-disable no-template-curly-in-string */

import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { loadPackageJson } from "@auto-it/package-json-utils";

import setNpmToken, { getRegistry } from "../src/set-npm-token";
import * as utils from "../src/utils";

const loadPackageJsonSpy = loadPackageJson as jest.Mock;
const readFile = (utils.readFile as jest.Mock).mockResolvedValue("");
const writeFile = utils.writeFile as jest.Mock;
const isMonorepo = utils.isMonorepo as jest.Mock;
const getLernaJson = utils.getLernaJson as jest.Mock;
const getNpmrcPath = utils.getNpmrcPath as jest.Mock;

jest.mock("@auto-it/package-json-utils");
jest.mock("../src/utils.ts");
jest.mock("env-ci", () => () => ({
  isCi: true,
}));
jest.mock("registry-url", () => (scope?: string) =>
  scope ? "foo.registry.com" : "npm.registry.com"
);
jest.mock("user-home", () => "/User/name");

describe("set npm token", () => {
  beforeEach(() => {
    writeFile.mockClear();
  });

  test("should write a new npmrc", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    getNpmrcPath.mockReturnValueOnce("/User/name/repo/.npmrc");
    await setNpmToken(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/repo/.npmrc",
      "npm.registry.com/:_authToken=${NPM_TOKEN}"
    );
  });

  test("should update a user's npmrc", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    getNpmrcPath.mockReturnValueOnce("/User/name/.npmrc");
    await setNpmToken(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/.npmrc",
      "npm.registry.com/:_authToken=${NPM_TOKEN}"
    );
  });

  test("should not write a new npmrc for single private package", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test", private: true });
    isMonorepo.mockReturnValueOnce(false);

    await setNpmToken(dummyLog());
    expect(writeFile).not.toHaveBeenCalled();
  });

  test("should write a npmrc for monorepo", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test", private: true });
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test", private: true });
    isMonorepo.mockReturnValueOnce(true);

    await setNpmToken(dummyLog());
    expect(writeFile).toHaveBeenCalled();
  });

  test("should get command publish registry", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    isMonorepo.mockReturnValueOnce(true);
    getLernaJson.mockReturnValue({
      command: { publish: { registry: "https://my.registry" } },
    });

    expect(await getRegistry()).toBe("https://my.registry");
  });

  test("should write a new npmrc w/o name", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({});
    loadPackageJsonSpy.mockReturnValueOnce({});
    getNpmrcPath.mockReturnValueOnce("/User/name/repo/.npmrc");
    await setNpmToken(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/repo/.npmrc",
      "npm.registry.com/:_authToken=${NPM_TOKEN}"
    );
  });

  test("should use registry from packageJson", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "test",
      publishConfig: { registry: "https://my-registry.com" },
    });
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "test",
      publishConfig: { registry: "https://my-registry.com" },
    });
    getNpmrcPath.mockReturnValueOnce("/User/name/.npmrc");
    await setNpmToken(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/.npmrc",
      "//my-registry.com/:_authToken=${NPM_TOKEN}"
    );
  });

  test("should use registry for scoped packaged", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "@scope/test",
    });
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "@scope/test",
    });
    getNpmrcPath.mockReturnValueOnce("/User/name/.npmrc");
    await setNpmToken(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/.npmrc",
      "foo.registry.com/:_authToken=${NPM_TOKEN}"
    );
  });

  test("should not edit npmrc if it already has the token", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "test",
      publishConfig: { registry: "https://my-registry.com" },
    });
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "test",
      publishConfig: { registry: "https://my-registry.com" },
    });
    getNpmrcPath.mockReturnValueOnce("/User/name/.npmrc");
    readFile.mockResolvedValueOnce(
      "//my-registry.com/:_authToken=${NPM_TOKEN}"
    );

    await setNpmToken(dummyLog());
    expect(writeFile).not.toHaveBeenCalled();
  });
});
