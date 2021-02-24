/* eslint-disable no-template-curly-in-string */
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { loadPackageJson } from "@auto-it/package-json-utils";

import {
  setTokenOnCI,
  unsetTokenOnCI,
  getRegistry,
} from "../src/set-npm-token";
import * as utils from "../src/utils";
import path from "path";
import os from "os";

const cwd = process.cwd();
const rel = (p: string) => path.join(cwd, p);

const loadPackageJsonSpy = loadPackageJson as jest.Mock;
const readFile = (utils.readFile as jest.Mock).mockResolvedValue("");
const writeFile = utils.writeFile as jest.Mock;
const removeFile = utils.removeFile as jest.Mock;
const isMonorepo = utils.isMonorepo as jest.Mock;
const getLernaJson = utils.getLernaJson as jest.Mock;
const getNpmrcPath = utils.getNpmrcPath as jest.Mock;
const execPromise = jest.fn();

jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => execPromise(...args)
);
jest.mock("@auto-it/package-json-utils");
jest.mock("../src/utils.ts");
jest.mock("env-ci", () => () => ({
  isCi: true,
}));
jest.mock("registry-url", () => (scope?: string) =>
  scope ? "foo.registry.com" : "npm.registry.com"
);
jest.mock("user-home", () => "/User/name");

beforeEach(() => {
  writeFile.mockReset();
  getNpmrcPath.mockReset();
  execPromise.mockReset();
});

describe("set npm token", () => {
  test("should write a new npmrc", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    getNpmrcPath.mockReturnValueOnce("/User/name/repo/.npmrc");
    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/repo/.npmrc",
      "npm.registry.com/:_authToken=${NPM_TOKEN}"
    );
    expect(result).toBe(true);
  });

  test("should update a user's npmrc", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    getNpmrcPath.mockReturnValueOnce("/User/name/.npmrc");
    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/.npmrc",
      "npm.registry.com/:_authToken=${NPM_TOKEN}"
    );
    expect(result).toBe(true);
  });

  test("should not write a new npmrc for single private package", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test", private: true });
    isMonorepo.mockReturnValueOnce(false);

    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test("should write a npmrc for monorepo", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test", private: true });
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test", private: true });
    isMonorepo.mockReturnValueOnce(true);
    getNpmrcPath.mockReturnValueOnce("/User/name/repo/.npmrc");

    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).toHaveBeenCalled();
    expect(result).toBe(true);
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
    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/repo/.npmrc",
      "npm.registry.com/:_authToken=${NPM_TOKEN}"
    );
    expect(result).toBe(true);
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
    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/.npmrc",
      "//my-registry.com/:_authToken=${NPM_TOKEN}"
    );
    expect(result).toBe(true);
  });

  test("should use registry for scoped packaged", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "@scope/test",
    });
    loadPackageJsonSpy.mockReturnValueOnce({
      name: "@scope/test",
    });
    getNpmrcPath.mockReturnValueOnce("/User/name/.npmrc");
    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/.npmrc",
      "foo.registry.com/:_authToken=${NPM_TOKEN}"
    );
    expect(result).toBe(true);
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

    const result = await setTokenOnCI(dummyLog());
    expect(writeFile).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});

describe("unset npm token", () => {
  it("should delete npmrc from homedir", async () => {
    const homeRC = path.join(os.homedir(), ".npmrc");
    getNpmrcPath.mockReturnValueOnce(homeRC);
    await unsetTokenOnCI(dummyLog());
    expect(removeFile).toBeCalledWith(homeRC);
  });
  it("should delete npmrc if in repo and untracked", async () => {
    getNpmrcPath.mockReturnValueOnce(rel(".npmrc"));
    execPromise.mockRejectedValueOnce(new Error("file untracked"));
    await unsetTokenOnCI(dummyLog());
    expect(removeFile).toBeCalledWith(rel(".npmrc"));
  });
  /**
   * This is a really bad test that doesn't actually test anything. Definitely should update it.
   * I'm not sure yet what the best way to test these git operations are
   */
  it("should checkout npmrc previously ignored", async () => {
    getNpmrcPath.mockReturnValueOnce(rel(".npmrc"));
    execPromise.mockResolvedValueOnce({});
    await unsetTokenOnCI(dummyLog());
    expect(execPromise).toBeCalledTimes(3);
  });
});
