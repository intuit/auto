# Slack Plugin

Post your release notes to a slack channel

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/slack
# or
yarn add -D @auto-it/slack
```

## Usage

To use the plugin include it in your `.autorc`.

```json
{
  "plugins": [
    // or
    ["slack", { "url": "https://url-to-your-slack-hook.com" }],
    // or
    ["slack", "https://url-to-your-slack-hook.com"],
    // or
    [
      "slack",
      { "url": "https://url-to-your-slack-hook.com", "atTarget": "here" }
    ],
    // Below: Uses slack hook set in process.env.SLACK_WEBHOOK_URL
    "slack"
  ]
}
```

This URL should be to you webhook. Store it in `SLACK_WEBHOOK_URL` for more security. If you require a token to post to a slack hook, make sure you have a `SLACK_TOKEN` variable available on your environment. This token will be added to eh URL as a query string parameter.

## Options

### publishPreRelease

If you are using a `prerelease` branch like `next`, Slack will not post a message by default.
This is done to avoid spamming your consumers every time you make a preview release.
However, if you would like to configure it such that Slack _does_ post on prerelease, you can add the `publishPreRelease` to your `.autorc` like so:

```json
{
  "plugins": [
    [
      "slack",
      { "url": "https://url-to-your-slack-hook.com", "publishPreRelease": true }
    ]
  ]
}
```

### title

Additional Title to add at the start of the slack message.

```json
{
  "plugins": [
    [
      "slack",
      {
        "url": "https://url-to-your-slack-hook.com",
        "title": "My Cool Project"
      }
    ]
  ]
}
```
