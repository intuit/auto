# Cocoapods Plugin

Use auto to version your [Cocoapod](https://cocoapods.org/), and push to your specs repository!

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
  ],
  // THIS IS REQUIRED
  // Cocoapods cannot work with tags in the format v1.0.0
  "noVersionPrefix": true
}
```

## Requirements

### General

- The machine running this plugin must have the [Cocoapods](https://cocoapods.org/) `pod` CLI installed already.

- Your `podspec` file must pass `pod lib lint` in order for publishing to a Specs repository to work.

### Versioning

[Cocoapods](https://cocoapods.org/) does not work with the version prefix of `v1.0.0` so all versions must be the plain semver number (`1.0.0`). You are required to set the `noVersionPrefix` setting in your auto configuration.

### Pushing to the Cocoapods Trunk

If a `specsRepo` is not provided in the plugin options, this plugin will push to the cocoapods trunk repository. This requires that the machine running this has followed the steps for pushing to trunk, the guide for that can be found [here](https://guides.cocoapods.org/making/getting-setup-with-trunk.html#getting-started).

### Pushing to a private specs repo

If `specsRepo` is provided in the configuration, this plugin will add that repo under a temporary name, push to it, and remove the repo from the cocoapods installation on the machine. The machine that is running the plugin must have the appropriate git credentials to push to that repository.
