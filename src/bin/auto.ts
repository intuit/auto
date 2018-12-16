#!/usr/bin/env node

import chalk from 'chalk';
import parseArgs from '../cli/args';
import main from '../main';

const args = parseArgs();

if (args) {
  main(args).catch((e: Error) => {
    console.error(chalk.redBright('Error: '), e.message);
    process.exit(1);
  });
}
