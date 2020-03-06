# GitHub Pages Plugin

Automate publishing to your gh-pages documentation website

`auto` will push a directory to your `gh-pages` branch:

1. on every release
2. if the `documentation` label is on the pull request

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/gh-pages
# or
yarn add -D @auto-it/gh-pages
```

## Usage

All you need to do a provide that path to your build documentation website.

```json
{
  "plugins": [
    ["gh-pages", { "dir": "./path/to/built/docs/website" }]
    // other plugins
  ]
}
```

### Build Your Docs

If you also want `auto` to run the build for you docs site provide the `buildCommand` option.

```json
{
  "plugins": [
    [
      "gh-pages",
      {
        "buildCommand": "npm run build:docs",
        "dir": "./path/to/built/docs/website"
      }
    ]
    // other plugins
  ]
}
```

### Pages Branch

You can configure the branch `auto` pushes to with the `branch` option.

```json
{
  "plugins": [
    [
      "gh-pages",
      {
        "branch": "docs",
        "dir": "./path/to/built/docs/website"
      }
    ]
    // other plugins
  ]
}
```

### Documentation Label

You can configure the label `auto` looks for with the `label` option.

```json
{
  "plugins": [
    [
      "gh-pages",
      {
        "label": "website",
        "dir": "./path/to/built/docs/website"
      }
    ]
    // other plugins
  ]
}
```
