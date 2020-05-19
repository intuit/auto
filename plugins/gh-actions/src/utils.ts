import * as fs from "fs";
import { promisify } from "util";

export const readFile = promisify(fs.readFile);
