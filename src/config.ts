import cosmiconfig from 'cosmiconfig';
import merge from 'deepmerge';
import env from 'dotenv';
import * as path from 'path';

import { ArgsType } from './cli/args';
import {
  defaultLabelDefinition,
  getVersionMap,
  ILabelDefinition
} from './release';
import { ILogger } from './utils/logger';
import tryRequire from './utils/try-require';

type ConfigLoader = () => cosmiconfig.Config;

function normalizeLabels(config: cosmiconfig.Config) {
  let labels = defaultLabelDefinition;

  if (config.labels) {
    const definitions = Object.entries(config.labels).map(
      ([label, labelDef]: [string, Partial<ILabelDefinition> | string]) => {
        const definition =
          typeof labelDef === 'string' ? { name: labelDef } : labelDef;

        if (!definition.name) {
          definition.name = label;
        }

        return {
          [label]: definition
        };
      }
    );

    labels = merge(labels, Object.assign({}, ...definitions));
  }

  return labels;
}

export default class Config {
  logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;

    env.config();
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig(args: ArgsType) {
    const explorer = cosmiconfig('auto');
    const result = await explorer.search();

    let rawConfig: cosmiconfig.Config = {};

    if (result && result.config) {
      rawConfig = result.config;
    }

    if (rawConfig.extends) {
      rawConfig = merge(rawConfig, this.loadExtendConfig(rawConfig.extends));
    }

    const labels = normalizeLabels(rawConfig);
    const semVerLabels = getVersionMap(labels);

    this.logger.verbose.success('Using SEMVER labels:', '\n', semVerLabels);

    const skipReleaseLabels = rawConfig.skipReleaseLabels || [];

    if (!skipReleaseLabels.includes(semVerLabels.get('skip-release')!)) {
      skipReleaseLabels.push(semVerLabels.get('skip-release')!);
    }

    return {
      ...rawConfig,
      ...args,
      labels,
      skipReleaseLabels
    };
  }

  /**
   * Loads a config from a path, package name, or special `auto-config` pattern
   *
   * ex: auto-config-MY_CONFIG
   * ex: @MY_CONFIG/auto-config
   *
   * @param extend Path or name of config to find
   */
  loadExtendConfig(extend: string) {
    let config: cosmiconfig.Config | ConfigLoader = tryRequire(extend);
    this.logger.verbose.note(`${extend} found: ${config}`);

    if (!config) {
      const scope = `${extend}/auto-config`;
      config = tryRequire(scope);
      this.logger.verbose.note(`${scope} found: ${config}`);
    }

    if (!config) {
      const scope = `auto-config-${extend}`;
      config = tryRequire(scope);
      this.logger.verbose.note(`${scope} found: ${config}`);
    }

    if (!config) {
      config = tryRequire(path.join(process.cwd(), extend));
    }

    if (typeof config === 'function') {
      return (config as ConfigLoader)();
    }

    return config || {};
  }
}
