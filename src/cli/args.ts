import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import signale from 'signale';

const p = chalk.hex('#870048');
const y = chalk.hex('#F1A60E');
const r = chalk.hex('#C5000B');
const g = chalk.hex('#888888');

// prettier-ignore
const logo = `
      ${y('_________')}
     ${p('/')}${y('\\       /')}${r('\\')}                   _______ _     _ _______  _____
    ${p('/')}  ${y('\\_____/')}  ${r('\\')}                  |_____| |     |    |    |     |
   ${p('/   /')}     ${r('\\   \\')}                 |     | |_____|    |    |_____|
  ${p('/___/')} \\▔▔\\ ${r(' \\___\\')}
  ${g('\\   \\')}  \\_/  ${g('/   /')}     ______ _______        _______ _______ _______ _______
   ${g('\\   \\')}     ${g('/   /')}     |_____/ |______ |      |______ |_____| |______ |______
    ${g('\\   ▔▔▔▔▔   /')}      |    \\_ |______ |_____ |______ |     | ______| |______
     ${g('\\         /')}
      ${g('▔▔▔▔▔▔▔▔▔ ')}
`;

const help: commandLineUsage.OptionDefinition = {
  name: 'help',
  alias: 'h',
  type: Boolean
};

const version = {
  name: 'version',
  alias: 'V',
  type: Boolean,
  description: "Display auto's version"
};

const mainDefinitions = [
  { name: 'command', type: String, defaultOption: true },
  {
    ...help,
    description: 'Display the help output. Works on each command as well'
  },
  version
];

const defaultOptions = [
  {
    ...help,
    description: 'Display the help output for the command',
    group: 'misc'
  },
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    description: 'Show some more logs',
    group: 'misc'
  },
  {
    name: 'very-verbose',
    alias: 'w',
    type: Boolean,
    description: 'Show a lot more logs',
    group: 'misc'
  },
  {
    name: 'repo',
    type: String,
    description:
      'The repo to set the status on. Defaults to looking in the package definition for the platform',
    group: 'misc'
  },
  {
    name: 'owner',
    type: String,
    description:
      'The owner of the GitHub repo. Defaults to reading from the package definition for the platform',
    group: 'misc'
  },
  {
    name: 'github-api',
    type: String,
    description: 'GitHub API to use',
    group: 'misc'
  },
  {
    name: 'plugins',
    type: String,
    multiple: true,
    description: 'Plugins to load auto with. (defaults to just npm)',
    group: 'misc'
  }
];

const pr: commandLineUsage.OptionDefinition = {
  name: 'pr',
  type: Number,
  description: 'The pull request number you want the labels of',
  group: 'main'
};

const dryRun: commandLineUsage.OptionDefinition = {
  name: 'dry-run',
  alias: 'd',
  type: Boolean,
  description: 'Report what command will do but do not actually do anything',
  group: 'main'
};

const url: commandLineUsage.OptionDefinition = {
  name: 'url',
  type: String,
  description: 'URL to associate with this status',
  group: 'main'
};

const noVersionPrefix: commandLineUsage.OptionDefinition = {
  name: 'no-version-prefix',
  type: Boolean,
  description: "Use the version as the tag without the 'v' prefix",
  group: 'main'
};

const jira: commandLineUsage.OptionDefinition = {
  name: 'jira',
  type: String,
  description: 'Jira base URL',
  group: 'main'
};

const name: commandLineUsage.OptionDefinition = {
  name: 'name',
  type: String,
  description:
    'Git name to commit and release with. Defaults to package definition for the platform',
  group: 'main'
};

const email: commandLineUsage.OptionDefinition = {
  name: 'email',
  type: String,
  description:
    'Git email to commit with. Defaults to package definition for the platform',
  group: 'main'
};

const context: commandLineUsage.OptionDefinition = {
  name: 'context',
  type: String,
  description: 'A string label to differentiate this status from others',
  group: 'main'
};

const message: commandLineUsage.OptionDefinition = {
  name: 'message',
  group: 'main',
  type: String,
  alias: 'm'
};

const skipReleaseLabels: commandLineUsage.OptionDefinition = {
  name: 'skip-release-labels',
  type: String,
  group: 'main',
  multiple: true,
  description:
    "Labels that will not create a release. Defaults to just 'skip-release'"
};

interface ICommand {
  name: string;
  summary: string;
  options?: commandLineUsage.OptionDefinition[];
  require?: Flags[];
  examples: any[];
}

const commands: ICommand[] = [
  {
    name: 'init',
    summary: 'Interactive setup for most configurable options',
    examples: ['{green $} auto init'],
    options: [
      {
        name: 'only-labels',
        type: Boolean,
        group: 'main',
        description:
          'Only run init for the labels. As most other options are for advanced users'
      },
      dryRun
    ]
  },
  {
    name: 'create-labels',
    summary:
      "Create your project's labels on github. If labels exist it will update them.",
    examples: ['{green $} auto create-labels'],
    options: [...defaultOptions, dryRun]
  },
  {
    name: 'label',
    summary: 'Get the labels for a pull request',
    options: [
      { ...pr, description: `${pr.description} (defaults to last merged PR)` },
      ...defaultOptions
    ],
    examples: ['{green $} auto label --pr 123']
  },
  {
    name: 'pr-check',
    summary: 'Check that a pull request has a SemVer label',
    require: ['pr', 'url'],
    options: [
      pr,
      url,
      dryRun,
      {
        ...context,
        defaultValue: 'ci/pr-check'
      },
      skipReleaseLabels,
      ...defaultOptions
    ],
    examples: [
      '{green $} auto pr-check --pr 32 --url http://your-ci.com/build/123'
    ]
  },
  {
    name: 'pr',
    summary: 'Set the status on a PR commit',
    require: ['state', 'url', 'description', 'context'],
    options: [
      {
        name: 'sha',
        type: String,
        group: 'main',
        description:
          'Specify a custom git sha. Defaults to the HEAD for a git repo in the current repository'
      },
      { ...pr, description: 'PR to set the status on' },
      url,
      {
        name: 'state',
        type: String,
        group: 'main',
        description:
          "State of the PR. ['pending', 'success', 'error', 'failure']"
      },
      {
        name: 'description',
        type: String,
        group: 'main',
        description: 'A description of the status'
      },
      {
        name: 'context',
        type: String,
        group: 'main',
        description: 'A string label to differentiate this status from others'
      },
      dryRun,
      ...defaultOptions
    ],
    examples: [
      `{green $} auto pr \\\\ \n   --pr 32 \\\\ \n   --state pending \\\\ \n   --description "Build still running..." \\\\ \n   --context build-check`
    ]
  },
  {
    name: 'version',
    summary: 'Get the semantic version bump for the given changes.',
    options: [
      {
        name: 'only-publish-with-release-label',
        type: Boolean,
        description: "Only bump version if 'release' label is on pull request",
        group: 'main'
      },
      skipReleaseLabels,
      ...defaultOptions
    ],
    examples: [
      {
        desc: 'Get the new version using the last release to head',
        example: '{green $} auto version'
      },
      {
        desc: 'Skip releases with multiple labels',
        example: '{green $} auto version --skip-release-labels documentation CI'
      }
    ]
  },
  {
    name: 'changelog',
    summary: "Prepend release notes to 'CHANGELOG.md'",
    options: [
      dryRun,
      noVersionPrefix,
      name,
      email,
      jira,
      {
        name: 'from',
        type: String,
        group: 'main',
        description:
          'Tag to start changelog generation on. Defaults to latest tag.'
      },
      {
        name: 'to',
        type: String,
        group: 'main',
        description: 'Tag to end changelog generation on. Defaults to HEAD.'
      },
      {
        ...message,
        description:
          "Message to commit the changelog with. Defaults to 'Update CHANGELOG.md [skip ci]'"
      },
      ...defaultOptions
    ],
    examples: [
      {
        desc: 'Generate a changelog from the last release to head',
        example: '{green $} auto changelog'
      },
      {
        desc: 'Generate a changelog across specific versions',
        example: '{green $} auto changelog --from v0.20.1 --to v0.21.0'
      }
    ]
  },
  {
    name: 'release',
    summary: 'Auto-generate a github release',
    options: [
      dryRun,
      noVersionPrefix,
      name,
      email,
      jira,
      {
        name: 'use-version',
        type: String,
        group: 'main',
        description:
          'Version number to publish as. Defaults to reading from the package definition for the platform.'
      },
      {
        name: 'slack',
        alias: 's',
        type: String,
        group: 'main',
        description:
          'Url to post a slack message to about the release. Make sure the SLACK_TOKEN environment variable is set.'
      },
      ...defaultOptions
    ],
    examples: ['{green $} auto release']
  },
  {
    name: 'comment',
    summary: 'Comment on a pull request with a markdown message',
    require: ['message'],
    options: [
      pr,
      context,
      { ...message, description: 'Message to post to comment' },
      dryRun,
      ...defaultOptions
    ],
    examples: [
      '{green $} auto comment --pr 123 --comment "# Why you\'re wrong..."'
    ]
  },
  {
    name: 'shipit',
    summary:
      'Run the full `auto` release pipeline. Detects if in a lerna project',
    examples: ['{green $} auto shipit'],
    options: [...defaultOptions, dryRun]
  }
];

function filterCommands(allCommands: ICommand[], include: string[]) {
  return allCommands
    .filter(command => include.includes(command.name))
    .map(command => ({
      name: command.name,
      summary: command.summary
    }));
}

function printRootHelp() {
  const options = [
    { ...version, group: 'misc' },
    ...mainDefinitions,
    ...defaultOptions
  ];
  options.forEach(option => {
    styleTypes({} as ICommand, option);
  });

  const usage = commandLineUsage([
    {
      content: logo.replace(/\\/g, '\\\\'),
      raw: true
    },
    {
      content:
        'Generate releases based on semantic version labels on pull requests'
    },
    {
      header: 'Synopsis',
      content: '$ auto <command> <options>'
    },
    {
      header: 'Setup Commands',
      content: filterCommands(commands, ['init', 'create-labels'])
    },
    {
      header: 'Release Commands',
      content: filterCommands(commands, [
        'release',
        'version',
        'changelog',
        'shipit'
      ])
    },
    {
      header: 'Pull Request Interaction Commands',
      content: filterCommands(commands, ['label', 'pr-check', 'pr', 'comment'])
    },
    {
      header: 'Global Options',
      optionList: options,
      group: 'misc'
    }
  ]);

  console.log(usage);
}

function printCommandHelp(command: ICommand) {
  const sections: commandLineUsage.Section[] = [
    {
      header: `auto ${command.name}`,
      content: command.summary
    }
  ];

  if (command.options) {
    const hasLocalOptions = command.options.filter(
      option => option.group === 'main'
    );

    if (hasLocalOptions.length > 0) {
      sections.push({
        header: 'Options',
        optionList: command.options,
        group: 'main'
      });
    }

    const hasGlobalOptions = command.options.filter(
      option => option.group === 'misc'
    );

    if (hasGlobalOptions.length > 0) {
      sections.push({
        header: 'Global Options',
        optionList: command.options,
        group: 'misc'
      });
    }
  }

  sections.push({
    header: 'Examples',
    content: command.examples,
    raw: command.name === 'pr'
  });

  console.log(commandLineUsage(sections));
}

function printVersion() {
  const packagePath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`v${packageJson.version}`);
}

function styleTypes(
  command: ICommand,
  option: commandLineUsage.OptionDefinition
) {
  const isRequired =
    command.require && command.require.includes(option.name as keyof ArgsType);

  if (isRequired && option.type === Number) {
    option.typeLabel =
      '{rgb(173, 216, 230) {underline number}} [{rgb(254,91,92) required}]';
  } else if (option.type === Number) {
    option.typeLabel = '{rgb(173, 216, 230) {underline number}}';
  }

  if (isRequired && option.type === String) {
    option.typeLabel =
      '{rgb(173, 216, 230) {underline string}} [{rgb(254,91,92) required}]';
  } else if (option.multiple && option.type === String) {
    option.typeLabel = '{rgb(173, 216, 230) {underline string[]}}';
  } else if (option.type === String) {
    option.typeLabel = '{rgb(173, 216, 230) {underline string}}';
  }
}

export default function parseArgs(testArgs?: string[]) {
  const mainOptions = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
    camelCase: true,
    argv: testArgs
  });
  const argv = mainOptions._unknown || [];
  const command = commands.find(c => c.name === mainOptions.command);

  if (!command && mainOptions.version) {
    printVersion();
    return;
  }

  if (!command) {
    printRootHelp();
    return;
  }

  const options = command.options || [];

  options.forEach(option => {
    styleTypes(command, option);
  });

  if (mainOptions.help) {
    printCommandHelp(command);
    return;
  }

  const autoOptions: ArgsType = {
    command: mainOptions.command,
    ...commandLineArgs(options, { argv, camelCase: true })._all
  };

  if (command.require) {
    const missing = command.require
      .filter(
        option =>
          !autoOptions.hasOwnProperty(option) ||
          // tslint:disable-next-line strict-type-predicates
          autoOptions[option as keyof ArgsType] === null
      )
      .map(option => `--${option}`);
    const multiple = missing.length > 1;

    if (missing.length > 0) {
      printCommandHelp(command);
      signale.error(
        `Missing required flag${multiple ? 's' : ''}: ${missing.join(', ')}`
      );
      return process.exit(1);
    }
  }

  return autoOptions;
}

interface IAuthorArgs {
  name?: string;
  email?: string;
}

interface IRepoArgs {
  owner?: string;
  repo?: string;
}
interface ILogArgs {
  verbose?: boolean;
  veryVerbose?: boolean;
}

export interface IInitCommandOptions {
  onlyLabels?: boolean;
  dryRun?: boolean;
}

export interface ICreateLabelsCommandOptions {
  dryRun?: boolean;
}

export interface ILabelCommandOptions {
  pr?: number;
}

export interface IPRCheckCommandOptions {
  pr: number;
  url?: string;
  skipReleaseLabels?: string[];
  context?: string;
  dryRun?: boolean;
}

export interface IPRCommandOptions {
  sha?: string;
  pr?: number;
  url: string;
  state: 'pending' | 'success' | 'error' | 'failure';
  description: string;
  context: string;
  dryRun?: boolean;
}

export interface IVersionCommandOptions {
  skipReleaseLabels?: string[];
  onlyPublishWithReleaseLabel?: boolean;
}

export interface IChangelogOptions extends IAuthorArgs {
  noVersionPrefix?: boolean;
  jira?: string;
  dryRun?: boolean;
  from?: string;
  to?: string;
  message?: string;
}

export interface IReleaseCommandOptions extends IAuthorArgs {
  noVersionPrefix?: boolean;
  jira?: string;
  dryRun?: boolean;
  useVersion?: string;
  slack?: string;
}

export interface ICommentCommandOptions {
  message: string;
  pr?: number;
  context?: string;
  dryRun?: boolean;
}

export interface IShipItCommandOptions {
  dryRun?: boolean;
  slack?: string;
}

type GlobalFlags = {
  command: string;
  githubApi?: string;
  plugins?: string[];
} & IRepoArgs &
  ILogArgs;

export type ArgsType = GlobalFlags &
  (
    | IInitCommandOptions
    | ICreateLabelsCommandOptions
    | ILabelCommandOptions
    | IPRCheckCommandOptions
    | IPRCommandOptions
    | ICommentCommandOptions
    | IReleaseCommandOptions
    | IVersionCommandOptions
    | IShipItCommandOptions);

type Flags =
  | keyof GlobalFlags
  | keyof IInitCommandOptions
  | keyof ICreateLabelsCommandOptions
  | keyof ILabelCommandOptions
  | keyof IPRCheckCommandOptions
  | keyof IPRCommandOptions
  | keyof ICommentCommandOptions
  | keyof IReleaseCommandOptions
  | keyof IVersionCommandOptions
  | keyof IShipItCommandOptions;
