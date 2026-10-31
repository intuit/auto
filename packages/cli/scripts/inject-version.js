/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const autoPath = path.join(__dirname, "../dist/bin/auto.js");

const nextVersion = execSync(`${autoPath} shipit -dq`, {
  encoding: "utf-8",
}).trim();

// Rebuild with the version baked in via tsdown's `env` option
execSync("tsdown", {
  cwd: path.join(__dirname, ".."),
  stdio: "inherit",
  env: { ...process.env, AUTO_CLI_VERSION: nextVersion },
});
