import * as fs from "fs";
import { promisify } from "util";

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
