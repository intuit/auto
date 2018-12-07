# `auto label`

Get the labels for a pull request. Doesn't do much, but the return value lets you write you own scripts based off of the PR labels!

```bash
>  auto label -h

usage: auto label [-h] --pr PR [--repo REPO] [--owner OWNER] [-v] [-vv]
                       [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --pr PR               The pull request number you want the labels of
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```
