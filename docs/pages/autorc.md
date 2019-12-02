# `auto` RC File

All options for the CLI tools can also be configured via the `.autorc`. As CLI options you supply them in snake-case (`--foo-bar`), but as `.autorc` options you supply them in camelCase (`fooBar`),

We use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find your config. This means you can define this file a variety of ways. Our `cosmiconfig` setup is a little custom and will start at the root of your project and start to search up the directory tree for the following:

- a JSON or YAML, extension-less "rc file"
- an "rc file" with the extensions `.json`, `.yaml`, or `.yml`
- a package.json property

We do not support writing configuration files in JavaScript.

## Initialization

To interactively create an `.autorc` use the `init` command. You can configure most flags and all labels/changelogTitles.

```sh
auto init
```

## Exclusive

These options can be set exclusively in the `.autorc` and do not exist as CLI flags.

### Extending

If you want to share your auto configuration between projects you can use the `extends` property. This property will load from a module's package.json or from a custom path. It's expected that the extended configuration be under the `auto` key in the package.json file.

Auto can load `extends` configs in the following ways:

- from a path `./path/to/config` (this file must be in JSON format)
- from a scoped package `@YOUR_SCOPE/auto-config` (under the `auto` key in the package.json)
- from a package `auto-config-YOUR_NAME`
- from a url `https://yourdomain.com/auto-config.json` (must return the content type `application/json`)

```json
{
  "extends": "@YOUR_SCOPE"
}
```

Will use the package `@YOUR_SCOPE/auto-config`

```json
{
  "extends": "joe"
}
```

Will use the package `auto-config-joe`

::: message is-warning
If extending from a config package make sure it's a dependency of your project
:::

If you're extending from a local file it can be any file in JSON format or a `package.json` file.

```json
{
  "extends": "./path/to/config.json"
}
```

```json
{
  "extends": "./path/to/other/package.json"
}
```

### Labels

To override any of the default labels use the `labels` section in the `.autorc`.

```json
{
  "labels": {
    "major": "Version: Major",
    "minor": "Version: Minor",
    "patch": "Version: Patch",
    "skip-release": "NO!",
    "release": "Autobots, rollout!",
    "prerelease": "beta"
  }
}
```

#### Label Customization

You can customize everything about a label

- `name` - The label text used for the label. If omitted defaults to the `key` value
- `title` - The title to use in the changelog
- `description` - The description to use when creating the label
- `color` - The color of the label. Can be specified as a string in any of [these](https://github.com/bgrins/TinyColor#accepted-string-input) ways. If not specified the color is random

```json
{
  "labels": {
    "major": {
      "name": "Version: Major",
      "title": "The API has changed:",
      "description": "Add this label to a PR to create a major release",
      "color": "blue"
    },
    ...
  }
}
```

#### Multiple Labels

You have can multiple labels for each of the default labels.

```json
{
  "labels": {
    "major": [
      {
        "name": "BREAKING",
        "title": "SUPER BREAKING CHANGED",
      },
      {
        "name": "Version: Major",
        "title": "The API has changed:",
        "description": "Add this label to a PR to create a major release",
      }
    ],
    ...
  }
}
```

::: message is-warning
:warning: If you override any of the semantic versioning labels the default values are overridden too! Make sure to include that label if you still want it to be used during version calculation.
:::

```json
{
  "labels": {
    "minor": [
      "minor",
      {
        "name": "New Component",
        "title": "🧩 New Component",
        "description": "A new component has been added to the design-system",
      }
    ],
    ...
  }
}
```

#### Changelog Titles

By default auto will create sections in the changelog for the following labels.

- major
- minor
- patch
- internal
- documentation

To customize the title for the section in the changelog you can

```json
{
  "labels": {
    "documentation": {
      "title": "Docz"
    },
    ...
  }
}
```

If you want more sections in your changelog to further detail the change-set you can
use the `labels` section to add more. Any label in the label section with a title
will become a special section in your changelog.

The following adds a `typescript` label to the project that we can use to denote changes
related to a TypeScript re-write.

```json
{
  "labels": {
    "typescript": {
      "title": "TypeScript Rewrite"
    },
    ...
  }
}
```

#### Multiple `skip-release`

You can configure multiple labels to skip releases.

```json
{
  "skipReleaseLabels": ["documentation", "project-files"]
}
```

#### Arbitrary Labels

If you want to `auto create-labels` to add other labels to your project (ones that aren't used for
versioning or the changelog), you can use the `labels` section. Just omit the `title` property.

```json
{
  "labels": {
    "good first issue": {
      "description": "This is an issue that first time contributors can tackle easily",
      "color": "purple"
    },
    ...
  }
}
```

## CLI args

You can set any CLI option in the `.autorc` these options will get overridden by the CLI flags.

The following are options that might be more useful to set in the `.autorc` rather than with a flag.

### Base Branch

Configure what your repo considers the "master" branch.

```json
{
  "baseBranch": "trunk"
}
```

### Only Publish With Release Label

Configure the default release behavior.

```json
{
  "onlyPublishWithReleaseLabel": true
}
```

### Plugins

It is useful to specify your plugins in the rc file rather than in all the commands.

```json
{
  "plugins": ["npm", "../path/to/plugin.js", "NPM_PACKAGE_NAME"]
}
```

### githubApi

If you are using enterprise github, `auto` lets you configure the github API URL that it uses.

```json
{
  "githubApi": "https://github.mine.com/api/v3"
}
```

### githubGraphqlApi

This is used for doing some searches in `auto`.

If you are using enterprise github and your company hosts the graphql at some other URL than the `githubApi`, you can use `githubGraphqlApi` to set the base path for `auto`. The `githubGraphqlApi` get merged with `/graphql` to build the final URL.

```json
{
  "githubGraphqlApi": "https://github.mine.com/api/"
}
```

### name

Git name to commit and release with. Used in `auto changelog` and `auto release`

```json
{
  "name": "Joe Schmo"
}
```

### email

Git email to commit and release with. Used in `auto changelog` and `auto release`

```json
{
  "email": "joe@schmo.com"
}
```
