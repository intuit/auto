import * as fs from "fs";
import path from "path";
import { promisify } from "util";

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

/** Load and parse the root package json for the project */
export async function loadPackageJson(root = "./"): Promise<IPackageJSON> {
  return JSON.parse(await readFile(path.join(root, "package.json"), "utf-8"));
}

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
