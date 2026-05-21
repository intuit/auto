# Plist Plugin

Use `auto` to version Apple platform projects by keeping a version key inside an `Info.plist` file in sync with the git tag.

Works with iOS apps, macOS apps, frameworks, app extensions, and Swift package libraries that expose a runtime version through a plist.

## Installation

This plugin is included with the `auto` CLI so you do not have to install it separately. To install if you are using the `auto` API directly:

```bash
npm i --save-dev @auto-it/plist
# or
yarn add -D @auto-it/plist
```

> ⚠️ **You can only use one "package manager" plugin at a time.**  
> Do not combine this plugin with `git-tag`, `cocoapods`, `npm`, or any other versioning plugin.

## Usage

### Minimal configuration

```json
{
  "plugins": [
    ["plist", { "plistPath": "Sources/MyLibrary/Info.plist" }]
  ]
}
```

### All options

```json
{
  "plugins": [
    [
      "plist",
      {
        "plistPath": "Sources/MyLibrary/Info.plist",
        "versionKey": "CFBundleShortVersionString",
        "buildNumberKey": "CFBundleVersion",
        "publishScript": "./scripts/publish.sh"
      }
    ]
  ]
}
```

Multiple plists (e.g. an app target and an embedded framework) are also supported:

```json
{
  "plugins": [
    [
      "plist",
      {
        "plistPath": ["Sources/MyLibrary/Info.plist", "Sources/MyFramework/Info.plist"]
      }
    ]
  ]
}
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `plistPath` | `string \| string[]` | **required** | Relative path(s) to the Info.plist file(s) to manage |
| `versionKey` | `string` | `"CFBundleShortVersionString"` | The plist key whose value holds the version string |
| `buildNumberKey` | `string` | — | An optional second key to update with the same version (e.g. `"CFBundleVersion"`) |
| `publishScript` | `string` | — | Path to a script to invoke during `publish`, `canary`, and `next` hooks |

## How it works

On every release `auto` will:

1. Read the current version from the plist key
2. Calculate the next semver version based on PR labels
3. Write the new version back into the plist file (preserving all other content)
4. Commit the change with `[skip ci]` in the message
5. Create an annotated git tag at that commit
6. Push the commit and tag to your remote

Canary and next (pre-release) versions are written to the plist temporarily during publishing and then reset — they are never committed.

## Example Info.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
</dict>
</plist>
```

## Using a custom version key

If your plist uses a non-standard key (common in Swift package libraries that don't need `CFBundleShortVersionString`):

```json
{
  "plugins": [
    ["plist", { "plistPath": "Sources/MyLibrary/Info.plist", "versionKey": "LibraryVersion" }]
  ]
}
```

## Using a publish script

The optional `publishScript` is called with a single argument indicating the release type:

| Hook | Argument |
|---|---|
| `publish` | `release` |
| `canary` | `canary` |
| `next` | `next` |

```bash
#!/bin/bash
# scripts/publish.sh
RELEASE_TYPE=$1  # "release", "canary", or "next"
echo "Publishing $RELEASE_TYPE"
# ... your custom publish steps ...
```
