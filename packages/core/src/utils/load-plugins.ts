import * as path from 'path';
import Auto from '../auto';
import { ILogger } from './logger';
import tryRequire from './try-require';

export type IPluginConstructor = new (options?: any) => IPlugin;

export interface IPlugin {
  name: string;
  apply(auto: Auto): void;
}

export default function loadPlugin(
  [pluginPath, options]: [string, any],
  logger: ILogger
): IPlugin | undefined {
  // tslint:disable-next-line:no-unnecessary-initializer
  let plugin:
    | IPluginConstructor
    | { default: IPluginConstructor }
    | undefined = undefined;

  // Try requiring a path
  if (pluginPath.startsWith('.')) {
    plugin = tryRequire(pluginPath);
  }

  // Try requiring a path from cwd
  if (!plugin && pluginPath.startsWith('.')) {
    plugin = tryRequire(path.join(process.cwd(), pluginPath));
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
      | { default: IPluginConstructor };
  }

  if (!plugin) {
    logger.log.warn(`Could not find plugin: ${pluginPath}`);
    return;
  }

  try {
    if ('default' in plugin && plugin.default) {
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
