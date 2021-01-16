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
        "maxAssets": 100
      }
    ]
  ]
}
```
