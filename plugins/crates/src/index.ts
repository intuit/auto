import { Auto, execPromise, IPlugin, SEMVER } from "@auto-it/core";
import envCi from "env-ci";
import fs from "fs";
import path from "path";
import { inc, ReleaseType } from "semver";
import toml from "toml";
import os from "os";

const { isCi } = envCi();

/** Get the parsed cargo.toml for the crate */
export const getCargoConfig = () => {
  const content = fs
    .readFileSync(path.join(process.cwd(), "Cargo.toml"))
    .toString();
  return toml.parse(content);
};

/** Get the credentials for publishing to crates.io */
export function checkForCreds() {
  if (isCi) {
    return process.env.CARGO_REGISTRY_TOKEN;
  }

  const credsFile = path.join(os.homedir(), ".cargo", "credentials");
  return fs.existsSync(credsFile);
}

/** Bump the version in cargo.toml */
export function bumpVersion(bumpBy: SEMVER) {
  const filePath = path.join(process.cwd(), "Cargo.toml");
  const content = fs.readFileSync(filePath).toString();
  const config = toml.parse(content);
  const versionOld = config.package.version;
  const versionNew = inc(versionOld, bumpBy as ReleaseType);

  if (!versionNew) {
    throw new Error(`Could not increment previous version: ${versionOld}`);
  }

  const replaceOld = `version = "${versionOld}"`;
  const replaceNew = `version = "${versionNew}"`;
  const contentNew = content.replace(replaceOld, replaceNew);
  fs.writeFileSync(filePath, contentNew);
  return versionNew;
}

/** Deploy Rust crates */
export default class CratesPlugin implements IPlugin {
  /** The name of the plugin */
  name = "crates";

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.beforeShipIt.tap(this.name, () => {
      if (!checkForCreds()) {
        throw new Error("Cargo token is needed for the Crates plugin!");
      }
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      const config = await getCargoConfig();
      const authors = config.package.authors;
      auto.logger.log.info(`Crate authors: ${authors}`);
      return authors;
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      const config = await getCargoConfig();
      const version = auto.prefixRelease(config.package.version);
      auto.logger.log.info(`Crate version: ${version}`);
      return version;
    });

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const versionNew = bumpVersion(bump);

        if (dryRun) {
          if (quiet) {
            console.log(versionNew);
          } else {
            auto.logger.log.info(`Would have published: ${versionNew}`);
          }

          return;
        }

        auto.logger.log.info(`Bumped version to: ${versionNew}`);
        auto.logger.log.info("Building to update Cargo.lock");
        await execPromise("cargo", ["build"]);
        auto.logger.verbose.info("Committing files");
        await execPromise("git", ["add", "Cargo.toml", "Cargo.lock"]);
        await execPromise("git", [
          "commit",
          "-m",
          `'Bump version to: ${versionNew} [skip ci]'`,
          "--no-verify",
        ]);
        auto.logger.log.info("Create git commit for new version");
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      auto.logger.log.info("Publishing via cargo");
      await execPromise("cargo", ["publish"]);
      auto.logger.log.info("Publish complete");
      auto.logger.log.info("Pushing local git changes to origin remote");
      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);
      auto.logger.log.info("Push complete");
    });
  }
}
