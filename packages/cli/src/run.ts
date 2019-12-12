#!/usr/bin/env node

import Auto, {
  ApiOptions,
  ICanaryOptions,
  IChangelogOptions,
  ICommentOptions,
  ICreateLabelsOptions,
  IInitOptions,
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

  switch (command) {
    case 'init':
      await auto.init(args as IInitOptions);
      break;
    case 'create-labels':
      await auto.loadConfig();
      await auto.createLabels(args as ICreateLabelsOptions);
      break;
    case 'label':
      await auto.loadConfig();
      await auto.label(args as ILabelOptions);
      break;
    case 'pr-check':
      await auto.loadConfig();
      await auto.prCheck(args as IPRCheckOptions);
      break;
    case 'pr-status':
      await auto.loadConfig();
      await auto.prStatus(args as IPRStatusOptions);
      break;
    case 'comment':
      await auto.loadConfig();
      await auto.comment(args as ICommentOptions);
      break;
    case 'pr-body':
      await auto.loadConfig();
      await auto.prBody(args as IPRBodyOptions);
      break;
    case 'version':
      await auto.loadConfig();
      await auto.version(args as IVersionOptions);
      break;
    case 'changelog':
      await auto.loadConfig();
      await auto.changelog(args as IChangelogOptions);
      break;
    case 'release':
      await auto.loadConfig();
      await auto.runRelease(args as IReleaseOptions);
      break;
    case 'shipit':
      await auto.loadConfig();
      await auto.shipit(args as IShipItOptions);
      break;
    case 'canary':
      await auto.loadConfig();
      await auto.canary(args as ICanaryOptions);
      break;
    case 'next':
      await auto.loadConfig();
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
    if (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
