import { Auto, IPlugin, validatePluginConfiguration } from '@auto-it/core';
import * as t from "io-ts";

const pluginOptions = t.partial({
});

export type ISbtPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Publish Scala projects with sbt */
export default class SbtPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'sbt';

  /** The options of the plugin */
  readonly options: ISbtPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: ISbtPluginOptions) {
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
