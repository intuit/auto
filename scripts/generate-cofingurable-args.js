#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { camelCase } = require("change-case");
const endent = require("endent").default;
const glob = require("fast-glob");
const docs = require("command-line-docs").default;
const { commands } = require("../packages/cli/dist/parse-args");

commands.forEach((command) => {
  const configOptions = (command.options || []).filter(
    (option) => option.config
  );

  if (!configOptions.length) {
    return;
  }

  console.log(endent`
    ${command.name} has the following configurable option:

    ${configOptions.map((o) => `- \`${o.name}\``).join("\n")}\n\n\n
  `);
  console.log();
  console.log();
});
