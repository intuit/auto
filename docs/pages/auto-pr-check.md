# `auto pr-check`

Check that a pull request has a SemVer label.

```sh
auto pr-check --pr 24 --url http://your-ci.com
```

## Options

```bash
>  auto pr-check -h

Options

  --pr number [required]           The pull request number you want the labels of
  --url string                     URL to associate with this status
  --onlyPublishWithReleaseLabel    Only bump version if 'release' label is on pull request
  --context string                 A string label to differentiate this status from others
  --skipReleaseLabels string[]     Labels that will not create a release. Defaults to just
                                   'skip-release'

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        Version number to publish as. Defaults to reading from the package definition for the platform
  --githubApi string    GitHub API to use

Examples

  $ auto pr-check --pr 32 --url http://your-ci.com/build/123
```
