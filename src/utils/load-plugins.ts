import * as path from 'path';
import { AutoRelease } from '../main';
import ChromeWebStorePlugin from '../plugins/chrome';
import NPMPlugin from '../plugins/npm';

export type IPluginConstructor = new () => IPlugin;

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

export default function loadPlugin(
  pluginPath: SupportedPlugin | string
): IPluginConstructor | undefined {
  if (isSupported(pluginPath)) {
    return plugins.get(pluginPath);
  }

  try {
    return require(pluginPath);
  } catch (error) {
    return require(path.join(process.cwd(), pluginPath));
  }
}
