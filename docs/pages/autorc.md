# `auto` RC File

All options for the CLI tools can also be configured via the `.autorc`.

We use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find your config, so that means you can define this file a variety of ways. By default, Cosmiconfig will start at the root of your project and start to search up the directory tree for the following:

- a package.json property
- a JSON or YAML, extension-less "rc file"
- an "rc file" with the extensions .json, .yaml, .yml, or .js.
- a .config.js CommonJS module

## Exclusive

These options can be set exclusively in the `.autorc` and do not exist as CLI flags.

### Versioning Labels

To override the label text used for versioning define new labels in the `.autorc`.

```json
{
  "labels": {
    "major": "Version: Major",
    "minor": "Version: Minor",
    "patch": "Version: Patch",
    "no-release": "NO!",
    "release": "Autobots, rollout!",
    "prerelease": "beta"
  }
}
```

### Changelog Titles

To configure the titles used in the changelog add `changelogTitles` to the `.autorc`.

```json
{
  "changelogTitles": {
    "major": "Breaking",
    "minor": "Feature",
    "patch": "Fix",
    "internal": "Internal",
    "documentation": "Docz"
  }
}
```

If you want more sections in your changelog to further detail the change set you can use the `changelogTitles` to add more.

```json
{
  "changelogTitles": {
    "typescript": "Typescript Rewrite",
    "front-end": "Front End Updates",
    "back-end": "Back End Updates"
  }
}
```

### Slack URL

You can set where `auto` posts for slack messages.

```json
{
  "slack": "https://url-to-slack.com"
}
```

## CLI args

You can set any CLI option in the `.autorc` these options will get overridden by the CLI flags.

The following are options that might be more useful to set in the `.autorc` rather than with a flag.

### Jira

To include Jira story information in your changelogs you must include a URL to your hosted JIRA instance.

```json
{
  "jira": "https://url-to-jira.com"
}
```

### githubApi

If you are using enterprise github `auto-release` lets you configure the github API URL that it uses.

```json
{
  "jira": "https://url-to-jira.com"
}
```
