import * as path from 'path';
import Auto from '../auto';
import { ILogger } from './logger';
import tryRequire from './try-require';

import ChromeWebStorePlugin from '../plugins/chrome';
import ConventionalCommitsPlugin from '../plugins/conventional-commits';
import FilterAccountsPlugin from '../plugins/filter-accounts';
import JiraPlugin from '../plugins/jira';
import NPMPlugin from '../plugins/npm';
import ReleasedLabelPlugin from '../plugins/released';
import SlackPlugin from '../plugins/slack';

export type IPluginConstructor = new (options?: any) => IPlugin;

export interface IPlugin {
  name: string;
  apply(auto: Auto): void;
}

type SupportedPlugin =
  | 'chrome'
  | 'conventional-commits'
  | 'filter-accounts'
  | 'jira'
  | 'npm'
  | 'released'
  | 'slack';

const plugins = new Map<SupportedPlugin, IPluginConstructor>([
  ['chrome', ChromeWebStorePlugin],
  ['conventional-commits', ConventionalCommitsPlugin],
  ['filter-accounts', FilterAccountsPlugin],
  ['jira', JiraPlugin],
  ['npm', NPMPlugin],
  ['released', ReleasedLabelPlugin],
  ['slack', SlackPlugin]
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
