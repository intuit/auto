# Omit Release Notes Plugin

Filter PRs with release notes that shouldn't make it into a release. By default `auto` will not include and `Release Notes` from [renovate](https://renovatebot.com/) PRs. This plugin allows you to omit more PRs from effecting you releases.

## Installation

This plugin is not included with the `auto` CLI. To install:

```sh
npm i --save-dev @intuit-auto/omit-release-notes
# or
yarn add -D @intuit-auto/omit-release-notes
```

## Usage

Yarn can omit by most any field available on a PR. Each options accepts either a string or an array of strings.

```json
{
  "plugins": [
    [
      "omit-release-notes",
      {
        // By usernames
        "username": ["pdbf", "ghost"],
        // By name
        "name": "Adam",
        // By emails
        "email": ["foo@gmail.com", "doesnt-exits@yahoo.com"],
        // By labels
        "labels": "grunt-work"
      }
    ]
  ]
}
```
