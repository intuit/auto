# `auto pr-check`

Update the body of a PR with a message. Appends to PR and will not overwrite user content. Each comment has a context, and each context only has one comment.

```sh
auto pr-body --pr 24 --message "Canary Version: 1.2.3"
```

## Options

```bash
>  auto pr-body -h

Options

  --pr number                       The pull request the command should use. Detects PR number in CI
  --context string                  A string label to differentiate this status from others
  --delete                          Delete old PR body update
  -m, --message string [required]   Message to post to PR body
  -d, --dry-run                     Report what command will do but do not actually do anything

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

  $ auto pr-body --delete
  $ auto pr-body --pr 123 --comment "The new version is: 1.2.3"
```
