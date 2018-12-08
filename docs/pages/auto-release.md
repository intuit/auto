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

usage: auto release [-h] [-s SLACK] [--use-version USE_VERSION]
                       [--jira JIRA] [--no-version-prefix] [-d] [-v] [-vv]
                       [--githubApi GITHUBAPI] [--name NAME] [--email EMAIL]


Optional arguments:
  -h, --help            Show this help message and exit.
  -s SLACK, --slack SLACK
                        Post a message to slack about the release. Make sure
                        the SLACK_TOKEN environment variable is set.
  --use-version USE_VERSION
                        Version number to publish as. Defaults to reading
                        from the package.json.
  --jira JIRA           Jira base URL
  --no-version-prefix   Use the version as the tag without the `v` prefix
  -d, --dry-run         Dont actually commit status. Just print the request
                        body
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
  --name NAME           Git name to commit and release with. Defaults to
                        package.json
  --email EMAIL         Git email to commit with. Defaults to package.json
```

## Slack URL

When posting to slack you must provide your slack services hook url at the CLI or in your `.autorc` config. To see configuration [go here](./autorc.md#slack-url).
