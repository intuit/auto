# Upload Assets Plugin

Upload assets to the release. Good for executables and extra downloadable files.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
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
