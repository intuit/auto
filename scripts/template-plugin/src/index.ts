import { Auto, IPlugin } from '@auto-it/core';

interface I{{pascal}}PluginOptions {}

export default class {{pascal}}Plugin implements IPlugin {
  name = '{{title}}';

  readonly options: I{{pascal}}PluginOptions;

  constructor(options: I{{pascal}}PluginOptions) {
    this.options = {};
  }

  apply(auto: Auto) {}
}
