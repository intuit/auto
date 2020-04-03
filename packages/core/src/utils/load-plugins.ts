/* eslint-disable @typescript-eslint/no-explicit-any */
import { execSync } from "child_process";
import chalk from "chalk";
import endent from "endent";

import * as path from "path";
import Auto from "../auto";
import { ILogger } from "./logger";
import tryRequire from "./try-require";
import InteractiveInit from "../init";
import { LoadedAutoRc } from "../types";

export type IPluginConstructor = new (options?: any) => IPlugin;

/** A plugin to auto */
export interface IPlugin {
  /** The name to identify the plugin by */
  name: string;
  /** Called when running `auto init`. gives plugin ability to add custom init experience. */
  init?(initializer: InteractiveInit): void;
  /** Called when registering the plugin with auto */
  apply(auto: Auto): void;
}

const pluginPatterns = ["@auto-it", "@auto-canary", "auto-plugin-"].map(
  (p) => new RegExp(`${p}\\/([a-zA-Z-_\\.]+)$`)
);
const excluded = ["core", "cli", "bot-list"];

export interface InstalledModule {
  /** The name of the module */
  name: string;
  /** The path to the module */
  path: string;
}

/** Get the paths of available installed plugins. */
export const getInstalledPlugins = (global = false): InstalledModule[] => {
  let modules: string[] = [];

  try {
    const stdout = execSync(`npm ls --parseable ${global ? "--global" : ""}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });

    modules = stdout.split("\n");
  } catch (error) {
    modules = error.stdout.split("\n");
  }

  return modules
    .map((p) => {
      if (!pluginPatterns.some((pattern) => p.match(pattern))) {
        return undefined;
      }

      const parts = p.split("node_modules/");
      const name = parts[parts.length - 1]
        .replace("@auto-it/", "")
        .replace("@auto-canary/", "");

      if (excluded.includes(name)) {
        return undefined;
      }

      return {
        name,
        path: p,
      };
    })
    .filter((m: InstalledModule | undefined): m is InstalledModule =>
      Boolean(m)
    );
};

/** Require a plugin and log where it was found. */
function requirePlugin(
  pluginPath: string,
  logger: ILogger,
  extendedLocation?: string
) {
  const plugin = tryRequire(pluginPath, extendedLocation);

  if (plugin) {
    logger.verbose.info(`Found plugin using: ${pluginPath}`);
  }

  return plugin as
    | IPluginConstructor
    | {
        /** The plugin under the default export */
        default: IPluginConstructor;
      }
    | undefined;
}

/** Try to load a plugin in various ways */
export function findPlugin(
  pluginPath: string,
  logger: ILogger,
  extendedLocation?: string
): string | undefined {
  const isLocal =
    pluginPath.startsWith(".") ||
    pluginPath.startsWith("/") ||
    pluginPath.match(/^[A-Z]:\\/); // Support for windows paths

  /** Attempt to require a plugin */
  const exists = (p: string) =>
    Boolean(requirePlugin(p, logger, extendedLocation));

  // Try requiring a path
  if (isLocal && exists(pluginPath)) {
    return pluginPath;
  }

  // Try requiring a path from cwd
  if (isLocal) {
    const localPath = path.join(process.cwd(), pluginPath);

    if (!exists(localPath)) {
      logger.log.warn(`Could not find plugin from path: ${localPath}`);
      return;
    }

    return localPath;
  }

  // For pkg bundle
  const pkgPath = path.join(
    __dirname,
    "../../../../../plugins/",
    pluginPath,
    "dist/index.js"
  );

  if (exists(pkgPath)) {
    return pkgPath;
  }

  const userPlugin = `auto-plugin-${pluginPath}`;

  // For a user created plugin
  if (exists(userPlugin)) {
    return userPlugin;
  }

  const officialPlugin = path.join("@auto-it", pluginPath);

  // Try importing official plugin
  if (exists(officialPlugin)) {
    return officialPlugin;
  }

  const canaryPlugin = path.join("@auto-canary", pluginPath);

  // Try importing official plugin
  if (exists(canaryPlugin)) {
    return canaryPlugin;
  }

  // Try requiring a package
  if (
    pluginPath.includes("/auto-plugin-") ||
    pluginPath.startsWith("auto-plugin-") ||
    pluginPath.startsWith("@auto-it")
  ) {
    if (exists(pluginPath)) {
      return pluginPath;
    }
  }

  logger.log.warn(`Could not find plugin: ${pluginPath}`);
}

/** Try to load a plugin in various ways */
export function loadPlugin(
  [pluginPath, options]: [string, any],
  logger: ILogger,
  extendedLocation?: string
): IPlugin | undefined {
  const localPluginPath = findPlugin(pluginPath, logger, extendedLocation);

  if (!localPluginPath) {
    return;
  }

  const plugin = requirePlugin(localPluginPath, logger, extendedLocation);

  if (!plugin) {
    return;
  }

  try {
    if ("default" in plugin && plugin.default) {
      // eslint-disable-next-line new-cap
      return new plugin.default(options);
    }

    return new (plugin as IPluginConstructor)(options);
  } catch (error) {
    logger.log.error(
      `Plugin at the following path encountered an error: ${pluginPath}`
    );
    throw error;
  }
}

/** Print a list of plugins */
const printPlugins = (title: string, modules: InstalledModule[]) => {
  if (!modules.length) {
    return;
  }

  console.log(endent`
    ${chalk.underline.white(title)}

    ${modules.map((plugin) => `- ${plugin.name} (${plugin.path})`).join("\n")}
  `);
  console.log("");
};

/** List some of the plugins available to auto */
export const listPlugins = async (
  { plugins = [] }: LoadedAutoRc,
  logger: ILogger,
  extendedLocation?: string
) => {
  printPlugins(
    "Found the following plugins in your .autorc:",
    plugins.map((plugin) => {
      if (typeof plugin === "string") {
        return {
          name: plugin,
          path: findPlugin(plugin, logger, extendedLocation) || "",
        };
      }

      return {
        name: plugin[0],
        path: findPlugin(plugin[0], logger, extendedLocation) || "",
      };
    })
  );

  printPlugins(
    "Found the following plugins installed in your project:",
    getInstalledPlugins().map((installed) => ({
      ...installed,
      path: path.relative(process.cwd(), installed.path),
    }))
  );

  printPlugins(
    "Found the following plugins globally installed in your environment:",
    getInstalledPlugins(true)
  );

  logger.log.note(
    'There might be other plugins available as files on your machine. This flag can only list plugins from your .autorc or plugins managed with "npm".'
  );
};
