# GitHub Pages Plugin

Automate publishing to your gh-pages documentation website

`auto` will push a directory to your project's `gh-pages` branch:

1. on every release
2. if the `documentation` label is on the pull request

**What is a `gh-pages` branch?**

The `gh-pages` branch is a special branch in your repository that you can use to store your built website.
This branch will not track any of the source files for your project, but will have things like an `index.html` and all the other files needed to render your website.
The benefit of this is that you don't have to store any dist files in your `baseBranch`.

[Take a look at `auto`'s `gh-pages` branch/](https://github.com/intuit/auto/tree/gh-pages)

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
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

You _must_ also make sure that your built website is in your `.gitignore`.
Otherwise your release will fail because of uncommitted changes.

**.gitignore:**

```sh
./path/to/built/docs/website
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
