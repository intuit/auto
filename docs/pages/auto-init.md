# Initialization

`auto-release` provides some tools to quickly set up your project. If you do not want to use the interactive experience all these options can be configured via the [.autorc](./autorc.md) and most can be configure via CLI options.

## `auto init`

Interactive setup for most configurable options.

```sh
$ auto init --help

Options

  --only-labels    Only run init for the labels. As most other options are for advanced users

Global Options

  --platform string   Platform to interact with (supported: NPM)

Examples

  $ auto init
```

## `auto create-labels`

Create your projects labels on github.

```sh
$ auto create-labels --help

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package.json
  --owner string        Version number to publish as. Defaults to reading from the package.json
  --githubApi string    GitHub API to use
  --platform string     Platform to interact with (supported: NPM <- default)

Examples

  $ auto create-labels
```

::: message is-warning
:warning: For this to work you must have a `GH_TOKEN` set, ex: `GH_TOKEN=YOUR_TOKEN auto create-labels`
:::
