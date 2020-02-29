/* eslint-disable @typescript-eslint/no-explicit-any */

import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';
import { labelDefinition } from './release';
import { autoRc, AutoRc } from './types';
import { AsyncSeriesBailHook } from 'tapable';

const ignoreTypes = ['PartialType', 'IntersectionType'];

export interface ConfigError {
  /** Key path in config to misconfigured option */
  path: string;
  /** The expected type */
  expectedType: string;
  /** The actual value */
  value: any;
}

/** Format and error as a string */
function formatError({ path, expectedType, value }: ConfigError) {
  return `Expecting type ${expectedType} for "${path}" but instead got: ${value}`;
}

/** Report configuration errors */
function reporter<T>(validation: t.Validation<T>) {
  if (validation._tag !== 'Left') {
    return false;
  }

  const errors: ConfigError[] = validation.left.map(error => {
    let parentType = '';

    const path = error.context
      // The context entry with an empty key is the original type ("default
      // context"), not an type error.
      .filter(c => c.key.length > 0)
      .filter(c => {
        const tag = (c.type as any)._tag;
        const include =
          parentType === 'ArrayType' ||
          (!ignoreTypes.includes(tag) && parentType !== 'UnionType');

        parentType = tag;
        return include;
      })
      .map(c => c.key)
      .join('.');

    return {
      path,
      expectedType: error.context[error.context.length - 1].type.name,
      value: error.value
    };
  });

  const grouped = errors.reduce((acc, item) => {
    if (!acc[item.path]) {
      acc[item.path] = [];
    }

    acc[item.path].push(item);
    return acc;
  }, {} as Record<string, ConfigError[]>);

  return Object.entries(grouped).map(([path, group]) => {
    const expectedType = group
      .map(g => g.expectedType)
      .map(t => `"${t}"`)
      .join(' or ');
    const value = group[0].value;

    return formatError({
      expectedType,
      path,
      value
    });
  });
}

/** Convert nested object to array of flat key paths */
function flatKeys(obj: Record<string, any>): string[] {
  return Object.keys(obj)
    .map(key => {
      if (typeof obj[key] === 'object') {
        return flatKeys(obj[key]).map(sub => `${key}.${sub}`);
      }

      return [key];
    })
    .reduce((acc, item) => acc.concat(item), []);
}

export type ValidatePluginHook = AsyncSeriesBailHook<
  [string, any],
  void | ConfigError[]
>;

/** Ensure plugins validation is correct. */
async function validatePlugins(
  validatePlugin: ValidatePluginHook,
  rc: AutoRc
): Promise<string[]> {
  const errors: ConfigError[] = [];

  if (!rc.plugins) {
    return [];
  }

  await Promise.all(
    rc.plugins.map(async plugin => {
      if (!Array.isArray(plugin)) {
        return;
      }

      const pluginErrors = await validatePlugin.promise(...plugin);

      if (pluginErrors) {
        errors.push(...pluginErrors);
      }
    })
  );

  return errors.map(formatError);
}

/** Validate a configuration */
export async function validateConfiguration(
  validatePlugin: ValidatePluginHook,
  rc: Parameters<typeof autoRc.decode>[0]
): Promise<string[]> {
  const looseRc = autoRc.decode(rc);
  const errors = reporter(looseRc);
  const allErrors = [...(await validatePlugins(validatePlugin, rc as any))];

  if (errors) {
    return [...errors, ...allErrors];
  }

  const exactRc = t
    .intersection([
      t.exact(t.partial({ labels: t.array(t.exact(labelDefinition)) })),
      t.exact(autoRc)
    ])
    .decode(rc);

  if (!isRight(looseRc) || !isRight(exactRc)) {
    return allErrors;
  }

  const correctKeys = flatKeys(exactRc.right);
  const unknownKeys = flatKeys(looseRc.right).filter(
    k => !correctKeys.includes(k)
  );

  if (unknownKeys.length === 0) {
    return allErrors;
  }

  return [
    `Found unknown configuration keys in .autorc: ${unknownKeys.join(', ')}`,
    ...allErrors
  ];
}
