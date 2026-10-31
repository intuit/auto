import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: { "bin/auto": "./src/bin/auto.ts" },
  shims: true,
  // endent only has an `exports.default`, which Node's ESM/CJS interop can't see
  deps: {
    alwaysBundle: [
      "@auto-it/core",
      "@auto-it/npm",
      "@auto-it/released",
      "@auto-it/version-file",
      "endent",
      "chalk",
      "command-line-application",
      "module-alias",
      "signale",
      "terminal-link",
      "await-to-js",
    ],
  },
  // Bake the version into standalone binaries (see scripts/inject-version.js)
  ...(process.env.AUTO_CLI_VERSION && {
    env: { AUTO_CLI_VERSION: process.env.AUTO_CLI_VERSION },
  }),
  // dts: false,
  clean: true,
  sourcemap: false,
  exe: {
    targets: [
      { platform: "linux", arch: "x64", nodeVersion: "25.7.0" },
      { platform: "darwin", arch: "arm64", nodeVersion: "25.7.0" },
      { platform: "win", arch: "x64", nodeVersion: "25.7.0" },
    ],
  },
});

export default config;
