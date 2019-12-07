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

### Prerelease Branches

You can configure what branches `auto` treats as prerelease branches.
By default only `next` is treated as a prerelease branch.
If you configure `prereleaseBranches` it will override the default.

```json
{
  "prereleaseBranches": ["next", "beta"]
}
```

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

To customize your project's labels use the `labels` section in your `.autorc`.

```json
{
  "labels": [
    { "releaseType": "major", "name": "Version: Major" },
    { "releaseType": "minor", "name": "Version: Minor" },
    { "releaseType": "patch", "name": "Version: Patch" },
    { "releaseType": "skip", "name": "NO!" },
    { "releaseType": "release", "name": "Autobots, rollout!" }
  ]
}
```

#### Label Customization

You can customize everything about a label

- `name` - The label text used for the label. If omitted defaults to the `key` value
- `releaseType` - The type of release to trigger (major, minor, patch, skip, release, or none)
- `overwrite` - Overwrite the default label associated with the `type`. (default: `false`)
- `title` - The title to use in the changelog
- `description` - The description to use when creating the label
- `color` - The color of the label. Can be specified as a string in any of [these](https://github.com/bgrins/TinyColor#accepted-string-input) ways. If not specified the color is random

```json
{
  "labels": [
    {
      "name": "Version: Major",
      "title": "The API has changed:",
      "description": "Add this label to a PR to create a major release",
      "color": "blue",
      "releaseType": "major"
    }
  ]
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
  "labels": [
    {
      "name": "documentation",
      "title": "Docz"
    }
  ]
}
```

If you want more sections in your changelog to further detail the change-set you can
use the `labels` section to add more. Any label in the label section with a title
will become a special section in your changelog.

The following adds a `typescript` label to the project that we can use to denote changes
related to a TypeScript re-write.

```json
{
  "labels": [
    {
      "name": "typescript",
      "title": "TypeScript Rewrite"
    }
  ]
}
```

#### `none` Release

A label with the `none` release type will not create a release when merged.
If paired with a SEMVER label, the release is not skipped.

```json
{
  "labels": [
    {
      "name": "documentation",
      "releaseType": "none"
    }
  ]
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
