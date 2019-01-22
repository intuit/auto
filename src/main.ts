#!/usr/bin/env node

import AutoRelease from './auto';

import {
  ArgsType,
  IChangelogOptions,
  ICommentCommandOptions,
  ICreateLabelsCommandOptions,
  IInitCommandOptions,
  ILabelCommandOptions,
  IPRCheckCommandOptions,
  IPRCommandOptions,
  IReleaseCommandOptions,
  IShipItCommandOptions
} from './cli/args';

export async function run(args: ArgsType) {
  const auto = new AutoRelease(args);

  switch (args.command) {
    case 'init':
      await auto.init(args as IInitCommandOptions);
      break;
    case 'create-labels':
      await auto.loadConfig();
      await auto.createLabels(args as ICreateLabelsCommandOptions);
      break;
    case 'label':
      await auto.loadConfig();
      await auto.label(args as ILabelCommandOptions);
      break;
    case 'pr-check':
      await auto.loadConfig();
      await auto.prCheck(args as IPRCheckCommandOptions);
      break;
    case 'pr':
      await auto.loadConfig();
      await auto.pr(args as IPRCommandOptions);
      break;
    case 'comment':
      await auto.loadConfig();
      await auto.comment(args as ICommentCommandOptions);
      break;
    case 'version':
      await auto.loadConfig();
      await auto.version();
      break;
    case 'changelog':
      await auto.loadConfig();
      await auto.changelog(args as IChangelogOptions);
      break;
    case 'release':
      await auto.loadConfig();
      await auto.runRelease(args as IReleaseCommandOptions);
      break;
    case 'shipit':
      await auto.loadConfig();
      await auto.shipit(args as IShipItCommandOptions);
      break;
    default:
      throw new Error(`idk what i'm doing.`);
  }
}

export default async function main(args: ArgsType) {
  try {
    await run(args);
  } catch (error) {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

// Plugin Utils

export { ILogger } from './utils/logger';
export { IPlugin } from './utils/load-plugins';
export { default as AutoRelease } from './auto';
export { default as SEMVER } from './semver';
export { default as execPromise } from './utils/exec-promise';
