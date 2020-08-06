interface TestOptions {
  /** Test property */
  foo: string;
}

module.exports = class Test {
  /** The name of the plugin */
  name = "foo";

  /** The options of the plugin */
  config: TestOptions;

  /** Initialize the plugin with it's options */
  constructor(config: TestOptions) {
    this.config = config;
  }
};
