# Chrome Web Store

This plugin allows you to automate the publishing of chrome extensions.

## Package Configuration

You must first pack/zip your plugin before running `auto`.

These environment variables tell `auto` what to publish.

- EXTENSION_ID - your chrome extensions unique ID
- EXTENSION_ZIP - defaults to `extension.zip`

::: message is-warning
:warning: You must have a manifest.json for this plugin to work.
:::

## Chrome Environment Variables

To publish to the chrome web store you will need the following values. See [here](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md) for a guide one how to get these values.

- CLIENT_ID
- CLIENT_SECRET
- REFRESH_TOKEN
