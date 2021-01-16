# Git Tag Plugin

Manage your projects version through just a git tag.
This plugin is loaded by default when `auto` is installed through the binaries released on GitHub.

If you're using this plugin you aren't releasing your code to any platform (npm, maven, etc). Instead you version calculations is done entirely though git tags.

This plugin only:

1. gets last git tag
2. bump it to new version
3. create new tags
4. push to github

It will not:

1. Publish to a specific platform
2. Use any platform specific project information (ex: `author` or `repo` from a `package.json`)

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/git-tag
# or
yarn add -D @auto-it/git-tag
```

> WARNING: You can only use one "package manager" at a time!
> Mixing them will lead to undesired results.

## Usage

Simply add the plugins to your auto configuration.

```json
{
  "plugins": ["git-tag"]
}
```

## Canary Releases

This plugin does not support canaries.
For canary support try using [the upload-assets plugin](./upload-assets)
