import * as fs from "fs";
import path from "path";
import { promisify } from "util";
import os from "os";

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const removeFile = promisify(fs.readFile);

/** Traverses the file tree to find the given file if it exists */
const getFilePathIfExists = (
  filePath: string,
  fileName: string
): false | string => {
  if (fs.existsSync(path.join(filePath, fileName))) {
    return filePath;
  }

  // If this is the root (like / or C://) it'll return itself
  if (filePath === path.join(filePath, "..")) {
    return false;
  }

  return getFilePathIfExists(path.join(filePath, ".."), fileName);
};

interface GetLernaPathFn {
  (): string | false;
  /** Where the result of the path is cached after the first run */
  _path?: string | false;
}
/** Get the path to the lerna.json file in the tree or false if it doesn't exist */
export const getLernaPathIfExists: GetLernaPathFn = () => {
  if (typeof getLernaPathIfExists._path !== "undefined") {
    return getLernaPathIfExists._path;
  }

  const pathToLerna = getFilePathIfExists(process.cwd(), "lerna.json");
  const result = pathToLerna ? path.join(pathToLerna, "lerna.json") : false;
  if (process.env.NODE_ENV !== "test") {
    getLernaPathIfExists._path = result;
  }

  return result;
};

/** Check if the project is a monorepo */
export const isMonorepo = (): boolean => Boolean(getLernaPathIfExists());

/** Parse the lerna.json file. */
export const getLernaJson = () => {
  const lernaPath = getLernaPathIfExists();
  if (!lernaPath) return {};
  try {
    return JSON.parse(fs.readFileSync(lernaPath, "utf8"));
  } catch (error) {
    return {};
  }
};

/** Find the nearest .npmrc file */
export const getNpmrcPath = () => {
  const cwd = process.cwd();
  const lernaPath = getLernaPathIfExists();
  const projectPath = lernaPath ? path.dirname(lernaPath) : cwd;

  const localRC = path.join(projectPath, ".npmrc");
  const homeRC = path.join(os.homedir(), ".npmrc");

  return fs.existsSync(localRC)
    ? localRC
    : fs.existsSync(homeRC)
    ? homeRC
    : localRC;
};
