/* eslint-disable jsdoc/no-types, @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");
const { inc } = require("semver");
const { execSync } = require("child_process");

const filename = path.join(
  __dirname,
  "../docs/pages/docs/configuration/non-npm.mdx"
);

module.exports = class TestPlugin {
  /** Initialize */
  constructor() {
    this.name = "update-curl-version";
  }

  /**
   * Tap into auto plugin points.
   *
   * @param {import('@auto-it/core').default} auto - An instance of auto
   */
  apply(auto) {
    auto.hooks.beforeCommitChangelog.tap(this.name, ({ lastRelease, bump }) => {
      const nonNpmDocs = fs.readFileSync(filename, { encoding: "utf8" });

      fs.writeFileSync(
        filename,
        nonNpmDocs.replace(
          /(download\/v)(\d+\.\d+\.\d+)(\/auto-linux-x64\.gz)/,
          `$1${inc(lastRelease, bump)}$3`
        )
      );

      // Add the file so that when the changelog is committed this docs update is included
      execSync(`git add ${filename}`);
    });
  }
};
