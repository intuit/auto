# Released Plugin

This plugin

- comments on the merged PR with the new version
- comments on closed issues with the new version
- adds a `released` label to the pull request
- adds a `released` label to closed issues

> :warning: Make sure that you create the `released` label on you project

## Installation

This plugin is included with the `auto` CLI so you do not have to install it. To install if you are using the `auto` API directly:

```bash
npm i --save-dev @auto-it/released
# or
yarn add -D @auto-it/released
```

## Usage

To use the plugin include it in your `.autorc`

```json
{
  "plugins": ["released"]
}
```

## Options

### Label

Customize the label this plugin attaches to merged pull requests.

```json
{
  "plugins": [
    [
      "released",
      {
        "label": ":shipit:"
      }
    ]
  ]
}
```

### Prerelease Label

Customize the prerelease label this plugin attaches to pull requests merged to prerelease branches.

```json
{
  "plugins": [
    [
      "released",
      {
        "prereleaseLabel": "🚧"
      }
    ]
  ]
}
```

### Message

To customize the message this plugin uses on issues and pull requests use the following format.

- `%TYPE` - Either `PR` or `Issue`
- `%VERSION` - The version that was just published

```json
{
  "plugins": [
    [
      "released",
      {
        "message": "%TYPE went out with version: %VERSION"
      }
    ]
  ]
}
```

### Lock Issue

Lock issues that have been merged in PRs.

```json
{
  "plugins": [["released", { "lockIssues": true }]]
}
```

### Include Bot Prs

Whether to comment on PRs made by bots.

```json
{
  "plugins": [["released", { "includeBotPrs": true }]]
}
```
