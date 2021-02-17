import {
  Auto,
  IPlugin,
  SEMVER,
  validatePluginConfiguration,
} from "@auto-it/core";
import { satisfies } from "semver";
import * as t from "io-ts";

const pluginOptions = t.partial({
  /** The label to graduate a version to the next left 0 digit */
  label: t.string,
});

export type IMagicZeroPluginOptions = t.TypeOf<typeof pluginOptions>;

const defaultOptions: Required<IMagicZeroPluginOptions> = {
  label: "graduate",
};

/** A plugin that closely adheres to semver versioning for 0.0.x and 0.x.y releases */
export default class MagicZeroPlugin implements IPlugin {
  /** The name of the plugin */
  name = "magic-zero";

  /** The options of the plugin */
  readonly options: Required<IMagicZeroPluginOptions>;

  /** Initialize the plugin with it's options */
  constructor(options: IMagicZeroPluginOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.modifyConfig.tapPromise(this.name, async (config) => {
      const current = await auto.hooks.getPreviousVersion.promise();

      if (satisfies(current, "< 1.0.0")) {
        // Add special label for graduating releases
        if (!config.labels.find((l) => l.name === this.options.label)) {
          config.labels.push({
            name: this.options.label,
            description: "Graduate a version to the next left 0 digit",
            releaseType: SEMVER.major,
          });
        }

        if (satisfies(current, "> 0.0.x")) {
          // 0.x.y Versioning
          // major resolves to minor
          // minor resolves to patch
          config.labels = config.labels.map((label) => {
            let releaseType = label.releaseType;

            if (label.name !== this.options.label) {
              if (releaseType === SEMVER.minor) {
                releaseType = SEMVER.patch;
              } else if (releaseType === SEMVER.major) {
                releaseType = SEMVER.minor;
              }
            }

            return { ...label, releaseType };
          });
        } else {
          // 0.0.x Versioning
          // major/minor/patch all resolve to patch
          config.labels = config.labels.map((label) => {
            let releaseType = label.releaseType;

            if (label.name === this.options.label) {
              releaseType = SEMVER.minor;
            } else if (
              releaseType === SEMVER.minor ||
              releaseType === SEMVER.major
            ) {
              releaseType = SEMVER.patch;
            }

            return { ...label, releaseType };
          });
        }
      }

      return config;
    });
  }
}
