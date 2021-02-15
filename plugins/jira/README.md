# Jira Plugin

Include links to Jira stories in your changelogs.

This plugin will create links to Jira stories using the following syntax in a pull request title:

```txt
JIRA-123: My pull request title
[JIRA-123]: My pull request title
```

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/jira
# or
yarn add -D @auto-it/jira
```

## Usage

To use the plugin include it in your `.autorc`

```json
{
  "plugins": [
    ["jira", { "url": "https://url-to-your-jira.com" }],
    // or
    ["jira", "https://url-to-your-jira.com"]
  ]
}
```
