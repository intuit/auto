# Fastlane Plugin

Use `auto` to version your [pList] using fastlane, and push to your repository!

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/fastlane
# or
yarn add -D @auto-it/fastlane
```

> WARNING: You can only use one "package manager" at a time!
> Mixing them will lead to undesired results.

## Usage

```json
{
  "plugins": [
    [
      "fastlane",
      {
        // Required, the relative path to your pList file
        "pListPath": "./Example/Info.plist",
        // Optional, specify a different executable for `fastlane`
        "fastlaneCommand": "bundle exec fastlane"
      }
    ]
    // other plugins
  ]
}
```

## Requirements

### General

- The machine running this plugin must have the [fastlane](https://fastlane.tools/) `fastlane` CLI installed already, or `fastlaneCommand` specified in your plugin configuration.
- Using the logging flags with Auto (`auto -v`, `auto -vv`, `auto -q`) will also add the verbose or silent flags to the fastlane commands.

### Pushing to the Repository


### Pushing to a private repository