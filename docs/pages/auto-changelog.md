# `auto changelog`

Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes.

::: message is-warning
:warning: This should be run before `npm version` so the `CHANGELOG.md` changes are committed before the release gets tagged.
:::

```bash
>  auto changelog -h

Options

  -d, --dry-run          Report what command will do but do not actually do anything
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
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use
  --base-branch string  Branch to treat as the "master" branch
  --plugins string[]    Plugins to load auto with. (defaults to just npm)

Examples

  Generate a changelog from the last release     $ auto changelog
  to head
  Generate a changelog across specific           $ auto changelog --from v0.20.1 --to v0.21.0
  versions
```

## Jira

To include Jira story information you must include a URL to your hosted JIRA instance as a CLI flag or [.autorc](./autorc.md) config option.

## Changelog Titles

You can customize the changelog titles and even add custom ones. To see configuration [go here](./autorc.md#changelog-titles).

## Additional Release notes

Sometimes a PR title is just not enough to capture what a user should know about that PR. That's why we have include the ability to put extra release notes right in your PRs. All you have to do is add a `Release Notes` secion in you PR.

Take the following PR body:

```md
# What Changed

Change `shipit` behavior.

## Release Notes

`auto shipit` will only ship to `latest` on the base branch ([which is configurable]()). If ran locally or from a PR it will create a `canary` release that doesn't interfere with your `latest` release.
```

This will create a special section at the top of the changelog that collects all the additional release notes from merged PRs. Below is a sample of what it might look like.

---

# v5.0.0 (Sat May 04 2019)

### Release Notes

_From #371_

`auto shipit` will only ship to `latest` on the base branch ([which is configurable]()). If ran locally or from a PR it will create a `canary` release that doesn't interfere with your `latest` release.

---

#### 💥 Breaking Change

- shipit will publish a canary locally when not on master [#371](https://github.com/intuit/auto/pull/371) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
