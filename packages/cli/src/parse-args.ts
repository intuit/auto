import chalk from "chalk";
import { app, Command, Option } from "command-line-application";
import endent from "endent";

import {
  ApiOptions,
  GlobalOptions,
  ICanaryOptions,
  IChangelogOptions,
  ICommentOptions,
  ICreateLabelsOptions,
  ILabelOptions,
  IPRBodyOptions,
  IPRCheckOptions,
  IPRStatusOptions,
  IReleaseOptions,
  IShipItOptions,
  IVersionOptions,
  getAutoVersion,
} from "@auto-it/core";

export type Flags =
  | keyof GlobalOptions
  | keyof ICreateLabelsOptions
  | keyof ILabelOptions
  | keyof IPRCheckOptions
  | keyof IPRStatusOptions
  | keyof ICommentOptions
  | keyof IPRBodyOptions
  | keyof IReleaseOptions
  | keyof IVersionOptions
  | keyof IShipItOptions
  | keyof IChangelogOptions
  | keyof ICanaryOptions;

const p = chalk.hex("#870048");
const y = chalk.hex("#F1A60E");
const r = chalk.hex("#C5000B");
const g = chalk.hex("#888888");

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
`.replace(/\\/g, '\\\\');

interface AutoOption extends Option {
  /** This option is configurable via .autorc */
  config?: boolean;
}

const version: AutoOption = {
  name: "version",
  alias: "V",
  type: Boolean,
  description: "Display auto's version",
  group: "global",
};

const prerelease: AutoOption = {
  name: "prerelease",
  type: Boolean,
  group: "main",
  description: "Publish a prerelease on GitHub.",
  config: true,
};

const onlyPublishWithReleaseLabel: AutoOption = {
  name: "only-publish-with-release-label",
  type: Boolean,
  description: "Only bump version if 'release' label is on pull request",
  group: "main",
};

const quiet: AutoOption = {
  name: "quiet",
  alias: "q",
  type: Boolean,
  description: "Print **only** the result of the command",
  group: "global",
};

const defaultOptions: AutoOption[] = [
  {
    name: "verbose",
    alias: "v",
    type: Boolean,
    description: "Show some more logs. Pass -vv for very verbose logs.",
    group: "global",
    multiple: true,
  },
  {
    name: "repo",
    type: String,
    description:
      "The repo to set the status on. Defaults to looking in the package definition for the platform",
    group: "global",
  },
  {
    name: "owner",
    type: String,
    description:
      "The owner of the GitHub repo. Defaults to reading from the package definition for the platform",
    group: "global",
  },
  {
    name: "github-api",
    type: String,
    description: "GitHub API to use",
    group: "global",
  },
  {
    name: "plugins",
    type: String,
    multiple: true,
    description: "Plugins to load auto with. (defaults to just npm)",
    group: "global",
  },
];

const baseBranch: AutoOption = {
  name: "base-branch",
  type: String,
  description: "Branch to treat as the base branch",
  group: "global",
};

const pr: AutoOption = {
  name: "pr",
  type: Number,
  description:
    "The pull request the command should use. Detects PR number in CI",
  group: "main",
};

const dryRun: AutoOption = {
  name: "dry-run",
  alias: "d",
  type: Boolean,
  description: "Report what command will do but do not actually do anything",
  group: "main",
};

const url: AutoOption = {
  name: "url",
  type: String,
  description: "URL to associate with this status",
  group: "main",
};

const noVersionPrefix: AutoOption = {
  name: "no-version-prefix",
  type: Boolean,
  description:
    "Use the version as the tag without the 'v' prefix. WARNING: some plugins might need extra config to use this option (ex: npm)",
  group: "main",
};

const name: AutoOption = {
  name: "name",
  type: String,
  description:
    "Git name to commit  with. Defaults to package definition for the platform",
  group: "main",
};

const email: AutoOption = {
  name: "email",
  type: String,
  description:
    "Git email to commit with. Defaults to package definition for the platform",
  group: "main",
};

const context: AutoOption = {
  name: "context",
  type: String,
  description: "A string label to differentiate this status from others",
  group: "main",
};

const message: AutoOption = {
  name: "message",
  group: "main",
  type: String,
  alias: "m",
};

const changelogTitle: AutoOption = {
  name: "title",
  type: String,
  group: "main",
  description: "Override the title used in the addition to the CHANGELOG.md.",
};

const changelogCommitMessage: AutoOption = {
  ...message,
  description:
    "Message to commit the changelog with. Defaults to 'Update CHANGELOG.md [skip ci]'",
  config: true,
};

const noChangelog: AutoOption = {
  name: "no-changelog",
  type: Boolean,
  group: "main",
  description: "Skip creating the changelog",
  config: true,
};

const force: AutoOption = {
  name: "force",
  type: Boolean,
  group: "main",
  config: true,
};

const useVersion: AutoOption = {
  name: "use-version",
  type: String,
  group: "main",
  description:
    "Version number to publish as. Defaults to reading from the package definition for the platform.",
}

interface AutoCommand extends Command {
  /** Options for the command */
  options?: AutoOption[];
}

const latestCommandArgs: AutoOption[] = [
  name,
  email,
  onlyPublishWithReleaseLabel,
  baseBranch,
  dryRun,
  noVersionPrefix,
  prerelease,
  changelogTitle,
  changelogCommitMessage,
  quiet,
  noChangelog,
];

export const commands: AutoCommand[] = [
  {
    name: "init",
    group: "Setup Command",
    description: "Interactive setup for minimum working configuration.",
    examples: ["{green $} auto init"],
  },
  {
    name: "info",
    group: "Setup Command",
    description:
      "Determine the environment, check if auto is set up correctly, and list plugins.",
    examples: ["{green $} auto info"],
    options: [
      {
        name: "list-plugins",
        type: Boolean,
        description: "List the available plugins",
        group: "main",
      },
    ],
  },
  {
    name: "create-labels",
    group: "Setup Command",
    description:
      "Create your project's labels on github. If labels exist it will update them.",
    examples: ["{green $} auto create-labels"],
    options: [dryRun],
  },
  {
    name: "label",
    group: "Pull Request Interaction Commands",
    description:
      "Get the labels for a pull request. Doesn't do much, but the return value lets you write you own scripts based off of the PR labels!",
    options: [
      { ...pr, description: `${pr.description} (defaults to last merged PR)` },
      {
        name: "exists",
        type: String,
        group: "main",
        description: "Checks for existence of a specific label",
      },
    ],
    examples: ["{green $} auto label --pr 123"],
  },
  {
    name: "comment",
    group: "Pull Request Interaction Commands",
    description:
      "Comment on a pull request with a markdown message. Each comment has a context, and each context only has one comment.",
    require: [["message", "delete"]],
    options: [
      pr,
      context,
      {
        name: "edit",
        type: Boolean,
        alias: "e",
        group: "main",
        description: "Edit old comment",
        config: true,
      },
      {
        name: "delete",
        type: Boolean,
        group: "main",
        description: "Delete old comment",
        config: true,
      },
      { ...message, description: "Message to post to comment" },
      dryRun,
    ],
    examples: [
      "{green $} auto comment --delete",
      '{green $} auto comment --pr 123 --message "# Why you\'re wrong..."',
      '{green $} auto comment --pr 123 --edit --message "This smells..." --context code-smell',
    ],
  },
  {
    name: "pr-check",
    group: "Pull Request Interaction Commands",
    description:
      "Check that a pull request has a SemVer label and run all pr-check plugins.",
    require: ["url"],
    options: [
      pr,
      url,
      dryRun,
      {
        ...context,
        defaultValue: "ci/pr-check",
      },
    ],
    examples: ["{green $} auto pr-check --url http://your-ci.com/build/123"],
  },
  {
    name: "pr-status",
    group: "Pull Request Interaction Commands",
    description: "Set the status on a PR commit",
    require: ["state", "url", "description", "context"],
    options: [
      {
        name: "sha",
        type: String,
        group: "main",
        description:
          "Specify a custom git sha. Defaults to the HEAD for a git repo in the current repository",
      },
      {
        ...pr,
        description: "PR to set the status on. Detects PR number in CI",
      },
      url,
      {
        name: "state",
        type: String,
        group: "main",
        description:
          "State of the PR. ['pending', 'success', 'error', 'failure']",
      },
      {
        name: "description",
        type: String,
        group: "main",
        description: "A description of the status",
      },
      {
        name: "context",
        type: String,
        group: "main",
        description: "A string label to differentiate this status from others",
      },
      dryRun,
    ],
    examples: [
      `{green $} auto pr-status \\\\ \n   --state pending \\\\ \n   --description "Build still running..." \\\\ \n   --context build-check`,
    ],
  },
  {
    name: "pr-body",
    group: "Pull Request Interaction Commands",
    description:
      "Update the body of a PR with a message. Appends to PR and will not overwrite user content. Each comment has a context, and each context only has one comment.",
    require: ["message"],
    options: [
      pr,
      context,
      { ...message, description: "Message to post to PR body" },
      dryRun,
    ],
    examples: [
      "{green $} auto pr-body --delete",
      '{green $} auto pr-body --pr 123 --comment "The new version is: 1.2.3"',
    ],
  },
  {
    name: "version",
    group: "Release Commands",
    description: endent`
      Calculate a semantic version bump for the given changes.
      Requires all PRs to have labels for the change type.
      If a PR does not have a label associated with it, it will default to \`patch\` or whatever you configure the default label to.

      NOTE: This does not change the version of your project or anything in your repo. It just returns \`patch\`, \`minor\`, or \`major\`.
    `,
    options: [
      onlyPublishWithReleaseLabel,
      {
        name: "from",
        type: String,
        group: "main",
        description:
          "Git revision (tag, commit sha, ...) to calculate version bump from. Defaults to latest github release",
      },
    ],
    examples: [
      {
        desc: "Get the new version using the last release to head",
        example: "{green $} auto version",
      },
    ],
  },
  {
    name: "changelog",
    group: "Release Commands",
    description:
      "Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes.",
    options: [
      dryRun,
      noVersionPrefix,
      name,
      email,
      {
        name: "from",
        type: String,
        group: "main",
        description:
          "Tag to start changelog generation on. Defaults to latest tag.",
      },
      {
        name: "to",
        type: String,
        group: "main",
        description: "Tag to end changelog generation on. Defaults to HEAD.",
      },
      changelogTitle,
      changelogCommitMessage,
      baseBranch,
      quiet,
    ],
    examples: [
      {
        desc: "Generate a changelog from the last release to head",
        example: "{green $} auto changelog",
      },
      {
        desc: "Generate a changelog across specific versions",
        example: "{green $} auto changelog --from v0.20.1 --to v0.21.0",
      },
    ],
  },
  {
    name: "release",
    group: "Release Commands",
    description: endent`
      Create a GitHub release for a tag. Defaults to last tag in branch.

      > NOTE: The tag must already be pushed to GitHub. If it isn't GitHub will create a tag pointing to the "to" option value.
    `,
    options: [
      dryRun,
      noVersionPrefix,
      name,
      email,
      {
        name: "from",
        type: String,
        group: "main",
        description:
          "Git revision (tag, commit sha, ...) to start release notes from. Defaults to latest tag.",
      },
      {
        name: "to",
        type: String,
        group: "main",
        description:
          "Git revision (tag, commit sha, ...) to end release notes at. Defaults to HEAD.",
      },
      useVersion,
      baseBranch,
      prerelease,
    ],
    examples: [
      "{green $} auto release",
      {
        desc:
          "This command can be used in isolation easily. This example will: tag the release version at 'to' and create a GitHub release changelog over the commits range",
        example:
          "{green $} auto release --from v0.20.1 --to HEAD --use-version v0.21.0",
      },
    ],
  },
  {
    name: "shipit",
    group: "Release Commands",
    description: endent`
      Context aware publishing.

      1. call from base branch -> latest version released (LATEST)
      2. call from prerelease branch -> prerelease version released (NEXT)
      3. call from PR in CI -> canary version released (CANARY)
      4. call locally when not on base/prerelease branch -> canary version released (CANARY)
    `,
    examples: ["{green $} auto shipit"],
    options: [
      ...latestCommandArgs,
      useVersion,
      {
        name: "only-graduate-with-release-label",
        type: Boolean,
        defaultValue: false,
        group: "main",
        description:
          'Make auto publish prerelease versions when merging to baseBranch. Only PRs merged with "release" label will generate a "latest" release. Only use this flag if you do not want to maintain a prerelease branch, and instead only want to use baseBranch.',
        config: true,
      },
    ],
  },
  {
    name: "latest",
    group: "Release Commands",
    description: endent`
      Run the full \`auto\` release pipeline. Force a release to latest and bypass \`shipit\` safeguards.
    `,
    examples: ["{green $} auto latest"],
    options: latestCommandArgs,
  },
  {
    name: "canary",
    group: "Release Commands",
    description: endent`
      Make a canary release of the project. Useful on PRs. If ran locally, \`canary\` will release a canary version for your current git HEAD. This is ran automatically from "shipit".

      1. In PR: 1.2.3-canary.123.0 + add version to PR body
      2. Locally: 1.2.3-canary.1810cfd
    `,
    examples: [
      "{green $} auto canary",
      "{green $} auto canary --force",
      "{green $} auto canary --pr 123 --build 5",
      '{green $} auto canary --message "Install PR version: `yarn add -D my-project@%v`"',
      "{green $} auto canary --message false",
    ],
    options: [
      dryRun,
      {
        ...pr,
        description:
          "PR number to use to create the canary version. Detected in CI env",
      },
      {
        name: "build",
        type: String,
        group: "main",
        description:
          "Build number to use to create the canary version. Detected in CI env",
      },
      {
        name: "target",
        type: String,
        group: "main",
        defaultValue: "pr-body",
        description: "How the canary version should be attached to a PR",
        typeLabel: "pr-body | comment | status",
        config: true,
      },
      {
        ...message,
        description:
          "Message to comment on PR with. Defaults to 'Published PR with canary version: %v'. Pass false to disable the comment",
        config: true,
      },
      {
        ...force,
        description:
          "Force a next release, even if the last commit is marked to skip the release",
      },
      quiet,
    ],
  },
  {
    name: "next",
    group: "Release Commands",
    description: endent`
      Make a release for your "prerelease" release line. This is ran automatically by "shipit" in a prerelease branch.

      1. Creates a prerelease on package management platform
      2. Creates a "Pre Release" on GitHub releases page
      3. If ran from a PR build in a CI, posts the prerelease's full releases notes and expected version of the prerelease

      Calling the \`next\` command from a prerelease branch will publish a prerelease for just that branch, otherwise it will publish to the default prerelease branch.
    `,
    examples: ["{green $} auto next"],
    options: [
      dryRun,
      {
        ...message,
        description:
          "The message used when attaching the prerelease version to a PR",
        config: true,
      },
      {
        ...force,
        description:
          "Force a canary release, even if the PR is marked to skip the release",
      },
      quiet,
    ],
  },
];

/** Parse the CLI args and return command + options provided. */
export default function parseArgs(testArgs?: string[]) {
  const mainOptions = app(
    {
      name: "auto",
      logo,
      description:
        "Generate releases based on semantic version labels on pull requests, and other pull request automation tools.",
      commands,
      options: [version, ...defaultOptions],
    },
    {
      argv: testArgs,
    }
  );

  if (!mainOptions) {
    return [];
  }

  if (!mainOptions._command) {
    if (mainOptions.version) {
      const version = process.env.AUTO_CLI_VERSION || getAutoVersion();
      console.log(`v${version}`);
    }

    return [];
  }

  return [mainOptions._command, mainOptions] as [string, ApiOptions];
}
