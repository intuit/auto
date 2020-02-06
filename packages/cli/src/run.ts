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
  INextOptions
} from '@auto-it/core';

/** Spin up the "auto" node API and provide it the parsed CLI args. */
export async function run(command: string, args: ApiOptions) {
  const auto = new Auto(args);

  if (command === 'init') {
    await auto.init();
    return;
  }

  await auto.loadConfig();

  if (args.verbose || command === 'info') {
    await auto.info();
  }

  if (command === 'info') {
    return;
  }

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

/** Run "auto" for a given command. */
export default async function main(command: string, args: ApiOptions) {
  try {
    await run(command, args);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
