# Upload Assets Plugin

Upload assets to the release.
Good for executables and extra downloadable files.
Also supports canaries!

> NOTE: For canaries to work this plugin must be listed before any other publishing plugin.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/upload-assets
# or
yarn add -D @auto-it/upload-assets
```

## Usage

Simply supply the paths to the assets to add to the release.

```json
{
  "plugins": [
    ["upload-assets", { "assets": ["./path/to/file"] }],
    // or
    ["upload-assets", ["./path/to/file"]],
    // or use globs to upload multiple things
    ["upload-assets", ["./path/**/to/*.file"]]
  ]
}
```

## Options

### `maxCanaryAssets`

Max number of assets to keep in the canary release.

```json
{
  "plugins": [
    [
      "upload-assets",
      {
        "assets": ["./path/to/file"],
        "maxCanaryAssets": 100
      }
    ]
  ]
}
```

### `headerMessage`

Custom message for header in Pull Requests.

```json
{
  "plugins": [
    [
      "upload-assets",
      {
        "assets": ["./path/to/file"],
        "headerMessage": "🚀 Download links canary assets with custom message:"
      }
    ]
  ]
}
```

### `filter`

Filter assets by regular expression. This check are using `test` method from RegEx object.

```json
{
  "plugins": [
    [
      "upload-assets",
      {
        "assets": [
          "./test-assets/color_test.xml",
          "./test-assets/typo_test.xml",
          "./test-assets/shadow_test",
          "./test-assets/macos"
        ],
        "filter": "(color).*\\.xml"
      }
    ]
  ]
}
```

Get result:

🐤 Download canary assets:

[color_test-canary.123.xml](http://color_test-canary.123.xml)

### `includeBotPrs`

Whether to comment on Pull Requests made by bots. Default `true`.

```json
{
  "plugins": [
    [
      "upload-assets",
      {
        "assets": ["./path/to/file"],
        "includeBotPrs": false
      }
    ]
  ]
}
```

### `group`

Group assets by regular expression. This check are using `exec` method from RegEx object and get second output.

```json
{
  "plugins": [
    [
      "upload-assets",
      {
        "assets": [
          "./test-assets/color_test.xml",
          "./test-assets/shadow_test.xml",
          "./test-assets/typo_test.xml"
        ],
        "group": "(color|shadow|typo).*\\.xml"
      }
    ]
  ]
}
```

Get result:

🐤 Download canary assets:

### color

[color_test-canary.123.xml](http://color_test-canary.123.xml)

### shadow

[shadow_test-canary.123.xml](http://shadow_test-canary.123.xml)

### typo

[typo_test-3-canary.123.xml](http://typo_test-3-canary.123.xml)

### `compact`

Compact view for Pull Requests comment. Default `false`.

```json
{
  "plugins": [
    [
      "upload-assets",
      {
        "assets": [
          "./test-assets/color_test.xml",
          "./test-assets/shadow_test.xml",
          "./test-assets/typo_test.xml"
        ],
        "compact": "true"
      }
    ]
  ]
}
```

Get result:

```HTML
<details>
  <summary>:baby_chick: Download canary assets:</summary>
  <blockquote>
    <a href='http://color_test-canary.123.xml'>color_test-canary.123.xml</a><br>
    <a href='http://shadow_test-canary.123.xml'>shadow_test-canary.123.xml</a><br>
    <a href='http://typo_test-canary.123.xml'>typo_test-canary.123.xml</a><br>
  </blockquote>
</details>
```
