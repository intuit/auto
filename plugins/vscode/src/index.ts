import {
  Auto,
  IPlugin,
  validatePluginConfiguration,
  execPromise,
} from "@auto-it/core";
import * as t from "io-ts";
import { inc, ReleaseType } from "semver";
import {
  getRepo,
  getAuthor,
  loadPackageJson,
} from "@auto-it/package-json-utils";

/** Get the current version from the package.json */
const getVersion = async () => {
  const { version } = await loadPackageJson();

  if (version) {
    return version;
  }

  return "0.0.0";
};

const pluginOptions = t.partial({
  /** Prepend all relative links in README.md with this url */
  baseContentUrl: t.string,
  /** Prepend all relative image links in README.md with this url */
  baseImagesUrl: t.string,
});

export type IVscodePluginOptions = t.TypeOf<typeof pluginOptions>;

/** Publish an vscode extension */
export default class VscodePlugin implements IPlugin {
  /** The name of the plugin */
  name = "vscode";

  /** The options of the plugin */
  readonly options: IVscodePluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IVscodePluginOptions = {}) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const isQuiet = auto.logger.logLevel === "quiet";
    const isVerbose =
      auto.logger.logLevel === "verbose" ||
      auto.logger.logLevel === "veryVerbose";
    const verboseArgs = isQuiet
      ? ["--loglevel", "silent"]
      : isVerbose
      ? ["--loglevel", "silly"]
      : [];

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        `${this.name}: Getting repo information from package.json`
      );

      const author = await getAuthor();

      if (author) {
        return author;
      }
    });

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        `${this.name}: getting repo information from package.json`
      );
      const repo = await getRepo();

      if (repo) {
        return repo;
      }
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      return auto.prefixRelease(await getVersion());
    });

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const newVersion = inc(
          await getVersion(),
          bump as ReleaseType
        ) as string;

        if (dryRun) {
          if (quiet) {
            console.log(newVersion);
          } else {
            auto.logger.log.info(`Would have published: ${newVersion}`);
          }

          return;
        }

        await execPromise("npm", [
          "version",
          newVersion,
          "--no-commit-hooks",
          "-m",
          '"Bump version to: %s [skip ci]"',
          ...verboseArgs,
        ]);
        auto.logger.verbose.info("Successfully versioned repo");
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      auto.logger.log.info("Pushing new tag to GitHub");
      const version = await getVersion();

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);

      await execPromise("npx", [
        "vsce",
        "publish",
        version,
        "--pat",
        process.env.VSCE_TOKEN,
        ...(this.options.baseContentUrl
          ? ["--baseContentUrl", this.options.baseContentUrl]
          : []),
        ...(this.options.baseImagesUrl
          ? ["--baseImagesUrl", this.options.baseImagesUrl]
          : []),
      ]);
    });
  }
}
