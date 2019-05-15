# Chrome Web Store

This plugin allows you to automate the publishing of chrome extensions

::: message is-success
Example Repo: [here](https://github.com/hipstersmoothie/auto-chrome)
:::

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @intuit-auto/chrome
# or
yarn add -D @intuit-auto/chrome
```

## Usage

You must first pack/zip your plugin before running `auto`.

These environment variables tell `auto` what to publish.

- EXTENSION_ID - your chrome extensions unique ID (REQUIRED)
- EXTENSION_BUILD - Path to either a zip file, or a directory to be zip. defaults to `extension.zip`

Or you can set these values in the autorc:

```json
{
  "plugins": [
    [
      "chrome",
      {
        "id": "1234",
        "build": "path/to/zip/or/folder",
        "manifest": "path/tp/manifest.json"
      }
    ]
  ]
}
```

::: message is-warning
:warning: You must have a manifest.json for this plugin to work.
:::

## Chrome Environment Variables

To publish to the chrome web store you will need the following values. See [here](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md) for a guide one how to get these values.

- CLIENT_ID
- CLIENT_SECRET
- REFRESH_TOKEN
