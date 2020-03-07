/* eslint-disable @typescript-eslint/no-explicit-any */

import { Auto, IPlugin } from '@auto-it/core';
import {
  makeHooks,
  makeReleaseHooks,
  makeLogParseHooks,
  makeChangelogHooks
} from '@auto-it/core/dist/utils/make-hooks';
import * as t from 'io-ts';
import fromEntries from 'fromentries';
import { execSync } from 'child_process';

type CommandMap = Record<string, string | undefined>;
type ChangelogHooks = keyof ReturnType<typeof makeChangelogHooks>;
const changelogHooks = Object.keys(makeChangelogHooks()) as ChangelogHooks[];

const onCreateChangelog = t.partial(
  fromEntries(changelogHooks.map(name => [name, t.string] as const)) as Record<
    ChangelogHooks,
    t.StringC
  >
);

type LogParseHooks = keyof ReturnType<typeof makeLogParseHooks>;
const logParseHooks = Object.keys(makeLogParseHooks()) as LogParseHooks[];

const onCreateLogParse = t.partial(
  fromEntries(logParseHooks.map(name => [name, t.string] as const)) as Record<
    LogParseHooks,
    t.StringC
  >
);

type ReleaseHook = keyof ReturnType<typeof makeReleaseHooks>;
const releaseHooks = Object.keys(makeReleaseHooks()) as ReleaseHook[];

const onCreateReleaseOptions = [
  'onCreateChangelog',
  'onCreateLogParse'
] as const;

const onCreateRelease = t.partial(
  fromEntries(
    releaseHooks
      .map(name => [name, t.string] as const)
      .filter(([hook]) => !onCreateReleaseOptions.includes(hook as any))
  ) as Record<
    Exclude<ReleaseHook, typeof onCreateReleaseOptions[number]>,
    t.StringC
  >
);

type RootHook = keyof ReturnType<typeof makeHooks>;
const rootHooks = Object.keys(makeHooks()) as RootHook[];

const complextRootOptions = [
  'onCreateRelease',
  'onCreateChangelog',
  'onCreateLogParse'
] as const;
const rootOptions = t.partial(
  fromEntries(
    rootHooks
      .map(name => [name, t.string] as const)
      .filter(([hook]) => !complextRootOptions.includes(hook as any))
  ) as Record<Exclude<RootHook, typeof complextRootOptions[number]>, t.StringC>
);

const pluginOptions = t.intersection([
  rootOptions,
  t.partial({ onCreateRelease, onCreateLogParse, onCreateChangelog })
]);

export type IExecPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Tap a hook if possible */
const tapHook = (auto: Auto, hook: any, command: string) => {
  const name = hook.constructor.name;

  if (
    name === 'SyncWaterfallHook' ||
    name === 'AsyncSeriesBailHook' ||
    name === 'AsyncSeriesWaterfallHook'
  ) {
    auto.logger.log.error(
      `"${name}" cannot easily be used from the "exec" plugin. Please consider writing your own plugin in JavaScript or TypeScript.`
    );
    process.exit(1);
  } else if (
    name === 'SyncHook' ||
    name === 'AsyncSeriesHook' ||
    name === 'AsyncParallelHook'
  ) {
    hook.tap(`exec ${name}`, (...args: any[]) => {
      execSync(command, {
        stdio: 'inherit',
        env: {
          ...process.env,
          ...fromEntries(
            args.map((arg, index) => [`ARG_${index}`, JSON.stringify(arg)])
          )
        }
      });
    });
  }
};

/** Tap into select hooks and run a command on the terminal */
export default class ExecPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'exec';

  /** The options of the plugin */
  readonly options: IExecPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IExecPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    Object.entries(this.options).forEach(
      ([name, command]) => command && this.applyHook(auto, name, command)
    );
  }

  /** Apply a hook to auto */
  private applyHook(auto: Auto, key: string, command: string | CommandMap) {
    const name = key as keyof IExecPluginOptions;

    if (name === 'onCreateRelease') {
      auto.hooks.onCreateRelease.tap(this.name, release => {
        Object.entries(command as CommandMap).map(
          ([key, command]) =>
            command &&
            tapHook(
              auto,
              release.hooks[key as keyof typeof release.hooks],
              command
            )
        );
      });
    } else if (name === 'onCreateChangelog') {
      auto.hooks.onCreateChangelog.tap(this.name, changelog => {
        Object.entries(command as CommandMap).map(
          ([key, command]) =>
            command &&
            tapHook(
              auto,
              changelog.hooks[key as keyof typeof changelog.hooks],
              command
            )
        );
      });
    } else if (name === 'onCreateLogParse') {
      auto.hooks.onCreateLogParse.tap(this.name, logParse => {
        Object.entries(command as CommandMap).map(
          ([key, command]) =>
            command &&
            tapHook(
              auto,
              logParse.hooks[key as keyof typeof logParse.hooks],
              command
            )
        );
      });
    } else {
      tapHook(auto, auto.hooks[name], command as string);
    }
  }
}
