# Upload Assets Plugin

Upload assets to the release. Good for executables and extra downloadable files.

## Installation

This plugin is not included with the `auto` CLI. To install:

```sh
npm i --save-dev @intuit-auto/upload-assets
# or
yarn add -D @intuit-auto/upload-assets
```

## Usage

Simply supply the paths to the assets to add to the release.

```json
{
  "plugins": [
    ["upload-assets", { "assets": ["./path/to/file"] }],
    // or
    ["upload-assets", ["./path/to/file"]]
  ]
}
```
