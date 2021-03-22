# Slack Plugin

Post your release notes to a slack channel.

![Example slack release notes](https://user-images.githubusercontent.com/1192452/112035992-5ad1f400-8afd-11eb-9241-3567db8bd395.png)

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

```jsonc
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

For this to work you need to [create an app](https://api.slack.com/apps) with the following permissions:

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

```jsonc
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

### username

Username to post the message as.

```json
{
  "plugins": [
    [
      "slack",
      {
        "url": "https://url-to-your-slack-hook.com",
        "username": "My Project"
      }
    ]
  ]
}
```

### iconUrl

Image url to use as the message's avatar.

```json
{
  "plugins": [
    [
      "slack",
      {
        "url": "https://url-to-your-slack-hook.com",
        "iconUrl": "http://lorempixel.com/48/48"
      }
    ]
  ]
}
```

> NOTE: If both `iconUrl` and `iconEmoji` are specified only `iconUrl` will be respected

### iconEmoji

Emoji code to use as the message's avatar.

```json
{
  "plugins": [
    [
      "slack",
      {
        "url": "https://url-to-your-slack-hook.com",
        "iconEmoji": ":chart_with_upwards_trend:"
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

## Creating a Slack App

There are a lot of steps to creating a Slack app and installing it.
Let's go over what you'll need to do to get set up with app auth.

1. [Create the app](https://api.slack.com/apps)
2. From your app's `Basic Information` page go to `Permissions => Bot Token Scopes` and add `chat:write` and `file:write` (Optionally add `chat:write.customize` to use the `username` and `icon` options)
3. Copy the `Bot User OAuth Access Token` into your `.env` file and store it as `SLACK_TOKEN`
4. Install the app in the channels you want it to post to via the Slack UI

### Customize the App

To make you app shine in Slack head to `Basic Information` and scroll down to `Display Information`.
Her you should set a description for the app and give it an `icon` and `color`.

This could be your code's logo or one of [our](https://github.com/intuit/auto/blob/main/docs/public/logo-large-dark.png) [logos](https://github.com/intuit/auto/blob/main/docs/public/logo-large.png).
