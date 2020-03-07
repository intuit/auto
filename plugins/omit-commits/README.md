# Omit Commits Plugin

Filter certain commits out of the changelog and version calculation.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/omit-commits
# or
yarn add -D @auto-it/omit-commits
```

## Usage

Yarn can omit by most any field available on a commit. Each options accepts either a string or an array of strings.

```jsonc
{
  "plugins": [
    [
      "omit-commits",
      {
        // By usernames
        "username": ["pdbf", "ghost"],
        // By name
        "name": "Adam",
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
