import { Auto, IPlugin, validatePluginConfiguration } from '@auto-it/core';
import * as t from "io-ts";

const pluginOptions = t.partial({
});

export type IOneReleaseCommitPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Allow to squash release commit in a single one */
export default class OneReleaseCommitPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'one-release-commit';

  /** The options of the plugin */
  readonly options: IOneReleaseCommitPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IOneReleaseCommitPluginOptions) {
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
