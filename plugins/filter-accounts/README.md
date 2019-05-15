# Filter Accounts Plugin

Filter certain git accounts out of the changelog and version calculation.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @intuit-auto/filter-accounts
# or
yarn add -D @intuit-auto/filter-accounts
```

## Usage

Simply supply the names of the account to filter

```json
{
  "plugins": [
    ["filter-accounts", { "accounts": ["pdbf", "ghost"] }],
    // or
    ["filter-accounts", ["pdbf", "ghost"]]
  ]
}
```
