import { Auto, IPlugin, validatePluginConfiguration } from '@auto-it/core';
import * as t from "io-ts";

const pluginOptions = t.partial({
});

export type I{{pascal}}PluginOptions = t.TypeOf<typeof pluginOptions>;

/** {{description}} */
export default class {{pascal}}Plugin implements IPlugin {
  /** The name of the plugin */
  name = '{{kebab}}';

  /** The options of the plugin */
  readonly options: I{{pascal}}PluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: I{{pascal}}PluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });
  }
}
