# `auto pr`

Set the status on a PR commit

```sh
auto pr
  --pr 24 \
  --state success \
  --description 'Your thing passed' \
  --url http://result.com \
  --context 1337c0d3
```

## Options

```bash
>  auto pr -h

usage: auto pr [-h] [--sha SHA] --state STATE --description DESCRIPTION
                    --url URL --context CONTEXT --pr PR [--owner OWNER]
                    [--repo REPO] [-v] [-vv] [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --sha SHA             Specify a custom git sha. Defaults to the HEAD for a
                        git repo in the current repository
  --state STATE         State of the PR
  --description DESCRIPTION
                        A description of the status
  --url URL             URL to associate with this status
  --context CONTEXT     A string label to differentiate this status from
                        others
  --pr PR               The pull request number you want the labels of
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```
