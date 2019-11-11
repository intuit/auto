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
    plugin = tryRequire(pluginPath);
  }

  // Try requiring a path from cwd
  if (!plugin && (pluginPath.startsWith('.') || pluginPath.startsWith('/'))) {
    plugin = tryRequire(path.join(process.cwd(), pluginPath));

    if (!plugin) {
      logger.log.warn(`Could not find plugin from path: ${pluginPath}`);
      return;
    }
  }

  // For pkg bundle
  if (!plugin) {
    plugin = tryRequire(
      path.join(
        __dirname,
        '../../../../../plugins/',
        pluginPath,
        'dist/index.js'
      )
    ) as IPluginConstructor;
  }

  // For a user created plugin
  if (!plugin) {
    plugin = tryRequire(`auto-plugin-${pluginPath}`) as IPluginConstructor;
  }

  // Try importing official plugin
  if (!plugin) {
    plugin = tryRequire(path.join('@auto-it', pluginPath)) as
      | IPluginConstructor
      | {
          /** The plugin under the default export */
          default: IPluginConstructor;
        };
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
