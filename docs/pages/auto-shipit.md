# `auto shipit`

Run the full `auto` release pipeline. Will detect if in a lerna project and publish accordingly.

```sh
auto shipit
```

## Options

```sh

$ auto shipit --help

Options

  -d, --dry-run    Report what command will do but do not actually do anything

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto with. (defaults to just npm)

Examples

  $ auto shipit
```
