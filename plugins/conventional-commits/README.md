# Conventional Commits Plugin

Parse [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) and use them to calculate the version. This plugin will omit the PR HEAD if it isn't labeled and has a commit with a conventional-commit commit message.

## Installation

This plugin is not included with the `auto` CLI. To install:

```sh
npm i --save-dev @intuit-auto/conventional-commits
# or
yarn add -D @intuit-auto/conventional-commits
```

## Usage

```json
{
  "plugins": [
    "conventional-commits"
    // other plugins
  ]
}
```
