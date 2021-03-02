/* eslint-disable @typescript-eslint/no-explicit-any */

import * as t from "io-ts";
import { isRight } from "fp-ts/lib/Either";
import { autoRc, AutoRc } from "./types";
import { AsyncSeriesBailHook } from "tapable";
import { omit } from "./utils/omit";
import chalk from "chalk";
import endent from "endent";

const ignoreTypes = ["PartialType", "IntersectionType", "ExactType"];
const unexpectedValue = chalk.redBright.bold;
const errorPath = chalk.underline.bold;

interface ConfigOptionError {
  /** Key path in config to misconfigured option */
  path: string;
  /** The expected type */
  expectedType: string;
  /** The actual value */
  value: any;
}

export type ConfigError = string | ConfigOptionError;

/** Format and error as a string */
export function formatError(error: ConfigError) {
  if (typeof error === "string") {
    return error;
  }

  const { path, expectedType, value } = error;
  const formattedValue =
    (Array.isArray(value) &&
      endent`
        [
          ${value.join(",\n")}
        ]
      `) ||
    (typeof value === "object" && JSON.stringify(value, null, 2)) ||
    value;

  return `${errorPath(`"${path}"`)}\n\nExpected ${chalk.greenBright.bold(
    expectedType
  )} but got: ${unexpectedValue(formattedValue)}\n`;
}

/** Report configuration errors */
function reporter<T>(validation: t.Validation<T>) {
  if (validation._tag !== "Left") {
    return false;
  }

  const errors: ConfigError[] = validation.left.map((error) => {
    let parentType = "";

    const path = error.context
      .filter((c) => {
        const tag = (c.type as any)._tag;
        const include =
          parentType === "ArrayType" ||
          (!ignoreTypes.includes(tag) &&
            parentType !== "UnionType" &&
            parentType !== "IntersectionType");

        parentType = tag;
        return c.key && include;
      })
      .map((c) => c.key)
      .join(".");

    return {
      path,
      expectedType: error.context[error.context.length - 1].type.name,
      value: error.value,
    };
  });

  const otherErrors: string[] = [];
  const grouped = errors.reduce<Record<string, ConfigOptionError[]>>(
    (acc, item) => {
      if (typeof item === "string") {
        otherErrors.push(item);
        return acc;
      }

      if (!acc[item.path]) {
        acc[item.path] = [];
      }

      acc[item.path].push(item);
      return acc;
    },
    {}
  );
  const paths = Object.keys(grouped);

  return [
    ...otherErrors,
    ...Object.entries(grouped)
      .filter(([path]) => {
        return !paths.some((p) => p.includes(path) && p !== path);
      })
      .map(([path, group]) => {
        const expectedType = group
          .map((g) => g.expectedType)
          .map((t) => `"${t}"`)
          .join(" or ");
        const value = group[0].value;

        return {
          expectedType,
          path,
          value,
        };
      }),
  ];
}

/** Convert nested object to array of flat key paths */
function flatKeys(obj: Record<string, any>): string[] {
  return Object.keys(obj)
    .map((key) => {
      if (typeof obj[key] === "object") {
        return flatKeys(obj[key]).map((sub) => `${key}.${sub}`);
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
export async function validatePlugins(
  validatePlugin: ValidatePluginHook,
  rc: AutoRc
): Promise<ConfigError[]> {
  const errors: ConfigError[] = [];

  if (!Array.isArray(rc.plugins)) {
    return [];
  }

  await Promise.all(
    rc.plugins.map(async (plugin) => {
      if (!Array.isArray(plugin)) {
        return;
      }

      const pluginErrors = await validatePlugin.promise(...plugin);

      if (pluginErrors) {
        errors.push(...pluginErrors);
      }
    })
  );

  return errors;
}

const shouldRecurse = [
  "PartialType",
  "IntersectionType",
  "ArrayType",
  "InterfaceType",
];

/**
 * Recurse through a io-ts type and make all objects exact.
 * This helps us check for additional properties.
 */
function makeExactType(
  configDeceleration: t.Any | t.HasProps
): t.Any | t.HasProps {
  let strictConfigDeclaration = configDeceleration;

  if (
    "props" in configDeceleration &&
    configDeceleration._tag !== "StrictType"
  ) {
    const props: Record<string, t.Any> = {};

    Object.entries(configDeceleration.props).forEach(
      ([propName, propType]: [string, any]) => {
        props[propName] = shouldRecurse.includes(propType._tag)
          ? makeExactType(propType)
          : propType;
      }
    );

    strictConfigDeclaration = t.exact(
      configDeceleration._tag === "InterfaceType"
        ? t.interface({ ...props })
        : t.partial({ ...props })
    );
  } else if ("types" in configDeceleration) {
    const exactInterfaces: t.Any[] = configDeceleration.types.map((propType) =>
      shouldRecurse.includes(propType._tag) ? makeExactType(propType) : propType
    );

    strictConfigDeclaration =
      configDeceleration._tag === "IntersectionType"
        ? t.intersection(exactInterfaces as [t.Any, t.Any])
        : t.union(exactInterfaces as [t.Any, t.Any]);
  } else if ("type" in configDeceleration) {
    strictConfigDeclaration = t.array(makeExactType(configDeceleration.type));
  }

  return strictConfigDeclaration;
}

/** Create a function to validation a configuration based on the configDeceleration  */
export const validateIoConfiguration = (
  name: string,
  configDeceleration: t.Any | t.HasProps
) =>
  /** A function the will validate a configuration based on the configDeceleration */
  async (rc: unknown): Promise<Array<ConfigError | string>> => {
    const looseRc = configDeceleration.decode(rc);
    const errors = reporter(looseRc);

    if (errors) {
      return errors;
    }

    const exactDeclaration = makeExactType(configDeceleration);
    const exactRc = exactDeclaration.decode(rc);

    if (!isRight(looseRc) || !isRight(exactRc)) {
      return [];
    }

    const correctKeys = flatKeys(exactRc.right);
    const unknownTopKeys = Object.keys(looseRc.right).filter(
      (k) => !((k as keyof typeof exactRc.right) in exactRc.right)
    );
    const unknownDeepKeys = flatKeys(
      omit(looseRc.right, unknownTopKeys as any)
    ).filter((k) => !correctKeys.includes(k));
    const unknownKeys = [...unknownTopKeys, ...unknownDeepKeys];

    if (unknownKeys.length === 0) {
      return [];
    }

    if (
      (exactDeclaration as any)._tag === "UnionType" &&
      "types" in exactDeclaration &&
      exactDeclaration.types.every(
        (type) =>
          type._tag === "IntersectionType" || (type as any)._tag === "ExactType"
      )
    ) {
      const decodedTypes = exactDeclaration.types.map((t) => t.decode(rc));
      const matchingMissingMember = decodedTypes.filter((t) => "left" in t)[0];

      if (matchingMissingMember && "left" in matchingMissingMember) {
        const correct = Object.keys(
          matchingMissingMember.left[0].context[0].actual as any
        );
        const missing =
          matchingMissingMember.left[0].context[
            matchingMissingMember.left[0].context.length - 1
          ].key;

        return [
          `${errorPath(
            `"${name}"`
          )}\n\nFound missing configuration keys: when using ${chalk.greenBright.bold(
            correct.join(", ")
          )} you must also provide ${unexpectedValue(missing)}\n`,
        ];
      }

      const matchingCorrectMember = decodedTypes.filter(
        (t) =>
          "right" in t &&
          Object.keys(t.right).length &&
          unknownKeys.every((u) => Object.keys(t.right).includes(u))
      )[0];

      if (matchingCorrectMember) {
        return [];
      }
    }

    return [
      `${errorPath(
        `"${name}"`
      )}\n\nFound unknown configuration keys: ${unexpectedValue(
        unknownKeys.join(", ")
      )}\n`,
    ];
  };

export const validateAutoRc = validateIoConfiguration(".autorc", autoRc);

/** Validate a plugin's configuration. */
export async function validatePluginConfiguration(
  name: string,
  pluginDefinition: t.Any | t.HasProps,
  providedOptions: unknown
) {
  const validateConfig = validateIoConfiguration(name, pluginDefinition);
  const errors = await validateConfig(providedOptions);

  return errors.map((error) => {
    if (typeof error === "string") {
      return error;
    }

    return {
      ...error,
      path: error.path ? `${name}.${error.path}` : name,
    };
  });
}
