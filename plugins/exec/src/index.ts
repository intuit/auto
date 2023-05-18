/* eslint-disable @typescript-eslint/no-explicit-any */

import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import {
  makeHooks,
  makeReleaseHooks,
  makeLogParseHooks,
  makeChangelogHooks,
} from "@auto-it/core/dist/utils/make-hooks";
import * as t from "io-ts";
import fromEntries from "fromentries";
import endent from "endent";
import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";

type CommandMap = Record<string, string | undefined>;

/** Safely trim the value if it's a string */
function trim(val?: string | Buffer) {
  if (typeof val === "string") {
    return val.trim();
  }
}

/** Convert a "makeHooks" function into an io-ts interface */
function makeHooksType<HookObject, ExcludedHook extends keyof HookObject>(
  hookCreatorFn: () => HookObject,
  exclude: ExcludedHook[]
) {
  type HookType = keyof HookObject;
  const hooks = Object.keys(hookCreatorFn()) as HookType[];

  return t.partial(
    fromEntries(
      hooks
        .map((name) => [name, t.string] as const)
        .filter(([hook]) => !exclude.includes(hook as any))
    ) as Record<Exclude<HookType, typeof exclude[number]>, t.StringC>
  );
}

const onCreateChangelog = makeHooksType(makeChangelogHooks, []);
const onCreateLogParse = makeHooksType(makeLogParseHooks, []);
const onCreateRelease = makeHooksType(makeReleaseHooks, [
  "onCreateChangelog",
  "onCreateLogParse",
]);
const rootOptions = makeHooksType(makeHooks, [
  "onCreateRelease",
  "onCreateChangelog",
  "onCreateLogParse",
  "validateConfig",
]);

const pluginOptions = t.intersection([
  rootOptions,
  t.partial({ onCreateRelease, onCreateLogParse, onCreateChangelog }),
]);

export type IExecPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Put args in envirnment */
const createEnv = (args: any[]) => ({
  ...process.env,
  ...fromEntries(
    args.map((arg, index) => [`ARG_${index}`, JSON.stringify(arg)])
  ),
});

/** Wraps execSync around debugging and error handling */
const runExecSync = (
  command: string,
  options: ExecSyncOptionsWithStringEncoding | undefined,
  auto: Auto
): string | undefined => {
  let execResult;

  try {
    auto.logger.verbose.info(`Running command: ${command}`);
    auto.logger.veryVerbose.info(endent`
    Supplied Environment (name and char size):

    ${Object.entries(options?.env || {})
      .map(([key, value]) => `\t${key}=${value ? value.length : 0}`)
      .join("\n")}
    `);

    execResult = trim(execSync(command, options));
  } catch (e) {
    if (e && e.code === "E2BIG") {
      auto.logger.log.error(endent`
        Received E2BIG from execSync.

        This usually occurs when the argument list is too large for the command you are trying to run.

        Please consider disabling your 'auto-exec' usage and following this issue for updates: https://github.com/intuit/auto/issues/1294
      `);
    } else {
      auto.logger.log.error(e);
    }

    process.exit(1);
  }

  return execResult;
};

/** Tap a hook if possible */
const tapHook = (name: string, hook: any, command: string, auto: Auto) => {
  if (!hook) {
    return;
  }

  const hookType = hook.constructor.name;

  if (
    name === "getRepository" ||
    name === "getAuthor" ||
    name === "makeRelease" ||
    name === "modifyConfig" ||
    name === "next" ||
    name === "canary" ||
    name === "parseCommit" ||
    name === "addToBody" ||
    name === "renderChangelogLine" ||
    name === "renderChangelogTitle" ||
    name === "renderChangelogAuthor" ||
    name === "renderChangelogAuthorLine"
  ) {
    hook.tap(`exec ${name}`, (...args: any[]) => {
      const value = trim(
        runExecSync(
          command,
          {
            stdio: ["ignore", "pipe", "inherit"],
            encoding: "utf8",
            env: createEnv(args),
          },
          auto
        )
      );

      if (!value) {
        return;
      }

      if (name !== "canary") {
        return JSON.parse(value);
      }

      try {
        return JSON.parse(value);
      } catch (error) {
        // canary hook can just return a string
        return value;
      }
    });
  } else if (name === "omitCommit" || name === "omitReleaseNotes") {
    hook.tap(`exec ${name}`, (...args: any[]) => {
      const value = trim(
        runExecSync(
          command,
          {
            stdio: ["ignore", "pipe", "inherit"],
            encoding: "utf8",
            env: createEnv(args),
          },
          auto
        )
      );

      if (value === "true") {
        return true;
      }
    });
  } else if (
    hookType === "SyncHook" ||
    hookType === "AsyncSeriesHook" ||
    hookType === "AsyncParallelHook" ||
    name === "createChangelogTitle" ||
    name === "getPreviousVersion"
  ) {
    hook.tap(`exec ${name}`, (...args: any[]) =>
      trim(
        runExecSync(
          command,
          {
            encoding: "utf8",
            env: createEnv(args),
            stdio:
              name === "createChangelogTitle" || name === "getPreviousVersion"
                ? ["ignore", "pipe", "inherit"]
                : "inherit",
          },
          auto
        )
      )
    );
  }
};

/** Tap into select hooks and run a command on the terminal */
export default class ExecPlugin implements IPlugin {
  /** The name of the plugin */
  name = "exec";

  /** The options of the plugin */
  readonly options: IExecPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IExecPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    Object.entries(this.options).forEach(
      ([name, command]) =>
        command && this.applyHook(auto, name, command as string | CommandMap)
    );
  }

  /** Apply a hook to auto */
  private applyHook(auto: Auto, key: string, command: string | CommandMap) {
    const name = key as keyof IExecPluginOptions;

    if (name === "onCreateRelease") {
      auto.hooks.onCreateRelease.tap(this.name, (release) => {
        Object.entries(command as CommandMap).map(
          ([key, command]) =>
            command &&
            tapHook(
              key,
              release.hooks[key as keyof typeof release.hooks],
              command,
              auto
            )
        );
      });
    } else if (name === "onCreateChangelog") {
      auto.hooks.onCreateChangelog.tap(this.name, (changelog) => {
        Object.entries(command as CommandMap).map(
          ([key, command]) =>
            command &&
            tapHook(
              key,
              changelog.hooks[key as keyof typeof changelog.hooks],
              command,
              auto
            )
        );
      });
    } else if (name === "onCreateLogParse") {
      auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
        Object.entries(command as CommandMap).map(
          ([key, command]) =>
            command &&
            tapHook(
              key,
              logParse.hooks[key as keyof typeof logParse.hooks],
              command,
              auto
            )
        );
      });
    } else {
      tapHook(name, auto.hooks[name], command as string, auto);
    }
  }
}
