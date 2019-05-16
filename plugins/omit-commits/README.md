# Omit Commits Plugin

Filter certain commits out of the changelog and version calculation.

## Installation

This plugin is not included with the `auto` CLI. To install:

```sh
npm i --save-dev @intuit-auto/omit-commits
# or
yarn add -D @intuit-auto/omit-commits
```

## Usage

Yarn can omit by most any field available on a commit. Each options accepts either a string or an array of strings.

```json
{
  "plugins": [
    [
      "omit-commits",
      {
        // By usernames
        "username": ["pdbf", "ghost"],
        // By emails
        "email": ["foo@gmail.com", "doesnt-exits@yahoo.com"],
        // By presence of string in subject
        "subject": ["WIP", "SPIKE"],
        // By labels
        "labels": "grunt-work"
      }
    ]
  ]
}
```
