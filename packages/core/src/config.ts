import { cosmiconfig } from 'cosmiconfig';
import merge from 'deepmerge';
import fetch from 'node-fetch';
import * as path from 'path';

import { ApiOptions } from './auto-args';
import {
  defaultLabelDefinition,
  getVersionMap,
  ILabelDefinition,
  ILabelDefinitionMap
} from './release';
import { ILogger } from './utils/logger';
import tryRequire from './utils/try-require';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigObject = any;

/** Transform all types of label configuration into just 1 shape */
export function normalizeLabel(
  name: string,
  label:
    | string
    | Partial<ILabelDefinition>
    | (Partial<ILabelDefinition> | string)[]
): Partial<ILabelDefinition>[] {
  const baseLabel = (defaultLabelDefinition[name] || [{}])[0];

  if (typeof label === 'string') {
    return [{ ...baseLabel, name: label }];
  }

  if (Array.isArray(label)) {
    return label
      .map(l => normalizeLabel(name, l))
      .reduce((acc, item) => [...acc, ...item], []);
  }

  if (!label.name) {
    label.name = name;
  }

  return [{ ...baseLabel, ...label }];
}

/**
 * Go through all the labels in a config and make them
 * follow the same format.
 */
export function normalizeLabels(config: ConfigObject) {
  let labels = defaultLabelDefinition;

  if (config.labels) {
    const definitions = Object.entries<Partial<ILabelDefinition> | string>(
      config.labels
    ).map(([label, labelDef]) => ({
      [label]: normalizeLabel(label, labelDef)
    }));

    labels = merge.all([labels, ...definitions], {
      arrayMerge: (destinationArray, sourceArray) => sourceArray
    }) as ILabelDefinitionMap;
  }

  return labels;
}

/** Load a user's configuration from the system and resolve any extended config */
export default class Config {
  /** A logger that uses log levels */
  logger: ILogger;

  /** Initialize the config loader */
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Load the .autorc from the file system, set up defaults, combine with CLI args
   * load the extends property, load the plugins and start the git remote interface.
   */
  async loadConfig(args: ApiOptions) {
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

    let rawConfig: ConfigObject = {};

    if (result?.config) {
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
      (semVerLabels.get('skip-release') || []).map(l =>
        skipReleaseLabels.push(l)
      );
    }

    return {
      ...rawConfig,
      ...args,
      labels,
      skipReleaseLabels,
      prereleaseBranches: rawConfig.prereleaseBranches || ['next']
    };
  }

  /**
   * Loads a config from a path, package name, or special `auto-config` pattern
   *
   * ex: auto-config-MY_CONFIG
   * ex: @MY_CONFIG/auto-config
   *
   * @param extend - Path or name of config to find
   */
  async loadExtendConfig(extend: string) {
    let config:
      | ConfigObject
      | {
          /** package.json field with auto config */
          auto: ConfigObject;
        };

    if (extend.endsWith('.js') || extend.endsWith('.mjs')) {
      throw new Error('Extended config cannot be a JavaScript file');
    }

    if (extend.startsWith('http')) {
      try {
        config = (await fetch(extend)).json();
        this.logger.verbose.note(`${extend} found: ${config}`);
      } catch (error) {
        error.message = `Failed to get extended config from ${extend} -- ${error.message}`;
        throw error;
      }
    } else if (extend.startsWith('.')) {
      config = tryRequire(extend);

      if (extend.endsWith('package.json')) {
        config = config?.auto;
      }

      this.logger.verbose.note(`${extend} found: ${config}`);
    } else {
      config = tryRequire(`${extend}/package.json`);
      config = config?.auto;
      this.logger.verbose.note(`${extend} found: ${config}`);
    }

    if (!config) {
      const scope = `${extend}/auto-config/package.json`;
      config = tryRequire(scope);
      config = config?.auto;
      this.logger.verbose.note(`${scope} found: ${config}`);
    }

    if (!config) {
      const scope = `auto-config-${extend}/package.json`;
      config = tryRequire(scope);
      config = config?.auto;
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
