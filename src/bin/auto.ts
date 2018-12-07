#!/usr/bin/env node

import chalk from 'chalk';
import parseArgs from '../cli/args';
import main from '../main';

main(parseArgs()).catch((e: Error) => {
  console.error(chalk.redBright('Error: '), e.message);
  process.exit(1);
});
