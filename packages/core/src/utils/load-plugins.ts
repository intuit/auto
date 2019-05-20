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
  let plugin = tryRequire(pluginPath) as (
    | IPluginConstructor
    | { default: IPluginConstructor });

  // Try importing plugin as a path in CWD
  if (!plugin) {
    plugin = tryRequire(
      path.join(process.cwd(), pluginPath)
    ) as IPluginConstructor;
  }

  // Try importing official plugin
  if (!plugin) {
    plugin = tryRequire(
      path.join('@auto-it', pluginPath)
    ) as IPluginConstructor;
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

  if (!plugin) {
    logger.log.warn(`Could not find plugin: ${pluginPath}`);
    return;
  }

  if ('default' in plugin && plugin.default) {
    return new plugin.default(options);
  }

  return new (plugin as IPluginConstructor)(options);
}
