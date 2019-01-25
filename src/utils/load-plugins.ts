import * as path from 'path';
import Auto from '../auto';
import { ILogger } from './logger';
import tryRequire from './try-require';

import ChromeWebStorePlugin from '../plugins/chrome';
import ConventionalCommitsPlugin from '../plugins/conventional-commits';
import NPMPlugin from '../plugins/npm';
import ReleasedLabelPlugin from '../plugins/released';

export type IPluginConstructor = new (options?: any) => IPlugin;

export interface IPlugin {
  name: string;
  apply(auto: Auto): void;
}

type SupportedPlugin = 'npm' | 'chrome' | 'conventional-commits' | 'released';

const plugins = new Map<SupportedPlugin, IPluginConstructor>([
  ['npm', NPMPlugin],
  ['chrome', ChromeWebStorePlugin],
  ['conventional-commits', ConventionalCommitsPlugin],
  ['released', ReleasedLabelPlugin]
]);

function isSupported(key: SupportedPlugin | string): key is SupportedPlugin {
  return !!plugins.get(key as SupportedPlugin);
}

export default function loadPlugin(
  [pluginPath, options]: [SupportedPlugin | string, any],
  logger: ILogger
): IPlugin | undefined {
  let plugin: IPluginConstructor | undefined;

  if (isSupported(pluginPath)) {
    plugin = plugins.get(pluginPath);
  } else {
    plugin = tryRequire(pluginPath) as IPluginConstructor;

    if (!plugin) {
      plugin = tryRequire(
        path.join(process.cwd(), pluginPath)
      ) as IPluginConstructor;
    }
  }

  if (!plugin) {
    logger.log.warn(`Could not find plugin: ${pluginPath}`);
    return;
  }

  return new plugin(options);
}
