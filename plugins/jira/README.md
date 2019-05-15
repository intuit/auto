# Jira Plugin

To include Jira story information in your changelogs you must include a URL to your hosted JIRA instance.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @intuit-auto/jira
# or
yarn add -D @intuit-auto/jira
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
