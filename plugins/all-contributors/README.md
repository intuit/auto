# All Contributors Plugin

Automatically add contributors as changelogs are produced.

This plugin maps one of the [contribution type](vhttps://allcontributors.org/docs/en/emoji-key) to a glob or array of globs.
Out of the box the plugin will only detect the following contribution types:

- 📖 `doc` - Edits to any README, `*.md`, `docs/`, or `documentation/`
- 💡 `example` - Edits to `*.stories*`
- 🚇 `infra` - Edits to `**/.circle`, `**/.github`, `travis.yml`
- ⚠️ `test` - Edits to `*.test.*`
- 💻 `code` - Edits to `**/src`, `**/lib`, `package.json`

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npx install-peerdeps --dev @auto-it/all-contributors
```

## Prerequisites

You must have already installed and initialized `all-contributors-cli`;

```sh
npx all-contributors init
```

## Usage

```json
{
  "plugins": ["all-contributors"]
}
```

### Configure Contribution Type Matching

You use any of the [contribution type](vhttps://allcontributors.org/docs/en/emoji-key).
If you configure an pre-configured contribution type the arrays are not merged, it is overridden.

**`auto.rc`**

```json
{
  "plugins": [
    [
      "all-contributors",
      {
        "types": {
          "plugin": "**/plugin",
          "example": ["*.stories.*", "*.examples.*", "*.snippet.*"]
        }
      }
    ]
  ]
}
```

### Exclude Users

Useful for excluding bots from getting into your contributors.

**`auto.rc`**

```json
{
  "plugins": [
    [
      "all-contributors",
      {
        "exclude": ["dependabot", "ci-services"]
      }
    ]
  ]
}
```
