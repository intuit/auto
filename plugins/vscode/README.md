# Vscode Plugin

Publish a vscode extension.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/vscode
# or
yarn add -D @auto-it/vscode
```

## Usage

```json
{
  "plugins": [
    "vscode"
    // other plugins
  ]
}
```

## Setup

1. [Create an organization for your extension](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/create-organization?view=azure-devops)
2. [Create a personal access token](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token) and store the token in your `.env` file as `VSCE_TOKEN` and add the same variable to your CI
3. [Create a publisher for your extension](https://aka.ms/vscode-create-publisher) and set the `publisher` in your `package.json`

That's it!

[Learn more about creating a great looking extension.](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#marketplace-integration)

## Options

### baseContentUrl

Prepend all relative links in README.md with this url.

```json
{
  "plugins": [
    [
      "vscode",
      { "baseContentUrl": "https://github.com/my-username/my-repo/tree/main" }
    ]
    // other plugins
  ]
}
```

### baseImagesUrl

Prepend all relative image links in README.md with this url.

```json
{
  "plugins": [
    // other plugins
    [
      "vscode",
      {
        "baseContentUrl": "https://raw.githubusercontent.com/my-username/my-repo/main/"
      }
    ]
  ]
}
```
