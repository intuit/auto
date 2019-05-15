#!/usr/bin/env node

import Auto from '@intuit-auto/core';
import { CliArgs } from './commands';

export async function run(args: CliArgs) {
  const auto = new Auto(args);

  switch (args.command) {
    case 'init':
      await auto.init(args);
      break;
    case 'create-labels':
      await auto.loadConfig();
      await auto.createLabels(args);
      break;
    case 'label':
      await auto.loadConfig();
      await auto.label(args);
      break;
    case 'pr-check':
      await auto.loadConfig();
      await auto.prCheck(args);
      break;
    case 'pr-status':
      await auto.loadConfig();
      await auto.prStatus(args);
      break;
    case 'comment':
      await auto.loadConfig();
      await auto.comment(args);
      break;
    case 'pr-body':
      await auto.loadConfig();
      await auto.prBody(args);
      break;
    case 'version':
      await auto.loadConfig();
      await auto.version();
      break;
    case 'changelog':
      await auto.loadConfig();
      await auto.changelog(args);
      break;
    case 'release':
      await auto.loadConfig();
      await auto.runRelease(args);
      break;
    case 'shipit':
      await auto.loadConfig();
      await auto.shipit(args);
      break;
    case 'canary':
      await auto.loadConfig();
      await auto.canary(args);
      break;
    default:
      throw new Error(`idk what i'm doing.`);
  }
}

export default async function main(args: CliArgs) {
  try {
    await run(args);
  } catch (error) {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
