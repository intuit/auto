import path from "path";
import fs from "fs";

/**
 * Retrieves the contents of the podspec file
 *
 * @param pListPath - The relative path to the podspec file
 * @returns A string that is the contents of the file
 */
export function getpListContents(pListPath: string): string {
  return fs.readFileSync(path.join(process.cwd(), pListPath)).toString();
}

/**
 * Write the podspec file contents
 *
 * @param pListPath - The relative path to the podspec file
 * @param contents - The contents to write to the podspec path
 */
export function writepListContents(pListPath: string, contents: string) {
  fs.writeFileSync(path.join(process.cwd(), pListPath), contents);
}
