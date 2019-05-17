# auto CLI

Generate releases based on semantic version labels on pull requests

```sh
$ auto -h

Synopsis

  $ auto <command> <options>

Setup Commands

  init            Interactive setup for most configurable options
  create-labels   Create your project's labels on github. If labels exist it will update them.

Release Commands

  version     Get the semantic version bump for the given changes.
  changelog   Prepend release notes to 'CHANGELOG.md'
  release     Auto-generate a github release
  shipit      Run the full `auto` release pipeline. Detects if in a lerna project.

              1. call from base branch -> latest version released
              2. call from PR in CI -> canary version released
              3. call locally when not on base branch -> canary version released
  canary      Make a canary release of the project. Useful on PRs. If ran locally, `canary` will release a canary version for
              your current git HEAD.

              1. In PR: 1.2.3-canary.123.0 + add version to PR body
              2. Locally: 1.2.3-canary.1810cfd

Pull Request Interaction Commands

  label      Get the labels for a pull request
  pr-check   Check that a pull request has a SemVer label
  pr         Set the status on a PR commit
  comment    Comment on a pull request with a markdown message. Each comment has a context, and each context only has one
             comment.
  pr-body    Update the body of a PR with a message. Appends to PR and will not overwrite user content. Each comment has a
             context, and each context only has one comment.

Global Options

  -V, --version         Display auto's version
  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition
                        for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition
                        for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto with. (defaults to just npm)
```
