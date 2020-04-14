# All Contributors Plugin

Automatically add contributors as changelogs are produced.

This plugin maps one of the [contribution type](vhttps://allcontributors.org/docs/en/emoji-key) to a glob or array of globs.
Out of the box the plugin will only detect the following contribution types:

- 📖 `doc` - Edits to any README `['**/*.mdx', '**/*.md', '**/docs/**/*', '**/documentation/**/*']`
- 💡 `example` - Edits to `['**/*.stories*', '**/*.story.*']`
- 🚇 `infra` - Edits to `['**/.circle/**/*', '**/.github/**/*', '**/travis.yml'],`
- ⚠️ `test` - Edits to `['**/*.test.*']`
- 💻 `code` - Edits to `['**/src/**/*', '**/lib/**/*', '**/package.json', '**/tsconfig.json']`

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/all-contributors all-contributors-cli
# or
yarn add -D @auto-it/all-contributors all-contributors-cli
```

## Prerequisites

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
Since these contributions cannot be automated you can instead just list out another contributor's (name + GitHub username) contributions directly in the PR.

Add the following to a PR body and auto will try to parse it and add contributors from it.

```md
# Contributions

- Some Guy (@some_guy) - design, doc
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

All you need to do is initialize each sub-package you want contributors tracked in with an `.all-contributorsrc`. If no rc file is found nothing will happen for that package.

```sh
cd packages/your-package
npx all-contributors init
```

::: message is-info
ℹ️ Tip: If you only want 1 commit for new contributions set `commit` to false in all of your `.all-contributorsrc`. Otherwise a commit will be made for each package's contributor update.
:::
