#!/usr/bin/env node

import Auto, {
  ApiOptions,
  ICanaryOptions,
  IChangelogOptions,
  ICommentOptions,
  ICreateLabelsOptions,
  ILabelOptions,
  IPRBodyOptions,
  IPRCheckOptions,
  IPRStatusOptions,
  IReleaseOptions,
  IShipItOptions,
  IVersionOptions,
  INextOptions,
  inFolder
} from '@auto-it/core';
import { ReleasesPackage } from '@auto-it/core/src/types';

/** How to run auto for a single package repo */
async function singlePackageReleaseCommands(
  auto: Auto,
  command: string,
  args: ApiOptions
) {
  switch (command) {
    case 'version':
      await auto.version(args as IVersionOptions);
      break;
    case 'changelog':
      await auto.changelog(args as IChangelogOptions);
      break;
    case 'release':
      await auto.runRelease(args as IReleaseOptions);
      break;
    case 'shipit':
      await auto.shipit(args as IShipItOptions);
      break;
    case 'canary':
      await auto.canary(args as ICanaryOptions);
      break;
    case 'next':
      await auto.next(args as INextOptions);
      break;
    default:
      throw new Error(`idk what i'm doing.`);
  }
}

/** Create an auto instance for a package */
async function createSubAuto(p: ReleasesPackage, args: ApiOptions) {
  const subAuto = new Auto({ ...args, hasMultiplePackages: true });

  await subAuto.loadConfig(p);

  subAuto.hooks.onCreateLogParse.tap('Multi Packages', logParse => {
    logParse.hooks.omitCommit.tap(
      'Multi Package',
      commit => !commit.files.some(file => inFolder(p.target, file))
    );
  });

  return subAuto;
}

/** Run an async operation on each data item in serial */
async function runInSerial<T, R>(data: T[], cb: (item: T) => Promise<R>) {
  return data.reduce(async (last, current) => {
    await last;
    await cb(current);
  }, Promise.resolve());
}

/** How to run auto for a single package repo */
async function multiPackageReleaseCommands(
  auto: Auto,
  command: string,
  args: ApiOptions
) {
  if (!auto.config?.packages) {
    return;
  }

  switch (command) {
    case 'version':
      await Promise.all(
        auto.config.packages.map(async p => {
          const subAuto = await createSubAuto(p, args);
          await singlePackageReleaseCommands(subAuto, command, args);
        })
      );
      break;

    case 'changelog': {
      const rootDir = process.cwd();

      await auto.config.packages.reduce(async (last, p) => {
        await last;

        process.chdir(p.target);
        const subAuto = await createSubAuto(p, args);
        await subAuto.makeChangelog(args as IChangelogOptions);

        process.chdir(rootDir);
      }, Promise.resolve());

      if (!('dryRun' in args) || !args.dryRun) {
        await auto.commitChangelog();
      }

      break;
    }

    case 'release':
      await runInSerial(auto.config.packages, async p => {
        const subAuto = await createSubAuto(p, args);
        await subAuto.makeRelease(args as IReleaseOptions);
      });
      break;
    // case 'canary':
    //   await auto.canary(args as ICanaryOptions);
    //   break;
    // case 'shipit':
    //   await auto.shipit(args as IShipItOptions);
    //   break;
    // case 'next':
    //   await auto.next(args as INextOptions);
    //   break;

    default:
      throw new Error(`idk what i'm doing.`);
  }
}

/** Spin up the "auto" node API and provide it the parsed CLI args. */
export async function run(command: string, args: ApiOptions) {
  const auto = new Auto(args);

  if (command === 'init') {
    await auto.init();
    return;
  }

  await auto.loadConfig();

  // PR Interaction Commands
  switch (command) {
    case 'create-labels':
      await auto.createLabels(args as ICreateLabelsOptions);
      break;
    case 'label':
      await auto.label(args as ILabelOptions);
      break;
    case 'pr-check':
      await auto.prCheck(args as IPRCheckOptions);
      break;
    case 'pr-status':
      await auto.prStatus(args as IPRStatusOptions);
      break;
    case 'comment':
      await auto.comment(args as ICommentOptions);
      break;
    case 'pr-body':
      await auto.prBody(args as IPRBodyOptions);
      break;
    default:
      break;
  }

  // Release Management Commands
  if (auto.config?.packages) {
    await multiPackageReleaseCommands(auto, command, args);
  } else {
    await singlePackageReleaseCommands(auto, command, args);
  }
}

/** Run "auto" for a given command. */
export default async function main(command: string, args: ApiOptions) {
  try {
    await run(command, args);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
