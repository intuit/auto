import { cosmiconfig } from "cosmiconfig";
import merge from "deepmerge";
import fetch from "node-fetch";
import * as path from "path";
import TypeScriptLoader from "@endemolshinegroup/cosmiconfig-typescript-loader";

import { getVersionMap } from "./release";
import { ILogger } from "./utils/logger";
import tryRequire from "./utils/try-require";
import endent from "endent";
import { ILabelDefinition, defaultLabels } from "./semver";

export const DEFAULT_PRERELEASE_BRANCHES = ["next"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigObject = any;

/** Transform all types of label configuration into just 1 shape */
export function normalizeLabel(
  label: Partial<ILabelDefinition>
): Partial<ILabelDefinition> {
  const baseLabel =
    defaultLabels.find((l) => {
      let isBase = false;

      if (label.releaseType !== "none") {
        isBase = l.releaseType === label.releaseType;
      }

      return isBase || (label.name && l.name === label.name);
    }) || {};
  return { ...baseLabel, ...label };
}

/**
 * Go through all the labels in a config and make them
 * follow the same format.
 */
export function normalizeLabels(config: ConfigObject) {
  if (config.labels) {
    const userLabels: ILabelDefinition[] = config.labels.map(normalizeLabel);
    const baseLabels = defaultLabels.filter(
      (d) =>
        !userLabels.some(
          (u) => u.releaseType && u.releaseType === d.releaseType && u.overwrite
        )
    );

    return [...userLabels, ...baseLabels];
  }

  return defaultLabels;
}

/** Load a user's configuration from the system and resolve any extended config */
export default class Config {
  /** A logger that uses log levels */
  logger: ILogger;

  /** Initialize the config loader */
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig() {
    const name = "auto";
    const explorer = cosmiconfig(name, {
      searchPlaces: [
        "package.json",
        `.${name}rc`,
        `.${name}rc.json`,
        `.${name}rc.yaml`,
        `.${name}rc.yml`,
        `.${name}rc.ts`,
        `.${name}rc.js`,
        `.${name}rc.cjs`,
        `${name}.config.js`,
        `${name}.config.cjs`,
        `${name}.config.ts`,
        `${name}.config.js`,
      ],
      loaders: {
        ".ts": TypeScriptLoader,
      },
    });
    const result = await explorer.search();

    let rawConfig: ConfigObject = {};

    if (result?.config) {
      rawConfig = result.config;
    }

    if (typeof rawConfig === "function") {
      rawConfig = await rawConfig();
    }

    if (rawConfig.extends) {
      rawConfig = merge(
        rawConfig,
        await this.loadExtendConfig(rawConfig.extends)
      );
    }

    this.checkDeprecated(rawConfig);
    const labels = normalizeLabels(rawConfig);
    const semVerLabels = getVersionMap(labels);

    this.logger.verbose.success("Using SEMVER labels:", "\n", semVerLabels);

    return {
      ...rawConfig,
      labels,
      prereleaseBranches:
        rawConfig.prereleaseBranches || DEFAULT_PRERELEASE_BRANCHES,
      versionBranches:
        typeof rawConfig.versionBranches === "boolean" &&
        rawConfig.versionBranches
          ? "version-"
          : rawConfig.versionBranches,
    };
  }

  /**
   * Loads a config from a path, package name, or special `auto-config` pattern
   *
   * ex: auto-config-MY_CONFIG
   * ex: @MY_CONFIG/auto-config
   *
   * @param extend - Path or name of config to find
   */
  async loadExtendConfig(extend: string) {
    let config:
      | ConfigObject
      | {
          /** package.json field with auto config */
          auto: ConfigObject;
        };

    if (extend.endsWith(".js") || extend.endsWith(".mjs")) {
      throw new Error("Extended config cannot be a JavaScript file");
    }

    if (extend.startsWith("http")) {
      try {
        config = (await fetch(extend)).json();
        this.logger.verbose.note(`${extend} found: ${config}`);
      } catch (error) {
        error.message = `Failed to get extended config from ${extend} -- ${error.message}`;
        throw error;
      }
    } else if (extend.startsWith(".")) {
      config = tryRequire(extend);

      if (extend.endsWith("package.json")) {
        config = config?.auto;
      }

      this.logger.verbose.note(`${extend} found: ${config}`);
    } else {
      config = tryRequire(`${extend}/package.json`)?.auto;
      this.logger.verbose.note(`${extend} found: ${config}`);
    }

    if (!config) {
      const scope = `${extend}/auto-config/package.json`;
      config = tryRequire(scope);
      config = config?.auto;
      this.logger.verbose.note(`${scope} found: ${config}`);

      if (config) {
        config.extends = scope;
      }
    }

    if (!config) {
      const scope = `auto-config-${extend}/package.json`;
      config = tryRequire(scope);
      config = config?.auto;
      this.logger.verbose.note(`${scope} found: ${config}`);

      if (config) {
        config.extends = scope;
      }
    }

    if (!config) {
      const localPath = path.join(process.cwd(), extend);
      config = tryRequire(localPath);

      if (config) {
        config.extends = localPath;
      }
    }

    if (!config) {
      throw new Error(`Unable to load extended config ${extend}`);
    }

    return config;
  }

  /** Ensure a user's config is not using deprecated options. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private checkDeprecated(config: Record<string, any>) {
    if (config.labels && !Array.isArray(config.labels)) {
      this.logger.log.error(endent`
        You're using a deprecated configuration option!

        The "labels" option no longer supports configuration with an object.
        Instead supply your labels as an array of label objects.

        ex:

        |  {
        |    "labels": [
        |      {
        |        "name": "my-label",
        |        "description": "Really big stuff",
        |        "type": "major"
        |      }
        |    ]
        |  }
      `);

      process.exit(1);
    }

    if (config.skipReleaseLabels) {
      this.logger.log.error(endent`
        You're using a deprecated configuration option!

        The "skipReleaseLabels" option no longer exists.
        Instead set "type" to "skip" in your label configuration.

        ex:

        |  {
        |    "labels": [
        |      {
        |        "name": "my-label",
        |        "description": "Really big stuff",
        |        "type": "skip"
        |      }
        |    ]
        |  }
      `);

      process.exit(1);
    }
  }
}
