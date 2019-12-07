# NPM Plugin

Publish to NPM. Works in both a monorepo setting and for a single package. This plugin is loaded by default when `auto` is installed through `npm`. If you configure `auto` to use any other plugin this will be lost. So you must add the `npm` plugin to your plugins array if you still want NPM functionality.

## Prerequisites

To publish to npm you will need an `NPM_TOKEN` set in your environment.

## Installation

This plugin is included with the `auto` CLI so you do not have to install it. To install if you are using the `auto` API directly:

```sh
npm i --save-dev @auto-it/npm
# or
yarn add -D @auto-it/npm
```

## Usage

```json
{
  "plugins": [
    "npm",
    // or with options
    ["npm", { "forcePublish": false }]
    // other plugins
  ]
}
```

## Monorepo Usage

The `npm` plugin works out of the box with `lerna` in both [`independent`](https://github.com/lerna/lerna#independent-mode) and [`fixed`](https://github.com/lerna/lerna#fixedlocked-mode-default) mode. `auto` works on a repo basis and should be run from the root of the repo, not on each sub-package. No additional setup is required.

## Options

### setRcToken

When running the `shipit` command auto will try to set your `.npmrc` token while publishing. To disable this feature you must set the `setRcToken` to false.

```json
{
  "plugins": [
    [
      "npm",
      {
        "setRcToken": false
      }
    ]
  ]
}
```

### forcePublish

By default `auto` will force publish all packages for monorepos. To disable this behavior you must set the `setRcToken` to false.

```json
{
  "plugins": [
    [
      "npm",
      {
        "forcePublish": false
      }
    ]
  ]
}
```

### subPackageChangelogs

`auto` will create a changelog for each sub-package in a monorepo.
You can disable this behavior by using the `subPackageChangelogs` option.

```json
{
  "plugins": [
    [
      "npm",
      {
        "subPackageChangelogs": false
      }
    ]
  ]
}
```

### deprecateCanaries

`auto` will mark canaries as deprecated, as these version should only be used for testing.

```json
{
  "plugins": [
    // Do not deprecate canary versions
    [
      "npm",
      {
        "deprecateCanaries": false
      }
    ],
    // Or customize the message. Will replace %package with package name.
    [
      "npm",
      {
        "subPackageChangelogs": "This is a canary version of %package, please use @latest!"
      }
    ]
  ]
}
```
