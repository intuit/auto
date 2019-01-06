import * as path from 'path';
import { IPlugin } from '../main';
import NPMPlugin from '../plugins/npm';

type SupportedPlugin = 'npm';
const plugins = new Map<SupportedPlugin, IPlugin>([['npm', NPMPlugin]]);

function isSupported(key: SupportedPlugin | string): key is SupportedPlugin {
  return !!plugins.get(key as SupportedPlugin);
}

export default function loadPlugin(
  pluginPath: SupportedPlugin | string
): IPlugin | undefined {
  if (isSupported(pluginPath)) {
    return plugins.get(pluginPath);
  }

  try {
    return require(pluginPath);
  } catch (error) {
    return require(path.join(process.cwd(), pluginPath));
  }
}
