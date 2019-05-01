# `auto pr-check`

Check that a pull request has a SemVer label.

```sh
auto pr-check --pr 24 --url http://your-ci.com
```

## Options

```bash
>  auto pr-check -h

Options

  --pr number [required]               The pull request the command should use. Detects PR number in CI
  --url string                         URL to associate with this status
  --only-publish-with-release-label    Only bump version if 'release' label is on pull request
  --context string                     A string label to differentiate this status from others
  --skip-release-labels string[]       Labels that will not create a release. Defaults to just 'skip-release'
  -d, --dry-run                        Report what command will do but do not actually do anything

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto with. (defaults to just npm)

Examples

  $ auto pr-check --pr 32 --url http://your-ci.com/build/123
```
