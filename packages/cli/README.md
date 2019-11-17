# auto CLI

`auto` is a tool designed to seamlessly automate the release workflow. It is powered by semantic version labels on pull requests, so does not require you to change your code or make drastic changes to your current workflow.

While intended to run in a continuous integration (CI) environment, all `auto` commands can run locally as well.

## Installation

`auto` by distributed through npm but you can use it with a variety of package management platforms.

```sh

npm install auto

```
For `auto` installation in `non-npm` environments,follow these [instructions](https://intuit.github.io/auto/pages/non-npm.html#installation)

## Getting Started

Getting started with `auto` is super easy.

1.Initialize all options and configure label text. If this is not run then `auto` will use the default configuration. This command will produce an `.autorc`. You can configure most flags and all labels/changelogTitles.
```sh

auto init

```

All options for the CLI tools can also be configured via the `.autorc` file. As CLI options you supply them in snake-case `(--foo-bar)`, but as `.autorc` options you supply them in camelCase `(fooBar)`,

[Exclusive options](https://intuit.github.io/auto/pages/autorc.html#exclusive)(extends, labels) can be set exclusively in the `.autorc` and do not exist as CLI flags.

Any CLI option in the `.autorc` will get overridden by the CLI flags.
The following are options that might be more useful to set in the `.autorc` rather than with a flag
```sh

  baseBranch           Configure what your repo considers the "master" branch.
  plugins              Specify your plugins to load
  githubApi            If you are using enterprise github, `auto` lets you configure the github API URL that it uses.
  githubGraphqlApi .   If you are using enterprise github and your company hosts the graphql at some other URL than the
                       `githubApi`, you can use `githubGraphqlApi` to set the base path for `auto`. The `githubGraphqlApi` gets 
                       merged with `/graphql` to build the final URL.
  name                 Git name to commit and release with. Used in `auto changelog` and `auto release`
  email                Git email to commit and release with.
 
 ```
If you are using enterprise github and your project is already published,you need to make sure that your last release is tagged and that it's the `Latest Release` on GitHub.

To tag your last release find that last commit where you bumped the version and run the following commands with your version number.
```sh

git tag v1.2.3
git push --tags

```
Then on GitHub go to your project's releases and click `Draft a new release`. In the `Tag version` field enter the version number you just tagged and click `Publish release`.

Now your github project is set up to use `auto`.

2.Configure environment variables

You must configure some environment variables for publishing and releasing to work properly.

`GH_TOKEN` - Used for updating the changelog and publishing the GitHub release
`NPM_TOKEN` - Used to publish to npm. (only with NPM plugin)

Local `.env`:
You can also store these values in a local file at the root of your project named `.env`. You should make sure to add this file to your `.gitignore` so you don't commit any keys! These env vars will override these any variable already set on the process. This enables you to have a per project configuration that isn't effected by your global setup.

`PROJECT_ROOT/.env`:
```sh
GH_TOKEN=YOUR_TOKEN
NPM_TOKEN=PUBLISH_TOKEN
```

HTTP Proxy
If you are running auto behind a `http` or `https` proxy, add either the `http_proxy` or `https_proxy` environment variable to your environment. To test locally add it to .env file. Remember this file is only local, so you will need to set the variable in your CI as well.
```sh

https_proxy=<PROXYHOST>:<PROXYPORT>

```

3.Create your project's labels on github. If labels already exist, it will update them.

The types of labels that `auto` uses are:

Versioning Labels - used to calculate version numbers and make releases.
Changelog Labels - These labels do not effect the version calculation but they will change the section the PR displays in the changelog. These are customizable too, and you can even add your own sections. Read more [here](https://intuit.github.io/auto/pages/autorc.html#changelog-titles)
To create the labels for your project on GitHub, run the following command with your `GH_TOKEN`.
```sh

GH_TOKEN=YOUR_TOKEN auto create-labels
# or with .env file
auto create-labels

```

4.Set up script

`auto` is written so that each tool it exposes is useful in isolation.To version, changelog, publish and release your code all at the same time, we've included the `shipit` tool. This tool takes the default auto workflow and puts it into one command.

It will:

1.Publish canary releases when run from a PR or locally on any branch other than the `baseBranch`
2.Generate a changelog and publish a "latest" release to a package manager when run from the `baseBranch`
```sh

{
  "scripts": {
    "release": "auto shipit"
  }
}

```
For detailed setup instructions,refer [here](https://intuit.github.io/auto/pages/getting-started.html#detailed-setup)

## Usage labels

```sh
Synopsis

  $ auto <command> <options>

Setup Commands

  init            Interactive setup for most configurable options
  create-labels   Create your project's labels on github. If labels exist it will update them.

Release Commands

  version     Get the semantic version bump for the given changes using merged PRs.For options,refer [here](https://intuit.github.io/auto/pages/generated/version.html#options)
  changelog   Prepend release notes to 'CHANGELOG.md'(link PRs and Jira stories, attach effected packages in monorepo, list authors,                     customizable sections).For options, refer [here](https://intuit.github.io/auto/pages/generated/changelog.html#options)
  release     Auto-generate a github release.For options, refer [here](https://intuit.github.io/auto/pages/generated/release.html#options)
  shipit      Run the full `auto` release pipeline. Detects if in a lerna project.For options, refer [here](https://intuit.github.io/auto/pages/generated/shipit.html#options)

              1. call from base branch -> latest version released
              2. call from PR in CI -> canary version released
              3. call locally when not on base branch -> canary version released
  canary      Make a canary release of the project. Useful on PRs. If ran locally, `canary` will release
              a canary version for your current git HEAD.For options,refer [here](https://intuit.github.io/auto/pages/generated/canary.html#options)

              1. In PR: 1.2.3-canary.123.0 + add version to PR body
              2. Locally: 1.2.3-canary.1810cfd

Pull Request Interaction Commands

  label      Get the labels for a pull request.For options, refer [here](https://intuit.github.io/auto/pages/generated/label.html#options)
  pr-check   Check that a pull request has a SemVer label.For options, refer [here](https://intuit.github.io/auto/pages/generated/pr-check.html#options)
  pr         Set the status on a PR commit.For options, refer [here](https://intuit.github.io/auto/pages/generated/pr-status.html#options)
  comment    Comment on a pull request with a markdown message. Each comment has a context, and each
             context only has one comment.For options, refer [here](https://intuit.github.io/auto/pages/generated/comment.html#options)
  pr-body    Update the body of a PR with a message. Appends to PR and will not overwrite user content.
             Each comment has a context, and each context only has one comment.For options,refer [here](https://intuit.github.io/auto/pages/generated/pr-body.html#options)

```

## Available Global Options

```
  -V, --version         Display auto's version
  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package definition
                        for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition
                        for the platform
  --github-api string   If you are using enterprise github, `auto` lets you configure the github API URL
                        that it uses by setting the value in your `.autorc`, or during `auto init`.
  --plugins string[]    Plugins to load auto with. (defaults to just `npm` or `git-tag`)
```

## Merging Quickly

One major caveat of `auto` is that you need to be mindful of merging multiple PRs at once. You must not merge two PRs at once or you will botch one of the releases.

`auto` works by looking at the `git` tree to calculate the version bump then makes commits for the `CHANGELOG.md` and the new version. If you merge two PRs at once:

1.one might pick up the others changes
2.they might try to publish the same version number
3.one will try to push over the other's changes and fail

The one [exception](https://intuit.github.io/auto/pages/quick-merge.html#with-skip-release) to this rule with when merging a bunch of PRs with `skip-release` labels.

You still can't merge a PR that triggers a release and then merge a PR with `skip-release`. This will result in problem 3 from above.
But you can merge a bunch of PRs with `skip-release` then merge a PR that triggers a release.
Because `skip-release` is present no commits are made and the release is fine!
