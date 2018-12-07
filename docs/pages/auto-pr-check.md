# `auto pr-check`

Check that a pull request has a SemVer label.

```sh
auto pr-check --pr 24 --url http://your-ci.com
```

## Options

```bash
>  auto pr-check -h

usage: auto pr-check [-h] [--pr PR] [-d] --url URL
                          [--owner OWNER] [--repo REPO]
                          [--onlyPublishWithReleaseLabel] [--major MAJOR]
                          [--minor MINOR] [--patch PATCH] [-v] [-vv]
                          [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --pr PR       The PR number
  -d, --dry-run         Dont actually commit status. Just print the request
                        body
  --url URL             URL to associate with this status
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  --onlyPublishWithReleaseLabel
                        Only bump version if `release` label is on pull
                        request
  --major MAJOR         The name of the tag for a major version bump
  --minor MINOR         The name of the tag for a minor version bump
  --patch PATCH         The name of the tag for a patch version bump
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```
