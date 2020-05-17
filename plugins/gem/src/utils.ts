import * as fs from "fs";
import { promisify } from "util";

export const mkdir = promisify(fs.mkdir);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
