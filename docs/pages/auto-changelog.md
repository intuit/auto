# `auto changelog`

Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes.

::: message is-warning
:warning: This should be run before `npm version` so the `CHANGELOG.md` changes are committed before the release gets tagged.
:::

```bash
>  auto changelog -h

Options

  -d, --dry-run          Dont actually commit status. Just print the request body
  --no-version-prefix    Use the version as the tag without the 'v' prefix
  --jira string          Jira base URL
  --from string          Tag to start changelog generation on. Defaults to latest tag.
  --to string            Tag to end changelog generation on. Defaults to HEAD.
  -m, --message string   Message to commit the changelog with. Defaults to 'Update CHANGELOG.md [skip ci]'

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        Version number to publish as. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use

Examples

  Generate a changelog from the last release     $ auto changelog
  to head
  Generate a changelog across specific           $ auto changelog --from v0.20.1 --to v0.21.0
  versions
```

## Jira

To include Jira story information you must include a URL to your hosted JIRA instance as a CLI flag or [.autorc`](./autorc.md) config option.

## Changelog Titles

You can customize the changelog titles and even add custom ones. To see configuration [go here](./autorc.md#changelog-titles).
