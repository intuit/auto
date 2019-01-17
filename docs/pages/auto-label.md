# `auto label`

Get the labels for a pull request. Doesn't do much, but the return value lets you write you own scripts based off of the PR labels!

```bash
>  auto label -h

Options

  --pr number   The pull request number you want the labels of (defaults to last merged PR)

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto-release with. (defaults to just npm)

Examples

  $ auto label --pr 123
```

## Without PR Number

Running `auto label` without the PR number enables it to run in master after a PR has been merged. You can use these labels to automate more things in your merge build pipeline other than the release.

`auto-release` the project uses this to only deploy the documentation when the last merged PR has a `documentation` label.
