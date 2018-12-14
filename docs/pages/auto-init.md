# Initialization

`auto-release` provides some tools to quickly set up your project. If you do not want to use the interactive experience all these options can be configured via the [.autorc](./autorc.md) and most can be configure via CLI options.

## `auto init`

Interactive setup for most configurable options.

```sh
$ auto init --help

usage: auto.js init [-h]

Optional arguments:
  -h, --help  Show this help message and exit.
```

## `auto init-labels`

Create your projects labels on github.

```sh
$ auto init-labels --help

usage: auto.js init-labels [-h] [-v] [-vv] [--githubApi GITHUBAPI]

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

::: message is-warning
:warning: For this to work you must have a `GH_TOKEN` set, ex: `GH_TOKEN=YOUR_TOKEN auto init-labels`
:::
