# Gh-Actions Plugin

Automate the publishing of GitHub actions.
Support both `docker` and JavaScript based actions.

This plugin will:

- Manage your GitHub Action's tag using semver bumps
- Keep your major version tags up to date (ex: moving v1 to the latest v1 release)

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/gh-actions
# or
yarn add -D @auto-it/gh-actions
```

## Usage

```json
{
  "plugins": [
    "gh-actions"
    // other plugins
  ]
}
```

### JavaScript Actions

In it's default mode it will create tags on master for each new release.
This workflow works for `docker` based actions or dependency and build-less JavaScript actions.
The recommended approach for JavaScript actions with dependencies and build steps is to commit them.
This is generally an anti-pattern and makes your repo less ergonomic.

To remedy this problem, this plugin can update the tag with whatever files you want! (Thanks to [Jason Etco](https://github.com/JasonEtco/build-and-tag-action) for the inspiration) This way you do not have to commit `node_modules` or your `dist` files to your repo. They instead live only in the tag alongside your `action.yml` definition.

To make things simple we recommend using [ncc](https://github.com/zeit/ncc) to bundle your JavaScript action into 1 file.
Without any settings this plugins will treat the `main` of your `package.json` as a single bundled file.

> Note: If you use this method you cannot use Version Branches. If you want this feature, please file an issue.

#### Files

Use the `files` option to make this plugin update the tag with a list of files or globs.
This is useful if you do not want to bundle your code and just want to ship `node_modules` + `dist`.

```json
{
  "plugins": [
    ["gh-actions", { "files": ["./dist/bundle.js"] }]
    // other plugins
  ]
}
```
