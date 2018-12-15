import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

const mainDefinitions: commandLineUsage.OptionDefinition[] = [
  { name: 'command', type: String, defaultOption: true },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display the help output. Works on each command as well'
  },
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    description: 'Show some more logs'
  },
  {
    name: 'very-verbose',
    alias: 'w',
    type: Boolean,
    description: 'Show a lot more logs'
  },
  {
    name: 'repo',
    type: String,
    description:
      'The repo to set the status on. Defaults to looking in the package.json'
  },
  {
    name: 'owner',
    type: String,
    description:
      'Version number to publish as. Defaults to reading from the package.json'
  },
  { name: 'githubApi', type: String, description: 'Github API to use' }
];

const pr: commandLineUsage.OptionDefinition = {
  name: 'pr',
  type: Number,
  description: 'The pull request number you want the labels of'
};

const dryRun: commandLineUsage.OptionDefinition = {
  name: 'dry-run',
  alias: 'd',
  type: Boolean,
  description: 'Dont actually commit status. Just print the request body'
};

const url: commandLineUsage.OptionDefinition = {
  name: 'url',
  type: String,
  description: 'URL to associate with this status'
};

const noVersionPrefix: commandLineUsage.OptionDefinition = {
  name: 'no-version-prefix',
  type: Boolean,
  description: 'Use the version as the tag without the `v` prefix'
};

const jira: commandLineUsage.OptionDefinition = {
  name: 'jira',
  type: String,
  description: 'Jira base URL'
};

const onlyPublishWithReleaseLabel: commandLineUsage.OptionDefinition = {
  name: 'onlyPublishWithReleaseLabel',
  type: Boolean,
  description: 'Only bump version if `release` label is on pull request'
};

const major: commandLineUsage.OptionDefinition = {
  name: 'major',
  type: String,
  description: 'The name of the tag for a major version bump'
};

const minor: commandLineUsage.OptionDefinition = {
  name: 'minor',
  type: String,
  description: 'The name of the tag for a minor version bump'
};

const patch: commandLineUsage.OptionDefinition = {
  name: 'patch',
  type: String,
  description: 'The name of the tag for a patch version bump'
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
  description: 'A string label to differentiate this status from others'
};

const message: commandLineUsage.OptionDefinition = {
  name: 'message',
  type: String,
  alias: 'm'
};

const required = (options: ArgsType, option: keyof ArgsType) => {
  if (!options[option]) {
    throw new TypeError(`--${option} is required`);
  }
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
    examples: ['$ auto init']
  },
  {
    name: 'init-labels',
    summary: 'Create your projects labels on github.',
    examples: ['$ auto init-labels']
  },
  {
    name: 'label',
    summary: 'Get the labels for a pull request',
    require: ['pr'],
    options: [pr],
    examples: ['$ auto label --pr 123']
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
      }
    ],
    examples: ['$ auto pr-check --pr 32 --url http://your-ci.com/build/123']
  },
  {
    name: 'pr',
    summary: 'Set the status on a PR commit',
    require: ['pr', 'state', 'description', 'context', 'url'],
    options: [
      {
        name: 'sha',
        type: String,
        description:
          'Specify a custom git sha. Defaults to the HEAD for a git repo in the current repository'
      },
      pr,
      url,
      {
        name: 'state',
        type: String,
        description:
          "State of the PR. ['pending', 'success', 'error', 'failure']"
      },
      {
        name: 'description',
        type: String,
        description: 'A description of the status'
      },
      {
        name: 'context',
        type: String,
        description: 'A string label to differentiate this status from others'
      }
    ],
    examples: [
      `$ auto pr --pr 32 --url http://your-ci.com/build/123 --state pending --description "Build still running..." --context build-check`
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
        multiple: true,
        description:
          "Labels that will not create a release. Defaults to just 'no-release"
      }
    ],
    examples: [
      {
        desc: 'Get the new version using the last release to head',
        example: '$ auto version'
      },
      {
        desc: 'Skip releases with multiple labels',
        example: '$ auto version --noReleaseLabels documentation CI'
      }
    ]
  },
  {
    name: 'changelog',
    summary:
      "Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes.",
    options: [
      dryRun,
      noVersionPrefix,
      name,
      email,
      jira,
      {
        name: 'from',
        type: String,
        description:
          'Tag to start changelog generation on. Defaults to latest tag.'
      },
      {
        name: 'to',
        type: String,
        description: 'Tag to end changelog generation on. Defaults to HEAD.'
      },
      {
        ...message,
        description:
          'Message to commit the changelog with. Defaults to "Update CHANGELOG.md [skip ci]"'
      }
    ],
    examples: [
      {
        desc: 'Generate a changelog from the last release to head',
        example: '$ auto changelog'
      },
      {
        desc: 'Generate a changelog across specific versions',
        example: '$ auto changelog --from v0.20.1 --to v0.21.0'
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
        description:
          'Version number to publish as. Defaults to reading from the package.json.'
      },
      {
        name: 'slack',
        alias: 's',
        type: String,
        description:
          'Post a message to slack about the release. Make sure the SLACK_TOKEN environment variable is set.'
      }
    ],
    examples: ['$ auto release']
  },
  {
    name: 'comment',
    summary: 'Comment on a pull request with a markdown message',
    require: ['pr', 'message'],
    options: [
      pr,
      context,
      { ...message, description: 'Message to post to comment' }
    ],
    examples: ['$ auto comment --pr 123 --comment "# Why you\'re wrong..."']
  },
  {
    name: 'shipit',
    summary: 'Run the full auto-release project. Detects if in a lerna project',
    examples: ['$ auto shipit']
  }
];

function printRootHelp() {
  const usage = commandLineUsage([
    {
      header: 'auto',
      content:
        'Generate releases based on semantic version labels on pull requests'
    },
    {
      header: 'Synopsis',
      content: '$ auto <options> <command>'
    },
    {
      header: 'Setup Commands',
      content: commands
        .filter(command => ['init', 'init-labels'].includes(command.name))
        .map(command => ({
          name: command.name,
          summary: command.summary
        }))
    },
    {
      header: 'Release Commands',
      content: commands
        .filter(command =>
          ['release', 'version', 'changelog', 'shipit'].includes(command.name)
        )
        .map(command => ({
          name: command.name,
          summary: command.summary
        }))
    },
    {
      header: 'Pull Request Interaction Commands',
      content: commands
        .filter(command =>
          ['label', 'pr-check', 'pr', 'comment'].includes(command.name)
        )
        .map(command => ({
          name: command.name,
          summary: command.summary
        }))
    },
    {
      header: 'Options',
      optionList: mainDefinitions.filter(def => def.name !== 'command')
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
    sections.push({
      header: 'Options',
      optionList: command.options
    });
  }

  if (command.examples) {
    sections.push({
      header: 'Examples',
      content: command.examples
    });
  }

  const usage = commandLineUsage(sections);

  console.log(usage);
}

export default function parseArgs() {
  const mainOptions = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true
  });
  const argv = mainOptions._unknown || [];
  const command = commands.find(c => c.name === mainOptions.command);

  if (!command) {
    return printRootHelp();
  }

  const options = command.options || [];

  options.map(option => {
    const isRequired =
      command.require &&
      command.require.includes(option.name as keyof ArgsType);

    if (isRequired && option.type === Number) {
      option.typeLabel = '{underline number} [required]';
    }

    if (isRequired && option.type === String) {
      option.typeLabel = '{underline string} [required]';
    }
  });

  if (mainOptions.help) {
    return printCommandHelp(command);
  }

  const autoOptions: ArgsType = {
    command: mainOptions.command,
    ...commandLineArgs(command.options || [], { argv })
  };

  if (command.require) {
    command.require.map(option => {
      required(autoOptions, option);
    });
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
  IOwnerArgs;
