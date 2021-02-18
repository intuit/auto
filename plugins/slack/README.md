# Slack Plugin

Post your release notes to a slack channel.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/slack
# or
yarn add -D @auto-it/slack
```

## Usage

### Incoming Webhook + Token

This is the easier option to set up, but it has less features than [app auth](#app-auth-token).

There are a few options on how to call/construct the webhook URL:

```json
{
  "plugins": [
    // Webhook URL Only:
    // Store the hook URL in `SLACK_WEBHOOK_URL` so you don't commit it
    "slack",
    // Incoming  Webhook URL + Token:
    // Set generic app hook URL in `.autorc` as `url` and set the
    // `SLACK_TOKEN` variable available on your environment.
    //
    // This token will be added to the URL as a query string parameter.
    ["slack", { "url": "https://url-to-your-slack-hook.com" }]
  ]
}
```

[Read more about Slack incoming webhooks here.](https://api.slack.com/messaging/webhooks)

### App Auth Token

An incoming webhook can work for most situations but to enable a better integration we need an app auth token. This enables us to:

- Upload text snippets for code blocks in release notes
- Post to multiple channels

For this to work you need to create a token with the following permissions:

- `files:write`
- `chat:write`

Set the `auth` option to `app` and the `SLACK_TOKEN` will be used to authenticate as an app.

```json
{
  "plugins": [
    [
      "slack",
      {
        "auth": "app",
        "channels": ["app-update-channel", "private-team-channel"]
      }
    ]
  ]
}
```

[Read about creating an installing apps.](https://api.slack.com/start/overview#creating)

## Options

### atTarget

Who to tag when posting a message.
Defaults to `channel`.

Some less chatty options are:

```json
{
  "plugins": [
    [
      "slack",
      {
        "url": "https://url-to-your-slack-hook.com",
        // Only tag people online
        "atTarget": "here"
      }
    ],
    [
      "slack",
      {
        "url": "https://url-to-your-slack-hook.com",
        // Tag a custom group, like the channel admin
        "atTarget": "channel-admin"
      }
    ]
  ]
}
```

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

### channels (App Auth Only)

Channel, private group, or IM channel to send message to.
Can be an encoded ID, or a name.

```json
{
  "plugins": [
    [
      "slack",
      {
        "auth": "app",
        "channels": ["app-update-channel", "private-team-channel"]
      }
    ]
  ]
}
```

[Read here for more details.](https://api.slack.com/methods/chat.postMessage#channels)
