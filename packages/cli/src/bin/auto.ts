#!/usr/bin/env node

import moduleAlias from 'module-alias';
import path from 'path';

try {
  // eslint-disable-next-line
  const json = require(path.join(__dirname, '../../package.json'));

  if (json.name.startsWith('@auto-canary')) {
    moduleAlias.addAliases({
      '@auto-it': (fromPath: string, request: string) =>
        request.startsWith('@auto-it') ? '@auto-canary' : '@auto-it'
    });
  }
} catch (error) {}

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
