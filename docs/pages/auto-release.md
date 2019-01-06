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

  -d, --dry-run          Dont actually commit status. Just print the request body
  --no-version-prefix    Use the version as the tag without the 'v' prefix
  --jira string          Jira base URL
  --use-version string   Version number to publish as. Defaults to reading from the package definition for the platform.
  -s, --slack string     Url to post a slack message to about the release. If slack url
                         supplied via autorc this flag can act as a boolean.  Make sure the
                         SLACK_TOKEN environment variable is set.

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition for the platform
  --owner string        Version number to publish as. Defaults to reading from the package definition for the platform
  --githubApi string    GitHub API to use

Examples

  $ auto release
```

## Slack URL

When posting to slack you must provide your slack services hook url at the CLI or in your `.autorc` config. To see configuration [go here](./autorc.md#slack-url).
