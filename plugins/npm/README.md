# NPM Plugin

Publish to NPM. Works in both a monorepo setting and for a single package. This plugin is loaded by default. If you configure `auto` to use any other plugin this will be lost. So you must add the `npm` plugin to your plugins array if you still want NPM functionality.

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
    "npm"
    // other plugins
  ]
}
```

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
