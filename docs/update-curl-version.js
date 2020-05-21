#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const project = require("../lerna.json");

const filename = path.join(__dirname, "./pages/non-npm.md");
const nonNpmDocs = fs.readFileSync(filename, { encoding: "utf8" });

fs.writeFileSync(
  filename,
  nonNpmDocs.replace(
    /(download\/v)(\d+\.\d+\.\d+)(\/auto-linux\.gz)/,
    `$1${project.version}$3`
  )
);
