# Getting Started

Before we do anything we must first install `auto` as a dev dependency.

```sh
yarn add -D auto
```

If you are using `auto` in a non-javascript project, you can install `auto` and all it's official plugins via the [releases](https://github.com/intuit/auto/releases) page. Here you will find a build of `auto` for all major OSes. This build has `node` bundled so you don't need it installed!

## Help

To get detailed help for any command use the `--help` flag.

```sh
auto --help
# or command help
auto comment --help
```

## Enterprise

If you are using enterprise github `auto` lets you configure the github API URL that it uses. You can configure this by using the CLI option `--github-api`, by setting the value in your [.autorc](./autorc.md#githubApi), or during `auto init`.

### Project already published

If your project is already published then you need to make sure that your last release is tagged and that it's the `Latest Release` on GitHub.

To tag your last release find that last commit where you bumped the version and run the following commands with your version number.

```sh
git tag v1.2.3
git push --tags
```

Then on GitHub go to your project's releases and click `Draft a new release`. In the `Tag version` field enter the version number you just tagged and click `Publish release`.

Now your github project is set up to use `auto`.

## Configuration

Getting started with `auto` is super easy.

1. `auto init` (optional)
2. Configure environment variables
3. `auto create-labels`
4. Set up script

### 1. Initialize Options

Initialize all options and configure label text. If this is not run then `auto` will use the default configuration. This command will produce and `.autorc`, this contains advanced configuration and might not be needed.

### 2. Environment Variables

You must configure some environment variables for publishing and releasing to work properly.

- `GH_TOKEN` - Used for updating the changelog and publishing the GitHub release ([create one here](https://github.com/settings/tokens))
- `NPM_TOKEN` - Used to publish to npm. (only with NPM plugin)

#### Local `.env`

You can also store these values in a local file at the root of your project named `.env`. You should make sure to add this file to your `.gitignore` so you don't commit any keys! These env vars will override these any variable already set on the process. This enables you to have a per project configuration that isn't effected by your global setup.

**`PROJECT_ROOT/.env`:**

```bash
GH_TOKEN=YOUR_TOKEN
NPM_TOKEN=PUBLISH_TOKEN
```

#### HTTP Proxy

If you are running auto behind a `http` or `https` proxy, add either the `http_proxy` or `https_proxy` environment variable to your environment. To test locally add it to .env file. Remember this file is only local, so you will need to set the variable in your CI as well.

```bash
https_proxy=<PROXYHOST>:<PROXYPORT>
```

### 3. Labels

After that, you need to set up the labels on your github project. The types of labels that `auto` uses are:

- Versioning Labels - used to calculate version numbers and make releases. To change them refer to [this](./autorc.md#versioning-labels).
- Changelog Labels - These labels do not effect the version calculation but they will change the section the PR displays in the changelog. These are customizable too, and you can even add your own sections. Read more [here](./autorc.md#changelog-titles)

To create the labels for your project on GitHub, run the following command with your `GH_TOKEN`.

```sh
GH_TOKEN=YOUR_TOKEN auto create-labels
# or with .env file
auto create-labels
```

### 4. Script

`auto` is written so that each tool it exposes is useful in isolation. It also provides workflows for those who don't care about the details of each tool and just want their code released.

#### Quick Setup

To version, changelog, publish and release your code all at the same time, we've included the `shipit` tool. This tool takes the default `auto` workflow and puts it into one command.

It will:

1. Publish canary releases when run from a PR or locally on any branch other than the `baseBranch`
2. Generate a changelog and publish a "latest" release to a package manager when run from the `baseBranch`

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
  lerna publish --yes $VERSION -m '%v [skip ci]'
  auto release
fi
```
