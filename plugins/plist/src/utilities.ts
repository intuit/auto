import path from "path";
import fs from "fs";

/** Escape special regex characters so key names are matched literally */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Builds a regex that matches a plist key/string value pair, e.g.:
 *   <key>CFBundleShortVersionString</key>
 *   <string>1.0.0</string>
 *
 * Capture groups:
 *   1 – everything up to and including the opening <string> tag
 *   2 – the current version value
 *   3 – the closing </string> tag
 */
export function plistValueRegex(key: string): RegExp {
  return new RegExp(
    `(<key>${escapeRegex(key)}<\\/key>\\s*<string>)([^<]+)(<\\/string>)`
  );
}

/**
 * Read the raw contents of a plist file
 *
 * @param plistPath - Path to the plist file, relative to cwd
 */
export function getPlistContents(plistPath: string): string {
  return fs.readFileSync(path.join(process.cwd(), plistPath)).toString();
}

/**
 * Write raw contents back to a plist file
 *
 * @param plistPath - Path to the plist file, relative to cwd
 * @param contents - New file contents
 */
export function writePlistContents(plistPath: string, contents: string) {
  fs.writeFileSync(path.join(process.cwd(), plistPath), contents);
}
