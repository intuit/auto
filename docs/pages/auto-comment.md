# `auto comment`

Comment on a pull request with a markdown message.

```sh
auto comment --pr 24 --message "You broke the build!" --context build
```

## Options

```bash
>  auto version -h

Options

  --pr number [required]            The pull request number you want the labels of
  --context string                  A string label to differentiate this status from others
  -m, --message string [required]   Message to post to comment
  -d, --dry-run                     Report what command will do but do not actually do anything

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto with. (defaults to just npm)

Examples

  $ auto comment --pr 123 --comment "# Why you're wrong..."
```
