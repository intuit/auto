# Getting Started

Before we do anything we must first install `auto-release-cli` as a dev dependency.

```sh
yarn add -D auto-release-cli
```

## Enterprise

If you are using enterprise github `auto-release` lets you configure the github API URL that it uses. You can configure this by using the CLI option `--github-api`, by setting the value in your [.autorc](./autorc.md#githubApi), or during `auto init`.

### Project already published

If you're project is already published then you need to make sure that your last release is tagged and that it's the `Latest Release` on GitHub.

To tag your last release find that last commit where you bumped the version and run the following commands with your version number.

```sh
git tag v1.2.3
git push --tags
```

Then on GitHub go to your project's releases and click `Draft a new release`. In the `Tag version` field enter the version number you just tagged and click `Publish release`.

Now your github project is set up to use `auto-release`.

## Configuration

Getting started with `auto-release` is super easy.

1. `auto init` (optional)
2. `auto create-labels`
3. Configure environment variables
4. Set up script

### 1. Initialize Options

Initialize all options and configure label text. If this is not run then `auto-release` will use the default configuration. This command will produce and `.autorc`, this contains advanced configuration and might not be needed.

### 2. Labels

After that, you need to set up the labels on your github project. The types of labels that `auto-release` uses are:

- Versioning Labels - used to calculate version numbers and make releases. To change them refer to [this](./autorc.md#versioning-labels).
- Changelog Labels - These labels do not effect the version calculation but they will change the section the PR displays in the changelog. These are customizable too, and you can even add your own sections. Read more [here](./autorc.md#changelog-titles)

To create the labels for your project on GitHub, run the following command with your `GH_TOKEN`.

```sh
GH_TOKEN=YOUR_TOKEN auto create-labels
```

### 3. Environment Variables

You must configure some environment variables for publishing and releasing to work properly.

- `GH_TOKEN` - Used for updating the changelog and publishing the GitHub release
- `NPM_TOKEN` - Used to publish to npm.

If you are publishing from the CI you must inject the `NPM_TOKEN` into your `.npmrc`.

```sh
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
```

### 4. Script

`auto-release` is written so that each tool it exposes is useful in isolation. It also provides workflows for those who don't care about the details of each tool and just want their code released.

#### Quick Setup

To version, changelog, publish and release your code all at the same time, we've included the `shipit` tool. This tool takes the default `auto` workflow and puts it into one command.

```json
{
  "scripts": {
    "release": "auto shipit"
  }
}
```

#### Detailed Setup

The simplest workflow to get set up in just the `package.json` is by adding the following to your `package.json`. With this setup your application will not be able to use the `skip-release` flag, but everything else will work just fine

```json
{
  "scripts": {
    "version": "npm version `auto version` -m 'Bump version to: %s [skip ci]'",
    "publish": "npm publish && git push --follow-tags --set-upstream origin $branch",
    "release": "auto changelog && npm run version && npm run publish && auto release"
  }
}
```

##### Enabling `skip-release` label

To use the `skip-release` label you have to get a little more involved and use a shell script. We could do the `if` checks in the `package.json`, but this would get messy and hard to read very quickly.

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

## Support for label 'skip-release'
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
