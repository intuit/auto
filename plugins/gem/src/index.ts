import {
  Auto,
  IPlugin,
  validatePluginConfiguration,
  execPromise,
} from "@auto-it/core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import endent from "endent";
import glob from "fast-glob";
import parseGitHubUrl from "parse-github-url";
import { inc, ReleaseType } from "semver";
import * as t from "io-ts";
import envCi from "env-ci";
import { readFile, writeFile, mkdir } from "./utils";

const VERSION_REGEX = /\d+\.\d+\.\d+/;
const { isCi } = envCi();

const pluginOptions = t.partial({
  /** A command to release the gem */
  releaseCommand: t.string,
});

export type IGemPluginOptions = t.TypeOf<typeof pluginOptions>;

/** A plugin that automates publishing ruby gems */
export default class GemPlugin implements IPlugin {
  /** The name of the plugin */
  name = "gem";

  /** A path the gemspec to publish */
  private readonly gemspec: string;
  /** User options for the plugins */
  private readonly options: IGemPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IGemPluginOptions = {}) {
    const gemspec = glob.sync("*.gemspec")[0];

    if (!gemspec) {
      throw new Error("No .gemspec found!");
    }

    this.gemspec = gemspec;
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      const [version] = await this.getVersion(auto);
      return version;
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      const content = await readFile(this.gemspec, { encoding: "utf8" });
      const name = content.match(/authors\s*=\s*\[["']([\S ]+)["']/);
      const email = content.match(/email\s*=\s*\[["']([\S ]+)["']/);

      return {
        name: name ? name[1] : undefined,
        email: email ? email[1] : undefined,
      };
    });

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      const content = await readFile(this.gemspec, { encoding: "utf8" });
      const repoUrl =
        content.match(/\[["']source_code_uri["']\]\s*=\s*["']([\S ]+)["']/) ||
        content.match(/homepage\s*=\s*["']([\S ]+)["']/);

      if (!repoUrl) {
        return;
      }

      const { owner, name } = parseGitHubUrl(repoUrl[1]) || {};

      if (!owner || !name) {
        return;
      }

      return {
        repo: name,
        owner,
      };
    });

    auto.hooks.version.tapPromise(this.name, async ({ bump, dryRun }) => {
      const [version, versionFile] = await this.getVersion(auto);
      const newTag = inc(version, bump as ReleaseType);

      if (dryRun && newTag) {
        console.log(newTag);
        return;
      }

      if (!newTag) {
        throw new Error(
          `The version "${version}" parsed from your version file "${versionFile}" was invalid and could not be incremented. Please fix this!`
        );
      }

      const content = await readFile(versionFile, { encoding: "utf8" });
      await writeFile(versionFile, content.replace(version, newTag));
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      if (
        isCi &&
        !fs.existsSync("~/.gem/credentials") &&
        process.env.RUBYGEMS_API_KEY
      ) {
        const home = process.env.HOME || "~";
        const gemDir = path.join(home, ".gem");

        if (!fs.existsSync(gemDir)) {
          auto.logger.verbose.info(`Creating ${gemDir} directory`);
          await mkdir(gemDir);
        }

        const credentials = path.join(gemDir, "credentials");

        await writeFile(
          credentials,
          endent`
            ---
            :rubygems_api_key: ${process.env.RUBYGEMS_API_KEY}

          `
        );
        auto.logger.verbose.success(`Wrote ${credentials}`);

        execSync(`chmod 0600 ${credentials}`, {
          stdio: "inherit",
        });
      }

      const [version] = await this.getVersion(auto);

      /** Commit the new version. we wait because "rake build" changes the lock file */
      const commitVersion = async () =>
        execPromise("git", [
          "commit",
          "-am",
          `"update version: ${version} [skip ci]"`,
          "--no-verify",
        ]);

      if (this.options.releaseCommand) {
        auto.logger.verbose.info("Running custom release command");
        await commitVersion();
        execSync(this.options.releaseCommand, { stdio: "inherit" });
      } else {
        auto.logger.verbose.info("Running default release command");
        await execPromise("bundle", ["exec", "rake", "build"]);
        await commitVersion();
        // will tag and push
        await execPromise("bundle", ["exec", "rake", "release"]);
      }
    });
  }

  /** Get the current version of the gem and where it was found */
  private async getVersion(auto: Auto) {
    let content = await readFile(this.gemspec, { encoding: "utf8" });
    let version = content.match(/version\s*=\s*["']([\S ]+)["']/);

    if (version?.[0]?.match(VERSION_REGEX)) {
      auto.logger.verbose.info(`Found version in gemspec: ${version[1]}`);
      return [version[1], this.gemspec];
    }

    const versionFile = glob.sync("lib/**/version.rb")[0];

    if (versionFile) {
      content = await readFile(versionFile, { encoding: "utf8" });
      version = content.match(/VERSION = ["']([\S ]+)["']/);

      if (version?.[0]?.match(VERSION_REGEX)) {
        auto.logger.verbose.info(
          `Found version in "${versionFile}": ${version[1]}`
        );
        return [version[1], versionFile];
      }
    }

    throw new Error("No version found in gemspec or version.rb!");
  }
}
