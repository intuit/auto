#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/** Baseline paths that haven't moved to the new site yet. Must end up empty. */
const pending = [];

const dist = path.join(__dirname, "dist");
const baseline = fs
  .readFileSync(path.join(__dirname, "url-baseline.txt"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));

/** The file GitHub Pages serves for a baseline path, bare or with ".html" */
const servedFile = (urlPath) => {
  if (urlPath === "/") {
    return "index.html";
  }

  // Static files ("/blog/feed.xml") are served exactly as they are
  if (path.posix.basename(urlPath).includes(".")) {
    return urlPath.slice(1);
  }

  return `${urlPath.slice(1)}.html`;
};

const missing = baseline
  .filter((urlPath) => !pending.includes(urlPath))
  .filter((urlPath) => !fs.existsSync(path.join(dist, servedFile(urlPath))));

if (missing.length) {
  console.error(
    [
      `${missing.length} path(s) from url-baseline.txt are missing from the built site:`,
      ...missing.map(
        (urlPath) => `- ${urlPath} (expected dist/${servedFile(urlPath)})`
      ),
    ].join("\n")
  );
  process.exit(1);
}

console.log(
  `All ${baseline.length - pending.length} baseline paths are served` +
    (pending.length ? ` (${pending.length} still pending)` : "")
);
