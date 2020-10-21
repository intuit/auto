# Conventional Commits Plugin

Parse [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) and use them to calculate the version. This plugin will omit the PR HEAD if it isn't labeled and has a commit with a conventional-commit commit message.

The default behavior extends the [conventional commits spec](https://www.conventionalcommits.org/en/v1.0.0/#summary):

- Type `fix:` => `patch`
- Type `feat:` => `minor`
- Type `BREAKING:` => `minor`
- A `!` in the type indicated a breaking change
- `BREAKING CHANGE` in the footer indicates a breaking change
- All other types are considered `skip-release`

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/conventional-commits
# or
yarn add -D @auto-it/conventional-commits
```

## Usage

```json
{
  "plugins": [
    "npm",
    "conventional-commits"
    // other plugins
  ]
}
```

## Options

You can use any [conventional-changelog preset](https://www.npmjs.com/search?q=conventional-changelog%20preset%20) with this plugin.
Using a preset will completely override this plugin's default behavior with whatever the preset defines.

```json
{
  "plugins": [
    "npm",
    ["conventional-commits", { "preset": "angular" }]
    // other plugins
  ]
}
```
