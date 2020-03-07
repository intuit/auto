/* eslint-disable @typescript-eslint/no-explicit-any */

import { Auto, IPlugin, validatePluginConfiguration } from '@auto-it/core';
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
type ChangelogHook = keyof ReturnType<typeof makeChangelogHooks>;
const changelogHooks = Object.keys(makeChangelogHooks()) as ChangelogHook[];

const onCreateChangelog = t.partial(
  fromEntries(changelogHooks.map(name => [name, t.string] as const)) as Record<
    ChangelogHook,
    t.StringC
  >
);

type LogParseHook = keyof ReturnType<typeof makeLogParseHooks>;
const logParseHooks = Object.keys(makeLogParseHooks()) as LogParseHook[];

const onCreateLogParse = t.partial(
  fromEntries(logParseHooks.map(name => [name, t.string] as const)) as Record<
    LogParseHook,
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
  'onCreateLogParse',
  'validateConfig'
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

/** Put args in envirnment */
const createEnv = (args: any[]) => ({
  ...process.env,
  ...fromEntries(
    args.map((arg, index) => [`ARG_${index}`, JSON.stringify(arg)])
  )
});

/** Tap a hook if possible */
const tapHook = (name: string, hook: any, command: string) => {
  if (!hook) {
    return;
  }

  const hookType = hook.constructor.name;

  if (
    name === 'getRepository' ||
    name === 'getAuthor' ||
    name === 'makeRelease' ||
    name === 'modifyConfig' ||
    name === 'next' ||
    name === 'canary' ||
    name === 'parseCommit' ||
    name === 'addToBody' ||
    name === 'renderChangelogLine' ||
    name === 'renderChangelogTitle' ||
    name === 'renderChangelogAuthor' ||
    name === 'renderChangelogAuthorLine'
  ) {
    hook.tap(`exec ${name}`, (...args: any[]) => {
      const value = execSync(command, {
        stdio: ['ignore', 'pipe', 'inherit'],
        encoding: 'utf8',
        env: createEnv(args)
      }).trim();

      if (name !== 'canary') {
        return JSON.parse(value);
      }

      try {
        return JSON.parse(value);
      } catch (error) {
        // canary hook can just return a string
        return value;
      }
    });
  } else if (name === 'omitCommit' || name === 'omitReleaseNotes') {
    hook.tap(`exec ${name}`, (...args: any[]) => {
      const value = execSync(command, {
        stdio: ['ignore', 'pipe', 'inherit'],
        encoding: 'utf8',
        env: createEnv(args)
      }).trim();

      if (value === 'true') {
        return true;
      }
    });
  } else if (
    hookType === 'SyncHook' ||
    hookType === 'AsyncSeriesHook' ||
    hookType === 'AsyncParallelHook' ||
    name === 'createChangelogTitle' ||
    name === 'getPreviousVersion'
  ) {
    hook.tap(`exec ${name}`, (...args: any[]) =>
      execSync(command, {
        encoding: 'utf8',
        env: createEnv(args),
        stdio:
          name === 'createChangelogTitle' || name === 'getPreviousVersion'
            ? ['ignore', 'pipe', 'inherit']
            : 'inherit'
      }).trim()
    );
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

    if (name === 'onCreateRelease') {
      auto.hooks.onCreateRelease.tap(this.name, release => {
        Object.entries(command as CommandMap).map(
          ([key, command]) =>
            command &&
            tapHook(
              key,
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
              key,
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
              key,
              logParse.hooks[key as keyof typeof logParse.hooks],
              command
            )
        );
      });
    } else {
      tapHook(name, auto.hooks[name], command as string);
    }
  }
}
