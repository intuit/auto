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

const mainDefinitions: commandLineUsage.OptionDefinition[] = [
  { name: 'command', type: String, defaultOption: true },
  {
    ...help,
    description: 'Display the help output. Works on each command as well'
  }
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
      'The repo to set the status on. Defaults to looking in the package.json',
    group: 'misc'
  },
  {
    name: 'owner',
    type: String,
    description:
      'Version number to publish as. Defaults to reading from the package.json',
    group: 'misc'
  },
  {
    name: 'githubApi',
    type: String,
    description: 'Github API to use',
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
  description: 'Dont actually commit status. Just print the request body',
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

const onlyPublishWithReleaseLabel: commandLineUsage.OptionDefinition = {
  name: 'onlyPublishWithReleaseLabel',
  type: Boolean,
  description: "Only bump version if 'release' label is on pull request",
  group: 'main'
};

const major: commandLineUsage.OptionDefinition = {
  name: 'major',
  type: String,
  description: 'The name of the tag for a major version bump',
  group: 'main'
};

const minor: commandLineUsage.OptionDefinition = {
  name: 'minor',
  type: String,
  description: 'The name of the tag for a minor version bump',
  group: 'main'
};

const patch: commandLineUsage.OptionDefinition = {
  name: 'patch',
  type: String,
  description: 'The name of the tag for a patch version bump',
  group: 'main'
};

const semver = [onlyPublishWithReleaseLabel, major, minor, patch];

const name: commandLineUsage.OptionDefinition = {
  name: 'name',
  type: String,
  description: 'Git name to commit and release with. Defaults to package.json'
};

const email: commandLineUsage.OptionDefinition = {
  name: 'email',
  type: String,
  description: 'Git email to commit with. Defaults to package.json'
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

interface ICommand {
  name: string;
  summary: string;
  options?: commandLineUsage.OptionDefinition[];
  require?: (keyof ArgsType)[];
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
      }
    ]
  },
  {
    name: 'create-labels',
    summary: 'Create your projects labels on github.',
    examples: ['{green $} auto create-labels'],
    options: defaultOptions
  },
  {
    name: 'label',
    summary: 'Get the labels for a pull request',
    options: [
      { ...pr, description: `${pr.description} (default to last merged PR)` },
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
      ...semver,
      {
        ...context,
        defaultValue: 'ci/pr-check'
      },
      ...defaultOptions
    ],
    examples: [
      '{green $} auto pr-check --pr 32 --url http://your-ci.com/build/123'
    ]
  },
  {
    name: 'pr',
    summary: 'Set the status on a PR commit',
    require: ['pr', 'state', 'description', 'context', 'url'],
    options: [
      {
        name: 'sha',
        type: String,
        group: 'main',
        description:
          'Specify a custom git sha. Defaults to the HEAD for a git repo in the current repository'
      },
      pr,
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
      ...defaultOptions
    ],
    examples: [
      `{green $} auto pr \\\\ \n   --pr 32 \\\\ \n   --url http://your-ci.com/build/123 \\\\ \n   --state pending \\\\ \n   --description "Build still running..." \\\\ \n   --context build-check`
    ]
  },
  {
    name: 'version',
    summary: 'Get the semantic version bump for the given changes.',
    options: [
      ...semver,
      {
        name: 'noReleaseLabels',
        type: String,
        group: 'main',
        multiple: true,
        description:
          "Labels that will not create a release. Defaults to just 'no-release'"
      },
      ...defaultOptions
    ],
    examples: [
      {
        desc: 'Get the new version using the last release to head',
        example: '{green $} auto version'
      },
      {
        desc: 'Skip releases with multiple labels',
        example: '{green $} auto version --noReleaseLabels documentation CI'
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
        type: Boolean,
        group: 'main',
        description:
          'Version number to publish as. Defaults to reading from the package.json.'
      },
      {
        name: 'slack',
        alias: 's',
        type: String,
        group: 'main',
        description:
          'Post a message to slack about the release. Make sure the SLACK_TOKEN environment variable is set.'
      },
      ...defaultOptions
    ],
    examples: ['{green $} auto release']
  },
  {
    name: 'comment',
    summary: 'Comment on a pull request with a markdown message',
    require: ['pr', 'message'],
    options: [
      pr,
      context,
      { ...message, description: 'Message to post to comment' },
      ...defaultOptions
    ],
    examples: [
      '{green $} auto comment --pr 123 --comment "# Why you\'re wrong..."'
    ]
  },
  {
    name: 'shipit',
    summary: 'Run the full auto-release project. Detects if in a lerna project',
    examples: ['{green $} auto shipit'],
    options: defaultOptions
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
  const options = [...mainDefinitions, ...defaultOptions];
  options.forEach(option => styleTypes({} as ICommand, option));

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
    argv: testArgs
  });
  const argv = mainOptions._unknown || [];
  const command = commands.find(c => c.name === mainOptions.command);

  if (!command) {
    return printRootHelp();
  }

  const options = command.options || [];

  options.map(option => styleTypes(command, option));

  if (mainOptions.help) {
    return printCommandHelp(command);
  }

  const autoOptions: ArgsType = {
    command: mainOptions.command,
    ...commandLineArgs(options, { argv })._all
  };

  if (command.require) {
    const missing = command.require
      .filter(option => !autoOptions[option])
      .map(option => `--${option}`);
    const multiple = missing.length > 1;

    printCommandHelp(command);
    signale.error(
      `Missing required flag${multiple ? 's' : ''}: ${missing.join(', ')}`
    );
    process.exit(0);
  }

  return autoOptions;
}

export interface ISemverArgs {
  noReleaseLabels?: string[];
  onlyPublishWithReleaseLabel?: boolean;
  major?: string;
  minor?: string;
  patch?: string;
  jira?: string;
  slack?: string;
  githubApi?: string;
}

export interface IOwnerArgs {
  name?: string;
  email?: string;
}

export interface IRepoArgs {
  owner?: string;
  repo?: string;
  sha?: string;
  pr?: number;
}

export interface IPRArgs {
  state?: 'pending' | 'success' | 'error' | 'failure';
  context?: string;
  number?: number;
  url?: string;
  target_url?: string;
  description?: string;
}

export interface IReleaseArgs {
  dry_run?: boolean;
  slack?: string;
  no_version_prefix?: boolean;
  use_version?: string;
}

export interface IChangelogArgs {
  from?: string;
  to?: string;
}

export interface ICommentArgs {
  message?: string;
}

export interface IInitArgs {
  'only-labels'?: boolean;
}

export interface ILogArgs {
  verbose?: boolean;
  very_verbose?: boolean;
}

export type ArgsType = {
  command: string;
} & ISemverArgs &
  IRepoArgs &
  IChangelogArgs &
  IReleaseArgs &
  ICommentArgs &
  IPRArgs &
  ILogArgs &
  IOwnerArgs &
  IInitArgs;
