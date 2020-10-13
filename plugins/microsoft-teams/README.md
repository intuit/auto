# Microsoft-Teams Plugin

Microsoft Teams plugin for auto

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/microsoft-teams
# or
yarn add -D @auto-it/microsoft-teams
```

## Usage

To use the plugin include it in your `.autorc`.
To generate incoming webhook in microsoft teams, checkout [this blog](https://medium.com/@ankush.kumar133/get-started-with-microsoft-team-connectors-incoming-webhook-a330657993e7). 

```json
{
  "plugins": [
    ["microsoft-teams", { "url": "https://url-to-your-hook.com" }],
    // or
    ["microsoft-teams", "https://url-to-your-hook.com"],
    // or
    [
      "microsoft-teams",
      { "url": "https://url-to-your--hook.com", "atTarget": "username" }
    ]
    // Below: Uses microsoft-teams hook set in process.env.MICROSOFT_TEAMS_WEBHOOK_URL
    "microsoft-teams"
  ]
}
```
