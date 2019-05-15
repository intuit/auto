import cosmiconfig from 'cosmiconfig';
import merge from 'deepmerge';
import fetch from 'node-fetch';
import * as path from 'path';

import { ApiArgs } from './auto-args';
import {
  defaultLabelDefinition,
  getVersionMap,
  ILabelDefinition
} from './release';
import { ILogger } from './utils/logger';
import tryRequire from './utils/try-require';

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
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig(args: ApiArgs) {
    const explorer = cosmiconfig('auto', {
      searchPlaces: [
        `.autorc`,
        `.autorc.json`,
        `.autorc.yaml`,
        `.autorc.yml`,
        'package.json'
      ]
    });
    const result = await explorer.search();

    let rawConfig: cosmiconfig.Config = {};

    if (result && result.config) {
      rawConfig = result.config;
    }

    if (rawConfig.extends) {
      rawConfig = merge(
        rawConfig,
        await this.loadExtendConfig(rawConfig.extends)
      );
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
  async loadExtendConfig(extend: string) {
    let config: cosmiconfig.Config | { auto: cosmiconfig.Config };

    if (extend.endsWith('.js') || extend.endsWith('.mjs')) {
      throw new Error('Extended config cannot be a JavaScript file');
    }

    if (extend.startsWith('http')) {
      try {
        config = (await fetch(extend)).json();
        this.logger.verbose.note(`${extend} found: ${config}`);
      } catch (error) {
        error.message = `Failed to get extended config from ${extend} -- ${
          error.message
        }`;
        throw error;
      }
    } else if (extend.startsWith('.')) {
      config = tryRequire(extend);
      if (extend.endsWith('package.json')) {
        config = config && config.auto;
      }
      this.logger.verbose.note(`${extend} found: ${config}`);
    } else {
      config = tryRequire(`${extend}/package.json`);
      config = config && config.auto;
      this.logger.verbose.note(`${extend} found: ${config}`);
    }

    if (!config) {
      const scope = `${extend}/auto-config/package.json`;
      config = tryRequire(scope);
      config = config && config.auto;
      this.logger.verbose.note(`${scope} found: ${config}`);
    }

    if (!config) {
      const scope = `auto-config-${extend}/package.json`;
      config = tryRequire(scope);
      config = config && config.auto;
      this.logger.verbose.note(`${scope} found: ${config}`);
    }

    if (!config) {
      config = tryRequire(path.join(process.cwd(), extend));
    }

    if (!config) {
      throw new Error(`Unable to load extended config ${extend}`);
    }

    return config;
  }
}
