import * as fs from "fs";
import path from "path";
import { promisify } from "util";
import userHome from "user-home";

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

/** Check if the project is a monorepo */
export const isMonorepo = () => fs.existsSync("lerna.json");

/** Parse the lerna.json file. */
export const getLernaJson = () => {
  try {
    return JSON.parse(fs.readFileSync("lerna.json", "utf8"));
  } catch (error) {
    return {};
  }
};

/**
 *
 */
export const getNpmrcPath = () => {
  const homeRC = path.join(userHome, ".npmrc");
  const localRC = path.join(process.cwd(), ".npmrc");
  return fs.existsSync(localRC)
    ? localRC
    : fs.existsSync(homeRC)
    ? homeRC
    : localRC;
};
