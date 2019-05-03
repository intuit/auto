# `auto version`

Get the semantic version bump for the given changes. Requires all PRs to have labels for the change type. If a PR does not have a label associated with it, it will default to `patch`.

```bash
>  auto version -h

Options

  --only-publish-with-release-label    Only bump version if 'release' label is on pull request
  --skip-release-labels string[]       Labels that will not create a release. Defaults to just 'skip-release'

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto with. (defaults to just npm)

Examples

  Get the new version using the last release     $ auto version
  to head
  Skip releases with multiple labels             $ auto version --skip-release-labels documentation CI

```

Useful in conjunction with `npm version` to auto-version releases.

## Prerelease

To create a prerelease add the `prerelease` label to your pull request.

## Skip Release

To not create a release for a pull request add the `skip-release` label. Any pull request with this tag will make `auto version` return `''`.

::: message is-warning
:warning: You must check the return value of `auto version` in a bash script like in the example configuration for the `skip-release` label to function properly.
:::

### Multiple

You can configure multiple labels to skip releasing as well. To do this use the `skipReleaseLabels` options. This can also be configured via the [.autorc](./autorc.md#multiple-no-version).

```sh
auto version --skip-release-labels project-files --skip-release-labels documentation
```

## Configure Versioning Labels

You can customize the versioning labels in the `.autorc`. To see configuration [go here](./autorc.md#versioning-labels).
