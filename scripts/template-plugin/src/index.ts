import { Auto, IPlugin } from '@auto-it/core';

interface I{{pascal}}PluginOptions {}

export default class {{pascal}}Plugin implements IPlugin {
  /** The name of the plugin */
  name = '{{title}}';

  /** The options of the plugin */
  readonly options: I{{pascal}}PluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: I{{pascal}}PluginOptions) {
    this.options = {};
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {}
}
