# CocoaPods Plugin

Use `auto` to version your [CocoaPod](https://cocoapods.org/), and push to your specs repository!

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/cocoapods
# or
yarn add -D @auto-it/cocoapods
```

## Usage

```jsonc
{
  "plugins": [
    [
      "cocoapods",
      {
        // Required, the relative path to your podspec file
        "podspecPath": "./Test.podspec",
        // Optional, the specs repo to push to
        "specsRepo": "https://github.com/intuit/TestSpecs.git"
      }
    ]
    // other plugins
  ]
}
```

## Requirements

### General

- The machine running this plugin must have the [CocoaPods](https://cocoapods.org/) `pod` CLI installed already.

- Your `podspec` file must pass `pod lib lint` in order for publishing to a Specs repository to work.

### Pushing to the CocoaPods Trunk

If a `specsRepo` is not provided in the plugin options, this plugin will push to the CocoaPods trunk repository. This requires that the machine running this has followed the steps for pushing to trunk, the guide for that can be found [here](https://guides.cocoapods.org/making/getting-setup-with-trunk.html#getting-started).

### Pushing to a private specs repo

If `specsRepo` is provided in the configuration, this plugin will add that repo under a temporary name, push to it, and remove the repo from the CocoaPods installation on the machine. The machine that is running the plugin must have the appropriate git credentials to push to that repository.
