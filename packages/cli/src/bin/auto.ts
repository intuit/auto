#!/usr/bin/env node

import chalk from 'chalk';
import parseArgs from '../parse-args';
import run from '../run';

const [command, args] = parseArgs();

if (command && args) {
  run(command, args).catch((e: Error) => {
    console.error(chalk.redBright('Error: '), e.message);
    process.exit(1);
  });
}
