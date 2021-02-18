# All Contributors Plugin

Automatically add contributors as changelogs are produced.

This plugin maps one of the [contribution type](https://allcontributors.org/docs/en/emoji-key) to a glob or array of globs.
Out of the box the plugin will only detect the following contribution types:

- 📖 `doc` - Edits to any README `['**/*.mdx', '**/*.md', '**/docs/**/*', '**/documentation/**/*']`
- 💡 `example` - Edits to `['**/*.stories*', '**/*.story.*']`
- 🚇 `infra` - Edits to `['**/.circle/**/*', '**/.github/**/*', '**/travis.yml'],`
- ⚠️ `test` - Edits to `['**/*.test.*']`
- 💻 `code` - Edits to `['**/src/**/*', '**/lib/**/*', '**/package.json', '**/tsconfig.json']`

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/all-contributors
# or
yarn add -D @auto-it/all-contributors
```

## Prerequisites

For this plugin to work your project needs to have initialized an `all-contributors` RC file.

```bash
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
          "plugin": "**/plugin/**/*",
          "example": ["**/*.stories.*", "**/*.examples.*", "**/*.snippet.*"]
        }
      }
    ]
  ]
}
```

### Adding Non-Code Contributions

Sometimes you worked with a person that didn't touch the code personally so this plugin would never attribute them with any contributions.
Since these contributions cannot be automated you can instead just list out another contributor's contributions directly in the PR.
These contributors will also be added to all changelogs that `auto` outputs.

Add the following to a PR body and `auto` will try to parse it and add contributors from it.

```md
# Contributions

- @some_guy - design, doc
```

To ensure you are doing it right `auto` will comment on the PR with the people + contributions you are manually adding.

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

### Sub-Package Contributors list

Maintain contributors lists for sub-packages in a monorepo setup (`lerna`/`yarn`).

All you need to do is initialize each sub-package you want contributors tracked in with an `.all-contributorsrc`. If no rc file is found nothing will happen for that package. Any non-code contribution listed in the PR body will also be added to the sub-package contributors list.

```bash
cd packages/your-package
npx all-contributors init
```

> ℹ️ Tip: If you only want 1 commit for new contributions set `commit` to false in all of your `.all-contributorsrc`. Otherwise a commit will be made for each package's contributor update.
