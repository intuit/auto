# `auto release`

Auto-generate a github release.

```json
{
  "scripts": {
    "postpublish": "auto release"
  }
}
```

Make sure the branch/tag you're releasing is on github before running `auto release`.
You will need to push the tags to github first:

```json
{
  "scripts": {
    "postpublish": "git push --follow-tags --set-upstream origin $branch && auto release"
  }
}
```

## Options

```bash
>  auto release -h

Options

  -d, --dry-run          Report what command will do but do not actually do anything
  --no-version-prefix    Use the version as the tag without the 'v' prefix
  --from string          Git revision (tag, commit sha, ...) to start release notes from. Defaults to latest tag.
  --use-version string   Version number to publish as. Defaults to reading from the package definition for the platform.

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition for the platform
  --github-api string   GitHub API to use
  --base-branch string  Branch to treat as the "master" branch
  --plugins string[]    Plugins to load auto with. (defaults to just npm)

Examples

  $ auto release
  $ auto release --from v0.20.1 --use-version v0.21.0
```
