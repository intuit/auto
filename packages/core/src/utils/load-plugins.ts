/* eslint-disable @typescript-eslint/no-explicit-any */

import * as path from 'path';
import Auto from '../auto';
import { ILogger } from './logger';
import tryRequire from './try-require';

export type IPluginConstructor = new (options?: any) => IPlugin;

/** A plugin to auto */
export interface IPlugin {
  /** The name to identify the plugin by */
  name: string;
  /** Called when registering the plugin with auto */
  apply(auto: Auto): void;
}

function requirePlugin(pluginPath: string, logger: ILogger) {
  const plugin = tryRequire(pluginPath);

  if (plugin) {
    logger.verbose.info(`Found plugin using: ${pluginPath}`);
  }

  return plugin as IPluginConstructor;
}

/** Try to load a plugin in various ways */
export default function loadPlugin(
  [pluginPath, options]: [string, any],
  logger: ILogger
): IPlugin | undefined {
  let plugin:
    | IPluginConstructor
    | {
        /** The plugin under the default export */
        default: IPluginConstructor;
      }
    | undefined;

  // Try requiring a path
  if (pluginPath.startsWith('.') || pluginPath.startsWith('/')) {
    plugin = requirePlugin(pluginPath, logger);
  }

  // Try requiring a path from cwd
  if (!plugin && (pluginPath.startsWith('.') || pluginPath.startsWith('/'))) {
    const localPath = path.join(process.cwd(), pluginPath);
    plugin = requirePlugin(localPath, logger);

    if (!plugin) {
      logger.log.warn(`Could not find plugin from path: ${localPath}`);
      return;
    }
  }

  // For pkg bundle
  if (!plugin) {
    const pkgPath = path.join(
      __dirname,
      '../../../../../plugins/',
      pluginPath,
      'dist/index.js'
    );
    plugin = requirePlugin(pkgPath, logger);
  }

  // For a user created plugin
  if (!plugin) {
    plugin = requirePlugin(`auto-plugin-${pluginPath}`, logger);
  }

  // Try importing official plugin
  if (!plugin) {
    plugin = requirePlugin(path.join('@auto-it', pluginPath), logger);
  }

  if (!plugin) {
    logger.log.warn(`Could not find plugin: ${pluginPath}`);
    return;
  }

  try {
    if ('default' in plugin && plugin.default) {
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
