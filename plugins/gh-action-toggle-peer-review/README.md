# GH-Action-Toggle-Peer-Review Plugin

Toggle 'Require pull request reviews before merging' when creating 'latest' release from a GitHub Action.

## Prerequisites

To use this plugin you will not be able to use the `GITHUB_TOKEN` in the action.
This token does not have access to toggling these settings.
You *must* create a personal access token with `repo` access.

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
