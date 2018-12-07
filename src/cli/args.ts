import { ArgumentParser } from 'argparse';
import SEMVER from '../semver';

export type ParserFunction = (parser: ArgumentParser) => void;

const enum ACTION_TYPES {
  storeTrue = 'storeTrue'
}

const addPr = (parser: ArgumentParser, required = true) =>
  parser.addArgument('--pr', {
    help: 'The pull request number you want the labels of',
    required
  });

const addUrl = (parser: ArgumentParser) =>
  parser.addArgument(['--url'], {
    help: 'URL to associate with this status',
    required: true
  });

const addRepo = (parser: ArgumentParser) =>
  parser.addArgument('--repo', {
    help:
      'The repo to set the status on. Defaults to looking in the package.json'
  });

const addOwner = (parser: ArgumentParser) =>
  parser.addArgument(['--owner'], {
    help:
      'Version number to publish as. Defaults to reading from the package.json'
  });

const addDryRun = (parser: ArgumentParser) =>
  parser.addArgument(['-d', '--dry-run'], {
    help: 'Dont actually commit status. Just print the request body',
    action: ACTION_TYPES.storeTrue
  });

const addNoVersionPrefix = (parser: ArgumentParser) =>
  parser.addArgument(['--no-version-prefix'], {
    help: 'Use the version as the tag without the `v` prefix',
    action: ACTION_TYPES.storeTrue
  });

const addMessage = (parser: ArgumentParser, help: string, required = false) =>
  parser.addArgument(['-m', '--message'], {
    help,
    required
  });

const addContext = (
  parser: ArgumentParser,
  required = true,
  defaultValue?: string
) =>
  parser.addArgument(['--context'], {
    help: 'A string label to differentiate this status from others',
    required,
    defaultValue
  });

const addJira = (parser: ArgumentParser) =>
  parser.addArgument(['--jira'], {
    help: 'Jira base URL'
  });

function addLoggingParser(parser: ArgumentParser) {
  parser.addArgument(['-v', '--verbose'], {
    help: 'Show some more logs',
    action: ACTION_TYPES.storeTrue
  });

  parser.addArgument(['-vv', '--very-verbose'], {
    help: 'Show a lot more logs',
    action: ACTION_TYPES.storeTrue
  });

  parser.addArgument(['--githubApi'], {
    help: 'Github API to use'
  });
}

function addSemverParser(parser: ArgumentParser) {
  parser.addArgument(['--onlyPublishWithReleaseLabel'], {
    help: 'Only bump version if `release` label is on pull request',
    action: ACTION_TYPES.storeTrue
  });

  parser.addArgument(['--major'], {
    help: 'The name of the tag for a major version bump',
    defaultValue: SEMVER.major
  });

  parser.addArgument(['--minor'], {
    help: 'The name of the tag for a minor version bump',
    defaultValue: SEMVER.minor
  });

  parser.addArgument(['--patch'], {
    help: 'The name of the tag for a patch version bump',
    defaultValue: SEMVER.patch
  });
}

// All of the parsers for each command are setup in their own functions
// This allows us to either use separate commands for each one (github-pr, github-label)
// or group them under a single root command (github pr, github label)
// without having to redeclare any of the args each command needs.

export function addLabelParser(parser: ArgumentParser) {
  addPr(parser);
  addRepo(parser);
  addOwner(parser);

  addLoggingParser(parser);
}

export function addPRCheckParser(parser: ArgumentParser) {
  addPr(parser);
  addDryRun(parser);
  addUrl(parser);
  addOwner(parser);
  addRepo(parser);
  addContext(parser, false, 'ci/pr-check');

  addSemverParser(parser);
  addLoggingParser(parser);
}

export function addPRParser(parser: ArgumentParser) {
  parser.addArgument(['--sha'], {
    help:
      'Specify a custom git sha. Defaults to the HEAD for a git repo in the current repository'
  });

  parser.addArgument(['--state'], {
    required: true,
    help: 'State of the PR',
    optionStrings: ['pending', 'success', 'error', 'failure']
  });

  parser.addArgument(['--description'], {
    help: 'A description of the status',
    required: true
  });

  addUrl(parser);
  addContext(parser);
  addPr(parser);
  addOwner(parser);
  addRepo(parser);

  addLoggingParser(parser);
}

export function addReleaseParser(parser: ArgumentParser) {
  parser.addArgument(['-s', '--slack'], {
    help:
      'Post a message to slack about the release. Make sure the SLACK_TOKEN environment variable is set.'
  });

  parser.addArgument(['--use-version'], {
    help:
      'Version number to publish as. Defaults to reading from the package.json.'
  });

  addJira(parser);
  addNoVersionPrefix(parser);
  addDryRun(parser);

  addLoggingParser(parser);
}

export function addVersionParser(parser: ArgumentParser) {
  addSemverParser(parser);
  addLoggingParser(parser);
}

export function addChangelogParser(parser: ArgumentParser) {
  parser.addArgument(['--from'], {
    help: 'Tag to start changelog generation on. Defaults to latest tag.'
  });

  parser.addArgument(['--to'], {
    help: 'Tag to end changelog generation on. Defaults to HEAD.'
  });

  addJira(parser);
  addNoVersionPrefix(parser);
  addDryRun(parser);
  addMessage(
    parser,
    'Message to commit the changelog with. Defaults to "Update CHANGELOG.md [skip ci]"'
  );

  addLoggingParser(parser);
}

export function addCommentParser(parser: ArgumentParser) {
  addMessage(parser, 'Message to post to comment.', true);
  addContext(parser, false);
  addOwner(parser);
  addRepo(parser);
  addPr(parser);

  addLoggingParser(parser);
}

export const PARSERS: [string, ParserFunction][] = [
  ['label', addLabelParser],
  ['pr', addPRParser],
  ['pr-check', addPRCheckParser],
  ['release', addReleaseParser],
  ['version', addVersionParser],
  ['comment', addCommentParser],
  ['changelog', addChangelogParser]
];

const rootParser = new ArgumentParser({
  addHelp: true,
  description: 'A CI/CD helper for releasing with GitHub'
});

const subParsers = rootParser.addSubparsers({
  dest: 'command'
});

PARSERS.forEach(([parserName, parserFunction]) => {
  parserFunction(
    subParsers.addParser(parserName, {
      addHelp: true
    })
  );
});

export interface ISemverArgs {
  onlyPublishWithReleaseLabel?: boolean;
  major?: string;
  minor?: string;
  patch?: string;
  jira?: string;
  slack?: string;
  githubApi?: string;
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
  ILogArgs;

export default function parse(stuff?: string[]): ArgsType {
  return rootParser.parseArgs(stuff);
}
