#!/usr/bin/env node

const copy = require("copy-template-dir");
const path = require("path");
const log = require("signale");
const fs = require("fs");
const changeCase = require("change-case");
const { titleCase } = require("title-case");
const [, , name, description] = process.argv;

const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../lerna.json"), "utf8")
);
const inDir = path.join(__dirname, "./template-package");
const kebab = changeCase.paramCase(name);
const outDir = path.join(__dirname, "../packages", kebab);
const TSCONFIG = path.join(__dirname, "../tsconfig.dev.json");

fs.mkdirSync(outDir);

const vars = {
  description,
  version,
  title: titleCase(name),
  kebab,
  pascal: changeCase.pascalCase(name),
};

copy(inDir, outDir, vars, (err, createdFiles) => {
  if (err) {
    throw err;
  }

  createdFiles.forEach((filePath) =>
    log.info(`Created ${path.relative(outDir, filePath)}`)
  );
  log.success(`Created @auto-it/${kebab} package!`);
});

fs.readFile(TSCONFIG, "utf8", (err, data) => {
  if (err) {
    throw err;
  }

  const json = JSON.parse(data);

  json.references.push({
    path: `packages/${kebab}`,
  });

  fs.writeFileSync(TSCONFIG, JSON.stringify(json, null, 2));
  log.success(`Updated tsconfig.dev.json!`);
});
