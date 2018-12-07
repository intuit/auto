# `auto version`

Get the semantic version bump for the given changes. Requires all PRs to have labels for the change type. If a PR does not have a label associated with it, it will default to `patch`.

```bash
>  auto version -h

usage: auto version [-h] [--onlyPublishWithReleaseLabel] [--major MAJOR]
                         [--minor MINOR] [--patch PATCH] [-v] [-vv]
                         [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --onlyPublishWithReleaseLabel
                        Only bump version if `release` label is on pull
                        request
  --major MAJOR         The name of the tag for a major version bump
  --minor MINOR         The name of the tag for a minor version bump
  --patch PATCH         The name of the tag for a patch version bump
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

Useful in conjunction with `npm version` to auto-version releases.

## Prerelease

To create a prerelease add the `prerelease` label to your pull request.

## No Release

To not create a release for a pull request add the `no-release` label. Any pull request with this tag will make `auto version` return `''`.

::: message is-warning
:warning: You must check the return value of `auto version` in a bash script like in the example configuration for the `no-release` label to function properly.
:::

## Configure Versioning Labels

You can customize the versioning labels in the `.autorc`. To see configuration [go here](./autorc.md#versioning-labels).
