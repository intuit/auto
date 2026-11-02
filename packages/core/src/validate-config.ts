/* eslint-disable @typescript-eslint/no-explicit-any */

import type { core } from "zod";
import { autoRc, type AutoRc } from "./types";
import type { StandardSchemaV1 } from "./standard-schema";
import createLog from "./utils/logger";
import { AsyncSeriesBailHook } from "tapable";
import chalk from "chalk";
import endent from "endent";

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

type IssuePath = ReadonlyArray<PropertyKey | StandardSchemaV1.PathSegment>;

/** Convert an issue path to the keys it is made of */
function pathKeys(path: IssuePath = []): PropertyKey[] {
  return path.map((segment) =>
    typeof segment === "object" ? segment.key : segment
  );
}

/** Join path keys into a dot path, optionally prefixed */
function joinPath(keys: PropertyKey[], prefix?: string) {
  return [...(prefix ? [prefix] : []), ...keys.map(String)].join(".");
}

/** Look up the value at a path in the raw input */
function getValue(input: unknown, keys: PropertyKey[]) {
  return keys.reduce<any>(
    (value, key) =>
      value !== null && typeof value === "object"
        ? value[key as keyof typeof value]
        : undefined,
    input
  );
}

/** Whether a union member failed only because the value has the wrong type */
function isTypeMismatch(issues: core.$ZodIssue[]) {
  return issues.every(
    (issue) =>
      issue.path.length === 0 &&
      (issue.code === "invalid_type" || issue.code === "invalid_value")
  );
}

/** Describe what a type mismatch expected, e.g. "string" */
function describeExpected(issue: core.$ZodIssue) {
  if (issue.code === "invalid_type") {
    return [`"${issue.expected}"`];
  }

  if (issue.code === "invalid_value") {
    return issue.values.map((value) => JSON.stringify(value));
  }

  return [];
}

interface ReportOptions {
  /** The name the unknown key error is reported under */
  name: string;
  /** Prefixed to every error path */
  prefix?: string;
  /** The raw input, used to report the value at an error path */
  input: unknown;
}

interface Report {
  /** The errors found so far */
  errors: ConfigError[];
  /** The paths of every unknown key found so far */
  unknownKeys: string[];
}

/** Turn an issue that isn't a type error into a string error */
function messageError(
  keys: PropertyKey[],
  message: string,
  options: ReportOptions
) {
  return `${errorPath(
    `"${joinPath(keys, options.prefix) || options.name}"`
  )}\n\n${message}\n`;
}

/** Report Zod issues, reading the extra fields Zod includes */
function reportZodIssues(
  issues: core.$ZodIssue[],
  base: PropertyKey[],
  options: ReportOptions,
  report: Report
) {
  issues.forEach((issue) => {
    const keys = [...base, ...issue.path];

    if (issue.code === "invalid_type" || issue.code === "invalid_value") {
      report.errors.push({
        path: joinPath(keys, options.prefix),
        expectedType: describeExpected(issue).join(" or "),
        value: getValue(options.input, keys),
      });
    } else if (issue.code === "unrecognized_keys") {
      report.unknownKeys.push(
        ...issue.keys.map((key) => joinPath([...keys, key]))
      );
    } else if (issue.code === "invalid_union" && issue.errors.length) {
      // When every member rejects the value's type, report all the types
      // that would have worked. Otherwise report the member that came
      // closest to matching.
      if (issue.errors.every(isTypeMismatch)) {
        const expected = [
          ...new Set(issue.errors.flat().flatMap(describeExpected)),
        ];

        report.errors.push({
          path: joinPath(keys, options.prefix),
          expectedType: expected.join(" or "),
          value: getValue(options.input, keys),
        });
      } else {
        const closest = issue.errors
          .filter((member) => !isTypeMismatch(member))
          .reduce((best, member) =>
            member.length < best.length ? member : best
          );

        reportZodIssues(closest, keys, options, report);
      }
    } else {
      report.errors.push(messageError(keys, issue.message, options));
    }
  });
}

/** Validate a configuration with a Standard Schema */
async function validateConfiguration(
  schema: StandardSchemaV1,
  input: unknown,
  options: Omit<ReportOptions, "input">
): Promise<ConfigError[]> {
  const result = await schema["~standard"].validate(input);

  if (!result.issues) {
    return [];
  }

  const reportOptions = { ...options, input };
  const report: Report = { errors: [], unknownKeys: [] };

  if (schema["~standard"].vendor === "zod") {
    reportZodIssues(
      result.issues as core.$ZodIssue[],
      [],
      reportOptions,
      report
    );
  } else {
    report.errors.push(
      ...result.issues.map((issue) =>
        messageError(pathKeys(issue.path), issue.message, reportOptions)
      )
    );
  }

  if (report.unknownKeys.length) {
    report.errors.unshift(
      `${errorPath(
        `"${options.name}"`
      )}\n\nFound unknown configuration keys: ${unexpectedValue(
        report.unknownKeys.join(", ")
      )}\n`
    );
  }

  return report.errors;
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

/** Validate the .autorc */
export const validateAutoRc = (rc: unknown) =>
  validateConfiguration(autoRc, rc, { name: ".autorc" });

/** Whether a value implements the Standard Schema interface */
function isStandardSchema(value: unknown): value is StandardSchemaV1 {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    "~standard" in value
  );
}

/**
 * Validate a plugin's options with its options schema.
 * The options schema can come from any library that implements
 * Standard Schema (https://standardschema.dev), such as Zod.
 */
export async function validatePluginConfiguration(
  name: string,
  optionsSchema: StandardSchemaV1,
  providedOptions: unknown
): Promise<ConfigError[]> {
  if (!isStandardSchema(optionsSchema)) {
    createLog().log.warn(
      `The "${name}" plugin's options schema isn't a Standard Schema, so its options weren't validated. auto no longer supports io-ts options schemas: update the plugin, or ask its author to.`
    );

    return [];
  }

  return validateConfiguration(optionsSchema, providedOptions, {
    name,
    prefix: name,
  });
}
