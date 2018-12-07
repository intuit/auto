# `auto comment`

Comment on a pull request with a markdown message.

```sh
auto comment --pr 24 --message "You broke the build!" --context build
```

## Options

```bash
>  auto version -h

usage: auto comment [-h] -m MESSAGE [--context CONTEXT] [--owner OWNER]
                         [--repo REPO] --pr PR [-v] [-vv]
                         [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  -m MESSAGE, --message MESSAGE
                        Message to post to comment.
  --context CONTEXT     A string label to differentiate this status from
                        others
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  --pr PR               The pull request number you want the labels of
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```
