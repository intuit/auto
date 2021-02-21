import mockFs from "mock-fs";
import path from "path";
import { getLernaJson, getLernaPathIfExists, getNpmrcPath } from "../src/utils";
import userHome from "user-home";

const cwd = process.cwd();
const rel = (p) => path.join(cwd, p);

afterEach(() => {
  mockFs.restore();
});

describe("getLernaPathIfExists", () => {
  test("should return the lerna.json if in the current dir", () => {
    mockFs({
      "lerna.json": "{}",
    });
    expect(getLernaPathIfExists()).toBe(rel("lerna.json"));
  });
  test("should return the lerna json if in the file tree", () => {
    mockFs({
      "../../lerna.json": {},
    });
    expect(getLernaPathIfExists()).not.toBe(rel("lerna.json"));
    expect(getLernaPathIfExists()).toBe(rel("../../lerna.json"));
  });
  test("should return false if no lerna.json found", () => {
    mockFs({});
    expect(getLernaPathIfExists()).toBe(false);
  });
});

describe("getLernaJson", () => {
  test("should return results if exists in path", () => {
    mockFs({
      "lerna.json": `{"hello": "world"}`,
    });
    expect(getLernaJson()).toEqual({ hello: "world" });
  });

  test("should return empty object if doesn't exist", () => {
    mockFs({});
    expect(getLernaJson()).toEqual({});
  });
});

describe("getNpmrcPath", () => {
  test("returns the .npmrc in the current directory if present and not monorepo", () => {
    mockFs({
      ".npmrc": "local",
    });
    expect(getNpmrcPath()).toBe(rel("./.npmrc"));
  });

  test("returns the .npmrc in parent directory if root of monorepo", () => {
    mockFs({
      ".npmrc": "local",
      "../../lerna.json": "{}",
      "../../.npmrc": "root",
    });
    expect(getNpmrcPath()).toBe(rel("../../.npmrc"));
  });

  test("returns the .npmrc from home directory if none local", () => {
    mockFs({
      [rel(path.relative(cwd, userHome) + "/.npmrc")]: "home",
    });
    expect(getNpmrcPath()).toBe(path.join(userHome, ".npmrc"));
  });
  test("returns the project root if no .npmrc", () => {
    mockFs();
    expect(getNpmrcPath()).toBe(rel("./.npmrc"));
  });
  test("returns the project root if no .npmrc but lerna", () => {
    mockFs({
      "../../lerna.json": "lerna.json",
    });
    expect(getNpmrcPath()).toBe(rel("../../.npmrc"));
  });
});
