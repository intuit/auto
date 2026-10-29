import type { Mock } from "vitest";
/* eslint-disable no-template-curly-in-string */

import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { loadPackageJson } from "@auto-it/package-json-utils";

import setNpmToken, { getRegistry } from "../src/set-npm-token";
import * as utils from "../src/utils";

const loadPackageJsonSpy = loadPackageJson as Mock;
const readFile = utils.readFile as Mock;
const writeFile = utils.writeFile as Mock;
const isMonorepo = utils.isMonorepo as Mock;
const getLernaJson = utils.getLernaJson as Mock;

vi.mock("@auto-it/package-json-utils");
vi.mock("../src/utils.ts");
vi.mock("env-ci", () => ({
  default: () => ({
    isCi: true,
  }),
}));
vi.mock("registry-url", () => ({
  default: (scope?: string) =>
    scope ? "foo.registry.com" : "npm.registry.com",
}));
vi.mock("user-home", () => ({ default: "/User/name" }));

describe("set npm token", () => {
  beforeEach(() => {
    writeFile.mockClear();
  });

  test("should write a new npmrc", async () => {
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
    loadPackageJsonSpy.mockReturnValueOnce({ name: "test" });
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
    await setNpmToken(dummyLog());
    expect(writeFile).toHaveBeenCalledWith(
      "/User/name/.npmrc",
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
    readFile.mockReturnValueOnce("//my-registry.com/:_authToken=${NPM_TOKEN}");

    await setNpmToken(dummyLog());
    expect(writeFile).not.toHaveBeenCalled();
  });
});
