# `auto changelog`

Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes.

::: message is-warning
:warning: This should be run before `npm version` so the `CHANGELOG.md` changes are committed before the release gets tagged.
:::

```bash
>  auto changelog -h

usage: auto changelog [-h] [--from FROM] [--to TO] [--jira JIRA]
                           [--no-version-prefix] [-d] [-m MESSAGE] [-v] [-vv]
                           [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --from FROM           Tag to start changelog generation on. Defaults to
                        latest tag.
  --to TO               Tag to end changelog generation on. Defaults to HEAD.
  --jira JIRA           Jira base URL
  --no-version-prefix   Use the version as the tag without the `v` prefix
  -d, --dry-run         Dont actually commit status. Just print the request
                        body
  -m MESSAGE, --message MESSAGE
                        Message to commit the changelog with. Defaults to
                        "Update CHANGELOG.md [skip ci]"
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

## Jira

To include Jira story information you must include a URL to your hosted JIRA instance as a CLI or `.autorc` config option.

## Changelog Titles

You can customize the changelog titles and even add custom ones. To see configuration [go here](./autorc.md#changelog-titles).
