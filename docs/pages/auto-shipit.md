# `auto shipit`

Run the full auto-release project. Will detect if in a lerna project and publish accordingly.

```sh
auto shipit
```

## Options

```sh

$ auto shipit --help

Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package.json
  --owner string        Version number to publish as. Defaults to reading from the package.json
  --githubApi string    Github API to use

Examples

  $ auto shipit
```
