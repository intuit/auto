# Getting Started

Before we do anything we must first install `auto-release-cli` as a dev dependency.

```sh
yarn add -D auto-release-cli
```

## Quick Setup

To version, changelog, publish and release your code in all at the same time, we've included the `shipit` tool. This tool takes the default `auto` workflow and puts it into one command.

```json
{
  "scripts": {
    "release": "auto shipit"
  }
}
```

## Detailed Setup

The simplest workflow to get set up in just the `package.json` is by adding the following to your `package.json`. With this setup your application will not be able to use the `no-release` flag, but everything else will work just fine

```json
{
  "scripts": {
    "version": "npm version `auto version` -m 'Bump version to: %s [skip ci]'",
    "publish": "npm publish && git push --follow-tags --set-upstream origin $branch",
    "release": "auto changelog && npm run version && npm run publish && auto release"
  }
}
```

### Enabling `no-release` label

To use the `no-release` label you have to get a little more involved and use a shell script. We could do the `if` checks in the `package.json`, but this would get messy and hard to read very quickly.

```json
{
  "scripts": {
    "release": "./scripts/release.sh"
  }
}
```

Here is an example release script for a single NPM package:

```sh
export PATH=$(npm bin):$PATH

VERSION=`auto version`

## Support for label 'no-release'
if [ ! -z "$VERSION" ]; then
  ## Update Changelog
  auto changelog

  ## Publish Package
  npm version $VERSION -m "Bump version to: %s [skip ci]"
  npm publish

  ## Create GitHub Release
  git push --follow-tags --set-upstream origin $branch
  auto release
fi
```

or if you are using lerna to manage a monorepo.

```sh
export PATH=$(npm bin):$PATH

VERSION=`auto version`

if [ ! -z "$VERSION" ]; then
  auto changelog
  lerna publish --yes --force-publish=* $VERSION -m '%v [skip ci]'
  auto release
fi
```

## Enterprise

If you are using enterprise github `auto-release` lets you configure the github API URL that it uses. You can configure this by using the CLI option `--githubApi` or by setting the value in your [.autorc](./autorc.md#githubApi).
