# `auto label`

Get the labels for a pull request. Doesn't do much, but the return value lets you write you own scripts based off of the PR labels!

```bash
>  auto label -h

Options

  --pr number [required]   The pull request number you want the labels of
  -h, --help               Display the help output for the command
  -v, --verbose            Show some more logs
  -w, --very-verbose       Show a lot more logs
  --repo string            The repo to set the status on. Defaults to looking in the package.json
  --owner string           Version number to publish as. Defaults to reading from the package.json
  --githubApi string       Github API to use

Examples

  $ auto label --pr 123
```
