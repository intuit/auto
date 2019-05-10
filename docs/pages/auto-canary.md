# `auto canary`

Make a canary release of the project. Useful on PRs. If ran locally, `canary` will release a canary version for your current git HEAD.

1. In PR: 1.2.3-canary.123.0 + add version to PR body
2. Locally: 1.2.3-canary.1810cfd

```bash
> auto canary -h

Options

  -d, --dry-run          Report what command will do but do not actually do anything
  --pr number            PR number to use to create the canary version. Detected in CI env
  --build string         Build number to use to create the canary version. Detected in CI env
  -m, --message string   Message to comment on PR with. Defaults to 'Published PR with canary version:
                         %v'. Pass false to disable the comment

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition
                        for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition
                        for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto with. (defaults to just npm)

Examples

  $ auto canary
  $ auto canary --pr 123 --build 5
  $ auto canary --message "Install PR version: `yarn add -D my-project@%v`"
  $ auto canary --message false
```
