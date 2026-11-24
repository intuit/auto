import chalk from "chalk";
import { cac, type CAC } from "cac";
import endent from "endent";

import type { ApiOptions } from "@auto-it/core";
import { getAutoVersion } from "@auto-it/core";

import { runCli } from "./run";

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
      ${g('▔▔▔▔▔▔▔▔▔ ')}`;

const description =
  "Generate releases based on semantic version labels on pull requests, and other pull request automation tools.";

/** The headings commands are grouped under in the main help */
const commandGroups: Record<string, string[]> = {
  "Setup Command": ["init", "info", "create-labels"],
  "Pull Request Interaction Commands": [
    "label",
    "comment",
    "pr-check",
    "pr-status",
    "pr-body",
  ],
  "Release Commands": [
    "version",
    "changelog",
    "release",
    "shipit",
    "latest",
    "canary",
    "next",
  ],
};

/** The arguments to cac's `option()` */
type OptionArgs = [
  rawName: string,
  description: string,
  config?: { default?: unknown; type?: unknown[] },
];

/** An option with a different description */
const describe = (
  [rawName, , config]: OptionArgs,
  text: string
): OptionArgs => [rawName, text, config];

const prerelease: OptionArgs = [
  "--prerelease",
  "Publish a prerelease on GitHub.",
];
const onlyPublishWithReleaseLabel: OptionArgs = [
  "--only-publish-with-release-label",
  "Only bump version if 'release' label is on pull request",
];
const quiet: OptionArgs = [
  "-q, --quiet",
  "Print **only** the result of the command",
];
const baseBranch: OptionArgs = [
  "--base-branch <string>",
  "Branch to treat as the base branch",
];
const pr: OptionArgs = [
  "--pr <number>",
  "The pull request the command should use. Detects PR number in CI",
];
const dryRun: OptionArgs = [
  "-d, --dry-run",
  "Report what command will do but do not actually do anything",
];
const noGitCommit: OptionArgs = ["--no-git-commit", "Do not commit changes"];
const url: OptionArgs = ["--url <string>", "URL to associate with this status"];
const noVersionPrefix: OptionArgs = [
  "--no-version-prefix",
  "Use the version as the tag without the 'v' prefix. WARNING: some plugins might need extra config to use this option (ex: npm)",
];
const name: OptionArgs = [
  "--name <string>",
  "Git name to commit  with. Defaults to package definition for the platform",
];
const email: OptionArgs = [
  "--email <string>",
  "Git email to commit with. Defaults to package definition for the platform",
];
const context: OptionArgs = [
  "--context <string>",
  "A string label to differentiate this status from others",
];
const message: OptionArgs = ["-m, --message <string>", ""];
const changelogTitle: OptionArgs = [
  "--title <string>",
  "Override the title used in the addition to the CHANGELOG.md.",
];
const changelogCommitMessage = describe(
  message,
  "Message to commit the changelog with. Defaults to 'Update CHANGELOG.md [skip ci]'"
);
const noChangelog: OptionArgs = [
  "--no-changelog",
  "Skip creating the changelog",
];
const force: OptionArgs = ["--force", ""];
const useVersion: OptionArgs = [
  "--use-version <string>",
  "Version number to publish as. Defaults to reading from the package definition for the platform.",
];
const changelogFrom: OptionArgs = [
  "--from <string>",
  "Tag to start changelog generation on. Defaults to latest tag or if a prerelease the latest tag in the branch. Provide latest to override.",
];

const latestCommandArgs: OptionArgs[] = [
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

/** Format an example for the help output, with an optional description above it */
const example = (command: string, text?: string) =>
  `${text ? `  ${text}\n` : ""}  ${chalk.green("$")} ${command}`;

/** The option names auto's core reads for a `--no-*` flag, e.g. `noGitCommit` */
export const negatedName = (name: string) =>
  `no${name.charAt(0).toUpperCase()}${name.slice(1)}`;

/** Text again, if cac turned it into a number */
const toText = (value: unknown) =>
  typeof value === "number" ? String(value) : value;

/** Turn the options cac parsed into the ones auto's core reads */
function toCoreOptions(cli: CAC, options: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...options };
  const registered = [
    ...cli.globalCommand.options,
    ...(cli.matchedCommand?.options ?? []),
  ];

  for (const option of registered) {
    if (option.negated) {
      // cac sets `true` for a `--no-*` flag that wasn't typed. Passed on, it would
      // replace the matching .autorc section (`changelog: { message }`).
      if (result[option.name] === false) {
        result[negatedName(option.name)] = true;
      } else {
        delete result[option.name];
      }

      continue;
    }

    if (option.isBoolean) {
      continue;
    }

    for (const key of option.names.filter((name) => name in result)) {
      let value = result[key];

      // cac collects a repeated option into a list, but core expects one value
      if (Array.isArray(value) && !option.config.type) {
        value = value[value.length - 1];
      }

      // cac turns text that looks like a number into a number
      if (!option.rawName.includes("<number>")) {
        value = Array.isArray(value) ? value.map(toText) : toText(value);
      }

      result[key] = value;
    }
  }

  return result as ApiOptions;
}

/** Options a command needs. An array means at least one of them. */
type RequiredOptions = Array<string | string[]>;

/** Print which required options are missing, if any */
function hasRequiredOptions(options: ApiOptions, required: RequiredOptions) {
  const values = options as Record<string, unknown>;
  const missing = required
    .filter((names) => [names].flat().every((n) => values[n] === undefined))
    .map((names) =>
      Array.isArray(names)
        ? `(${names.map((n) => `--${n}`).join(" or ")})`
        : `--${names}`
    );

  if (missing.length) {
    console.log(
      `Missing required arg${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`
    );
    return false;
  }

  return true;
}

interface HelpSection {
  title?: string;
  body: string;
}

/** Rewrite cac's help: logo, grouped commands, and own vs global options */
function formatHelp(cli: CAC) {
  return (sections: HelpSection[]): HelpSection[] => {
    const [header = { body: "" }, usage = { body: "" }] = sections;
    const command = cli.matchedCommand;
    const globals = cli.globalCommand.options.filter(
      (option) => command === undefined || option.name !== "version"
    );
    const own = command?.options ?? [];
    const width = Math.max(
      ...[...own, ...globals].map((o) => o.rawName.length)
    );
    const lines = (options: typeof own) =>
      options
        .map((option) => {
          const value = option.config.default;
          // cac gives every `--no-*` flag a default of `true`, which reads backwards
          const shown =
            value === undefined || option.negated ? "" : ` (default: ${value})`;

          return `  ${option.rawName.padEnd(width)}  ${option.description}${shown}`;
        })
        .join("\n");
    const examples = sections.filter((s) => s.title === "Examples");

    if (command) {
      return [
        header,
        usage,
        { body: command.description },
        ...(own.length ? [{ title: "Options", body: lines(own) }] : []),
        { title: "Global Options", body: lines(globals) },
        ...examples,
      ];
    }

    const commandWidth = Math.max(...cli.commands.map((c) => c.name.length));
    const grouped = Object.entries(commandGroups).map(([title, names]) => ({
      title,
      body: cli.commands
        .filter((c) => names.includes(c.name))
        .map(
          (c) =>
            `  ${c.name.padEnd(commandWidth)}  ${c.description.split("\n")[0]}`
        )
        .join("\n"),
    }));
    const moreInfo = sections.filter((s) =>
      s.title?.startsWith("For more info")
    );

    return [
      { body: logo },
      header,
      { body: description },
      usage,
      ...grouped,
      ...moreInfo,
      { title: "Global Options", body: lines(globals) },
    ];
  };
}

/** Declare auto's commands and options with cac */
export function createCli() {
  const cli = cac("auto");

  /** Convert the options, check the required ones, then run the command */
  const run =
    (command: string, required: RequiredOptions = []) =>
    (options: Record<string, unknown>) => {
      const args = toCoreOptions(cli, options);

      if (!hasRequiredOptions(args, required)) {
        process.exit(1);
        return;
      }

      return runCli(command, args);
    };

  cli
    .usage("<command> [options]")
    .option(
      "-v, --verbose",
      "Show some more logs. Pass -vv for very verbose logs."
    )
    .option(
      "--repo <string>",
      "The repo to set the status on. Defaults to looking in the package definition for the platform"
    )
    .option(
      "--owner <string>",
      "The owner of the GitHub repo. Defaults to reading from the package definition for the platform"
    )
    .option("--github-api <string>", "GitHub API to use")
    .option(
      "--plugins <string>",
      "Plugins to load auto with. Repeat the flag for each plugin. (defaults to just npm)",
      { type: [String] }
    )
    .version(process.env.AUTO_CLI_VERSION || getAutoVersion(), "-V, --version")
    .help(formatHelp(cli));

  cli
    .command("init", "Interactive setup for minimum working configuration.")
    .example(example("auto init"))
    .action(run("init"));

  cli
    .command(
      "info",
      "Determine the environment, check if auto is set up correctly, and list plugins."
    )
    .option("--list-plugins", "List the available plugins")
    .example(example("auto info"))
    .action(run("info"));

  cli
    .command(
      "create-labels",
      "Create your project's labels on github. If labels exist it will update them."
    )
    .option(...dryRun)
    .example(example("auto create-labels"))
    .action(run("create-labels"));

  cli
    .command(
      "label",
      "Get the labels for a pull request. Doesn't do much, but the return value lets you write you own scripts based off of the PR labels!"
    )
    .option(...describe(pr, `${pr[1]} (defaults to last merged PR)`))
    .option("--exists <string>", "Checks for existence of a specific label")
    .example(example("auto label --pr 123"))
    .action(run("label"));

  cli
    .command(
      "comment",
      "Comment on a pull request with a markdown message. Each comment has a context, and each context only has one comment."
    )
    .option(...pr)
    .option(...context)
    .option("-e, --edit", "Edit old comment")
    .option("--delete", "Delete old comment")
    .option(...describe(message, "Message to post to comment"))
    .option(...dryRun)
    .example(example("auto comment --delete"))
    .example(
      example('auto comment --pr 123 --message "# Why you\'re wrong..."')
    )
    .example(
      example(
        'auto comment --pr 123 --edit --message "This smells..." --context code-smell'
      )
    )
    .action(run("comment", [["message", "delete"]]));

  cli
    .command(
      "pr-check",
      "Check that a pull request has a SemVer label and run all pr-check plugins."
    )
    .option(...pr)
    .option(...url)
    .option(...dryRun)
    .option(context[0], context[1], { default: "ci/pr-check" })
    .example(example("auto pr-check --url http://your-ci.com/build/123"))
    .action(run("pr-check", ["url"]));

  cli
    .command("pr-status", "Set the status on a PR commit")
    .option(
      "--sha <string>",
      "Specify a custom git sha. Defaults to the HEAD for a git repo in the current repository"
    )
    .option(...describe(pr, "PR to set the status on. Detects PR number in CI"))
    .option(...url)
    .option(
      "--state <string>",
      "State of the PR. ['pending', 'success', 'error', 'failure']"
    )
    .option("--description <string>", "A description of the status")
    .option(...context)
    .option(...dryRun)
    .example(
      example(
        'auto pr-status \\\n    --state pending \\\n    --description "Build still running..." \\\n    --context build-check'
      )
    )
    .action(run("pr-status", ["state", "url", "description", "context"]));

  cli
    .command(
      "pr-body",
      "Update the body of a PR with a message. Appends to PR and will not overwrite user content. Each comment has a context, and each context only has one comment."
    )
    .option(...pr)
    .option(...context)
    .option(...describe(message, "Message to post to PR body"))
    .option(...dryRun)
    .example(example("auto pr-body --delete"))
    .example(
      example('auto pr-body --pr 123 --comment "The new version is: 1.2.3"')
    )
    .action(run("pr-body", ["message"]));

  cli
    .command(
      "version",
      endent`
        Calculate a semantic version bump for the given changes.
        Requires all PRs to have labels for the change type.
        If a PR does not have a label associated with it, it will default to \`patch\` or whatever you configure the default label to.

        NOTE: This does not change the version of your project or anything in your repo. It just returns \`patch\`, \`minor\`, or \`major\`.
      `
    )
    .option(...onlyPublishWithReleaseLabel)
    .option(
      "--from <string>",
      "Git revision (tag, commit sha, ...) to calculate version bump from. Defaults to latest github release"
    )
    .example(
      example(
        "auto version",
        "Get the new version using the last release to head"
      )
    )
    .action(run("version"));

  cli
    .command(
      "changelog",
      "Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes."
    )
    .option(...dryRun)
    .option(...noVersionPrefix)
    .option(...name)
    .option(...email)
    .option(...changelogFrom)
    .option(
      "--to <string>",
      "Tag to end changelog generation on. Defaults to HEAD."
    )
    .option(...changelogTitle)
    .option(...changelogCommitMessage)
    .option(...baseBranch)
    .option(...quiet)
    .option(...noGitCommit)
    .example(
      example(
        "auto changelog",
        "Generate a changelog from the last release to head"
      )
    )
    .example(
      example(
        "auto changelog --from v0.20.1 --to v0.21.0",
        "Generate a changelog across specific versions"
      )
    )
    .action(run("changelog"));

  cli
    .command(
      "release",
      endent`
        Create a GitHub release for a tag. Defaults to last tag in branch.

        > NOTE: The tag must already be pushed to GitHub. If it isn't GitHub will create a tag pointing to the "to" option value.
      `
    )
    .option(...dryRun)
    .option(...noVersionPrefix)
    .option(...name)
    .option(...email)
    .option(...changelogFrom)
    .option(
      "--to <string>",
      "Git revision (tag, commit sha, ...) to end release notes at. Defaults to HEAD."
    )
    .option(...useVersion)
    .option(...baseBranch)
    .option(...prerelease)
    .example(example("auto release", "Create a GitHub release"))
    .example(
      example(
        "auto release --from v0.20.1 --to HEAD --use-version v0.21.0",
        "Create a GitHub release using provided commit range and version"
      )
    )
    .action(run("release"));

  const shipit = cli.command(
    "shipit",
    endent`
      Context aware publishing.

      1. call from base branch -> latest version released (LATEST)
      2. call from prerelease branch -> prerelease version released (NEXT)
      3. call from PR in CI -> canary version released (CANARY)
      4. call locally when not on base/prerelease branch -> canary version released (CANARY)
    `
  );

  latestCommandArgs.forEach((option) => shipit.option(...option));
  shipit
    .option(
      ...describe(
        useVersion,
        `${useVersion[1]} Currently only supported for the **npm plugin**.`
      )
    )
    .option(
      "--only-graduate-with-release-label",
      'Make auto publish prerelease versions when merging to baseBranch. Only PRs merged with "release" label will generate a "latest" release. Only use this flag if you do not want to maintain a prerelease branch, and instead only want to use baseBranch.',
      { default: false }
    )
    .example(example("auto shipit"))
    .action(run("shipit"));

  const latest = cli.command(
    "latest",
    endent`
      Run the full \`auto\` release pipeline. Force a release to latest and bypass \`shipit\` safeguards.
    `
  );

  latestCommandArgs.forEach((option) => latest.option(...option));
  latest.example(example("auto latest")).action(run("latest"));

  cli
    .command(
      "canary",
      endent`
        Make a canary release of the project. Useful on PRs. If ran locally, \`canary\` will release a canary version for your current git HEAD. This is ran automatically from "shipit".

        1. In PR: 1.2.3-canary.123.0 + add version to PR body
        2. Locally: 1.2.3-canary.1810cfd
      `
    )
    .option(...dryRun)
    .option(
      ...describe(
        pr,
        "PR number to use to create the canary version. Detected in CI env"
      )
    )
    .option(
      "--build <string>",
      "Build number to use to create the canary version. Detected in CI env"
    )
    .option(
      "--target <pr-body|comment|status>",
      "How the canary version should be attached to a PR",
      { default: "pr-body" }
    )
    .option(
      ...describe(
        message,
        "Message to comment on PR with. Defaults to 'Published PR with canary version: %v'. Pass false to disable the comment"
      )
    )
    .option(
      ...describe(
        force,
        "Force a next release, even if the last commit is marked to skip the release"
      )
    )
    .option(...quiet)
    .example(example("auto canary"))
    .example(example("auto canary --force"))
    .example(example("auto canary --pr 123 --build 5"))
    .example(
      example(
        'auto canary --message "Install PR version: `yarn add -D my-project@%v`"'
      )
    )
    .example(example("auto canary --message false"))
    .action(run("canary"));

  cli
    .command(
      "next",
      endent`
        Make a release for your "prerelease" release line. This is ran automatically by "shipit" in a prerelease branch.

        1. Creates a prerelease on package management platform
        2. Creates a "Pre Release" on GitHub releases page
        3. If ran from a PR build in a CI, posts the prerelease's full releases notes and expected version of the prerelease

        Calling the \`next\` command from a prerelease branch will publish a prerelease for just that branch, otherwise it will publish to the default prerelease branch.
      `
    )
    .option(...dryRun)
    .option(
      ...describe(
        message,
        "The message used when attaching the prerelease version to a PR"
      )
    )
    .option(
      ...describe(
        force,
        "Force a canary release, even if the PR is marked to skip the release"
      )
    )
    .option(...quiet)
    .example(example("auto next"))
    .action(run("next"));

  return cli;
}

/**
 * Respell hyphenated on/off flags in camelCase, e.g. `--dry-run` as `--dryRun`.
 * cac's parser only knows an on/off flag by its camelCased name, so `--dry-run`
 * would take the next word as its value.
 */
export function respellOnOffFlags(cli: CAC, argv: string[]) {
  const onOff = new Set(
    [cli.globalCommand, ...cli.commands]
      .flatMap((command) => command.options)
      .filter((option) => option.isBoolean && !option.negated)
      .flatMap((option) => option.names)
  );

  return argv.map((arg) => {
    const [, name, value = ""] = /^--([^=]+)(=.*)?$/.exec(arg) ?? [];
    // The same camelCasing cac applies to option names
    const camel = name?.replace(
      /([a-z])-([a-z])/g,
      (_, a: string, b: string) => a + b.toUpperCase()
    );

    return camel && onOff.has(camel) ? `--${camel}${value}` : arg;
  });
}

/** Parse the CLI args and run the command they name. */
export default async function parseArgs(
  argv: string[] = process.argv.slice(2)
) {
  const cli = createCli();

  cli.parse(["node", "auto", ...respellOnOffFlags(cli, argv)], {
    run: false,
  });

  // cac already printed help or the version
  if (
    cli.options.help ||
    (cli.options.version && cli.matchedCommandName === undefined)
  ) {
    return;
  }

  if (!cli.matchedCommand) {
    cli.outputHelp();

    if (cli.args[0]) {
      console.log(`Found unknown command: "${cli.args[0]}"`);
    }

    process.exit(1);
    return;
  }

  try {
    await cli.runMatchedCommand();
  } catch (error) {
    // Unknown options, missing values and unused args
    if (error instanceof Error && error.name === "CACError") {
      console.error(chalk.redBright("Error: "), error.message);
      process.exit(1);
      return;
    }

    throw error;
  }
}
