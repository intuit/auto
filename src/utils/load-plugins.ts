import * as path from 'path';
import { AutoRelease } from '../main';
import ChromeWebStorePlugin from '../plugins/chrome';
import NPMPlugin from '../plugins/npm';

export type IPluginConstructor = new (options?: any) => IPlugin;

export interface IPlugin {
  name: string;
  apply(auto: AutoRelease): void;
}

type SupportedPlugin = 'npm' | 'chrome';
const plugins = new Map<SupportedPlugin, IPluginConstructor>([
  ['npm', NPMPlugin],
  ['chrome', ChromeWebStorePlugin]
]);

function isSupported(key: SupportedPlugin | string): key is SupportedPlugin {
  return !!plugins.get(key as SupportedPlugin);
}

function tryRequire(tryPath: string) {
  try {
    return require(tryPath);
  } catch (error) {
    return null;
  }
}

export default function loadPlugin([pluginPath, options]: [
  SupportedPlugin | string,
  any
]): IPlugin | undefined {
  let plugin: IPluginConstructor | undefined;

  if (isSupported(pluginPath)) {
    plugin = plugins.get(pluginPath);
  } else {
    plugin = tryRequire(pluginPath);

    if (!plugin) {
      plugin = tryRequire(path.join(process.cwd(), pluginPath));
    }
  }

  if (!plugin) {
    return;
  }

  return new plugin(options);
}
