# Filter Accounts Plugin

Filter certain git accounts out of the changelog and version calculation.

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
