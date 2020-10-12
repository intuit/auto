# CocoaPods Plugin

Use `auto` to version your [CocoaPod](https://cocoapods.org/), and push to your specs repository!

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/cocoapods
# or
yarn add -D @auto-it/cocoapods
```

> WARNING: You can only use one "package manager" at a time!
> Mixing them will lead to undesired results.

## Usage

```json
{
  "plugins": [
    [
      "cocoapods",
      {
        // Required, the relative path to your podspec file
        "podspecPath": "./Test.podspec",
        // Optional, the specs repo to push to
        "specsRepo": "https://github.com/intuit/TestSpecs.git",
        // Optional, flags to pass to the `pod repo push` command
        "flags": ["--sources=https://github.com/SpecRepo.git"],
        // Optional, specify a different executable for `pod`
        "podCommand": "bundle exec pod"
      }
    ]
    // other plugins
  ]
}
```

## Requirements

### General

- The machine running this plugin must have the [CocoaPods](https://cocoapods.org/) `pod` CLI installed already, or `podCommand` specified in your plugin configuration.
- Your `podspec` file must pass `pod lib lint` in order for publishing to a Specs repository to work.
  - All warnings and errors must be addressed before attempting to push to a Specs repository.
- Using the logging flags with Auto (`auto -v`, `auto -vv`, `auto -q`) will also add the verbose or silent flags to the CocoaPod commands.

### Pushing to the CocoaPods Trunk

If a `specsRepo` is not provided in the plugin options, this plugin will push to the CocoaPods trunk repository. This requires that the machine running this has followed the steps for pushing to trunk, the guide for that can be found [here](https://guides.cocoapods.org/making/getting-setup-with-trunk.html#getting-started).

### Pushing to a private specs repo

If `specsRepo` is provided in the configuration, this plugin will add that repo under a temporary name, push to it, and remove the repo from the CocoaPods installation on the machine. The machine that is running the plugin must have the appropriate git credentials to push to that repository.

#### Note

When pushing to a private Specs repo, this plugin will temporarily create a repository with the name `autoPublishRepo` using `pod repo add`, and will remove it when the release has completed.
