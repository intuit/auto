#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const endent = require('endent');
const docs = require('command-line-docs').default;
const { commands } = require('../packages/cli/dist/parse-args');

const initCommands = [
  endent`
    # Initialization

    \`auto\` provides some tools to quickly set up your project. If you do not want to use the interactive experience all these options can be configured via the [.autorc](./autorc.md) and most can be configure via CLI options.\n
  `
];

commands.map(command => {
  if (command.name === 'init' || command.name === 'create-labels') {
    initCommands.push(docs(command, { depth: 2 }).replace(/{green \$} /g, ''));

    if (command.name === 'create-labels') {
      initCommands.push(
        endent`
          ::: message is-warning
          :warning: For this to work you must have a \`GH_TOKEN\` set, ex: \`GH_TOKEN=YOUR_TOKEN auto create-labels\`
          :::
        `
      );
    }
  }
});

try {
  fs.mkdirSync(path.join(__dirname, './pages/generated'));
} catch (error) {}

fs.writeFileSync(
  path.join(__dirname, './pages/generated/init.md'),
  initCommands.join('\n')
);

commands.map(command => {
  const lines = [docs(command).replace(/{green \$} /g, '')];
  const extra = path.join(__dirname, `./pages/extras/${command.name}.md`);

  if (command.name === 'init' || command.name === 'create-labels') {
    return;
  }

  if (fs.existsSync(extra)) {
    lines.push(fs.readFileSync(extra, 'utf8'));
  }

  fs.writeFileSync(
    path.join(__dirname, `./pages/generated/${command.name}.md`),
    lines.join('\n')
  );
});
