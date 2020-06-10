# Git Tag Plugin

Manage your projects version through just a git tag. This plugin is loaded by default when `auto` is installed through the binaries released on GitHub.

If you're using this plugin you aren't releasing your code to any platform (npm, maven, etc). Instead you version calculations is done entirely though git tags.

This plugin only:

1. gets last git tag
2. bump it to new version
3. create new tags
4. push to github

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/git-tag
# or
yarn add -D @auto-it/git-tag
```

## Usage

Simply add the plugins to your auto configuration.

```json
{
  "plugins": ["git-tag"]
}
```
