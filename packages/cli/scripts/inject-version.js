/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const autoPath = path.join(__dirname, "../dist/bin/auto.js");

execSync(`chmod +x ${autoPath}`);
const nextVersion = execSync(`${autoPath} shipit -dq`, {
  encoding: "utf-8",
}).trim();
const parseArgsPath = path.join(__dirname, "../dist/parse-args.js");
const parseArgsContent = fs.readFileSync(parseArgsPath, { encoding: "utf-8" });

fs.writeFileSync(
  parseArgsPath,
  parseArgsContent.replace(/process\.env\.AUTO_CLI_VERSION/, `"${nextVersion}"`)
);
