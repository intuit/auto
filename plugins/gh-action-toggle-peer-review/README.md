# GH-Action-Toggle-Peer-Review Plugin

Toggle 'Require pull request reviews before merging' when creating 'latest' release from a GitHub Action.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/github-action-toggle-peer-review
# or
yarn add -D @auto-it/github-action-toggle-peer-review
```

## Usage

```json
{
  "plugins": [
    ["github-action-toggle-peer-review"]
    // other plugins
  ]
}
```
