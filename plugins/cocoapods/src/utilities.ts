import path from "path";
import fs from "fs";

/**
 * Retrieves the contents of the podspec file
 *
 * @param podspecPath - The relative path to the podspec file
 * @returns A string that is the contents of the file
 */
export function getPodspecContents(podspecPath: string): string {
  return fs.readFileSync(path.join(process.cwd(), podspecPath)).toString();
}

/**
 * Write the podspec file contents
 *
 * @param podspecPath - The relative path to the podspec file
 * @param contents - The contents to write to the podspec path
 */
export function writePodspecContents(podspecPath: string, contents: string) {
  fs.writeFileSync(path.join(process.cwd(), podspecPath), contents);
}
