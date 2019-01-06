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

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        Version number to publish as. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use

Examples

  $ auto comment --pr 123 --comment "# Why you're wrong..."
```
