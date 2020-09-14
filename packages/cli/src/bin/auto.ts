#!/usr/bin/env node

import moduleAlias from "module-alias";
import path from "path";

try {
  // eslint-disable-next-line
  const json = require(path.join(__dirname, "../../package.json"));

  if (json.name.startsWith("@auto-canary")) {
    moduleAlias.addAliases({
      /** We want to rewrite all the imports for canary (ex: npm plugin requiring core) */
      "@auto-it": (fromPath: string, request: string) =>
        request.startsWith("@auto-it") &&
        // but we also want to be able to require official plugins from a canary
        !fromPath.endsWith("noop.js") &&
        // and don't want to override those plugins's imports
        !fromPath.includes("@auto-it")
          ? "@auto-canary"
          : "@auto-it",
    });
  }
} catch (error) {}

import chalk from "chalk";
import parseArgs from "../parse-args";
import { runCli } from "../run";

const [command, args] = parseArgs();

if (command && args) {
  runCli(command, args).catch((e: Error) => {
    console.error(chalk.redBright("Error: "), e.message);
    process.exit(1);
  });
}
