# auto CLI

`auto` is a tool designed to seamlessly automate the release workflow.
It is powered by [semantic version](https://semver.org/) labels on pull requests.
This approach does not require you to change your code or make any drastic changes to your current workflow.

While intended to run in a continuous integration (CI) environment, all `auto` commands can run locally as well.

## Installation

`auto` is distributed through npm, but you can use it with a variety of package management platforms.

```bash
npm install auto
```

For `auto` installation in `non-npm` environments follow these [instructions](https://intuit.github.io/auto/pages/non-npm.html#installation).

## Getting Started

Getting started with `auto` is super easy.

### Prerequisites

If your project is already published or has releases then you need to make sure that your last release is tagged and that it's the `Latest Release` on GitHub.

To tag your last release find the last commit where you bumped the version and run the following commands with your version number.

```bash
git tag v1.2.3
git push --tags
```

Then on GitHub go to your project's releases and click `Draft a new release`.
In the `Tag version` field enter the version number you just tagged and click `Publish release`.

### Setup Steps

1. **(OPTIONAL)** Initialize all options and configure label text.
   If this is not run then `auto` will use the default configuration.
   This command will produce an `.autorc`.
   You can configure most flags and all labels/changelogTitles.

   ```bash
   auto init
   ```

   All options can also be configured via the `.autorc` file.
   As CLI options you supply them in snake-case `(--foo-bar)`, but as `.autorc` options you supply them in camelCase `(fooBar)`,

   [Exclusive options](https://intuit.github.io/auto/pages/autorc.html#exclusive) (extends, labels) can only be set in the `.autorc` and do not exist as CLI flags.

   Any option in the `.autorc` will get overridden by the CLI flags if provided.
   The following are options that might be more useful to set in the `.autorc` than with a flag:

   ```txt
     baseBranch           Configure what your repo considers the base branch.
     plugins              Specify your plugins to load
     githubApi            If you are using enterprise github, `auto` lets you configure the github API URL that it uses.
     githubGraphqlApi     If you are using enterprise github and your company hosts the graphql at some other URL than the
                          `githubApi`, you can use `githubGraphqlApi` to set the base path for `auto`. The `githubGraphqlApi` gets
                          merged with `/graphql` to build the final URL.
   ```

2. Configure environment variables

   You must configure some environment variables for publishing and releasing to work properly.

   - `GH_TOKEN` - Used for updating the changelog and publishing the GitHub release
   - `NPM_TOKEN` - Used to publish to npm. (only with NPM plugin)

   **Local `.env`:**

   You can also store these values in a local file at the root of your project named `.env`.
   Make sure to add this file to your `.gitignore` so you don't commit any keys!
   These environment variables will override any variable already set on the process.
   This enables you to have a per project configuration that isn't effected by your global setup.

   `PROJECT_ROOT/.env`:

   ```bash
   GH_TOKEN=YOUR_TOKEN
   NPM_TOKEN=PUBLISH_TOKEN
   ```

3. Create your project's labels on github. If a label already exist, it will be updated.

   The types of labels that `auto` uses are:

   - Versioning Labels - used to calculate version numbers and make releases.
   - Changelog Labels - These labels do not effect the version calculation but they will change the section the PR displays in the changelog.
     These are customizable too, and you can even add your own sections. Read more [here](https://intuit.github.io/auto/pages/autorc.html#changelog-titles).

   To create the labels for your project on GitHub, run the following command with your `GH_TOKEN`.

   ```bash
   GH_TOKEN=YOUR_TOKEN auto create-labels
   # or with .env file
   auto create-labels
   ```

4. Set up script

   `auto` is written so that each tool it exposes is useful in isolation.
   To version, changelog, publish and release your code all at the same time we've included the `shipit` tool.
   This tool takes the default `auto` workflow and puts it into one command.

   It will:

   - Publish canary releases when run from a PR or locally on any branch other than the `baseBranch`
   - Generate a changelog and publish a "latest" release to a package manager when run from the `baseBranch`

   ```json
   {
     "scripts": {
       "release": "auto shipit"
     }
   }
   ```

   For detailed setup instructions,refer [here](https://intuit.github.io/auto/pages/getting-started.html#detailed-setup)

## Usage (`--help`)

```txt
$ auto --help

auto

  Generate releases based on semantic version labels on pull requests, and
  other pull request automation tools.

Synopsis

  $ auto <command> <options>

Setup Command

  init            Interactive setup for minimum working configuration.
  info            Determine the environment and check if auto is set up correctly
  create-labels   Create your project's labels on github. If labels exist it will update them.

Pull Request Interaction Commands

  label       Get the labels for a pull request. Doesn't do much, but the return value lets you write you own
              scripts based off of the PR labels!
  comment     Comment on a pull request with a markdown message. Each comment has a context, and each context only
              has one comment.
  pr-check    Check that a pull request has a SemVer label
  pr-status   Set the status on a PR commit
  pr-body     Update the body of a PR with a message. Appends to PR and will not overwrite user content. Each
              comment has a context, and each context only has one comment.

Release Commands

  version     Get the semantic version bump for the given changes. Requires all PRs to have labels for the change
              type. If a PR does not have a label associated with it, it will default to `patch`.
  changelog   Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes.
  release     Auto-generate a github release
  shipit      Context aware publishing.

              1. call from base branch -> latest version released (LATEST)
              2. call from prerelease branch -> prerelease version released (NEXT)
              3. call from PR in CI -> canary version released (CANARY)
              4. call locally when not on base/prerelease branch -> canary version released (CANARY)
  latest      Run the full `auto` release pipeline. Force a release to latest and bypass `shipit` safeguards.
  canary      Make a canary release of the project. Useful on PRs. If ran locally, `canary` will release a canary
              version for your current git HEAD. This is ran automatically from "shipit".

              1. In PR: 1.2.3-canary.123.0 + add version to PR body
              2. Locally: 1.2.3-canary.1810cfd
  next        Make a release for your "prerelease" release line. This is ran automatically from "shipit".

              1. Creates a prerelease on package management platform
              2. Creates a "Pre Release" on GitHub releases page.

              Calling the `next` command from a prerelease branch will publish a prerelease, otherwise it will
              publish to the default prerelease branch.

Global Options

  -V, --version         Display auto's version
  -v, --verbose         Show some more logs. Pass -vv for very verbose logs.
  --repo string         The repo to set the status on. Defaults to looking in the package definition
                        for the platform
  --owner string        The owner of the GitHub repo. Defaults to reading from the package definition
                        for the platform
  --github-api string   GitHub API to use
  --plugins string[]    Plugins to load auto with. (defaults to just npm)
  -h, --help            Display the help output
```

## Merging Quickly

One caveat of `auto` is that you need to be mindful of merging multiple PRs at once. You **must not** merge a PR while another is publishing (ex: `lerna publish`). While this window is small, it exists and you should know about it.

`auto` works by looking at the `git` tree to calculate the version bump then makes commits for the `CHANGELOG.md` and the new version. If you merge a PR while another is publishing:

- they might try to publish the same version number
- one will try to push over the other's changes and fail

The one [exception](https://intuit.github.io/auto/pages/quick-merge.html#with-skip-release) to this rule with when merging a bunch of PRs with `skip-release` labels.

You still can't merge a PR that triggers a release and then merge a PR with `skip-release`. This will result in problem 3 from above.
But you can merge a bunch of PRs with `skip-release` then merge a PR that triggers a release.
Because `skip-release` is present no commits are made and the release is fine!

## Enterprise

If you are using enterprise Github, `auto` lets you configure the Github API URL that it uses. You can configure this by using the CLI option --github-api, by setting the value in your `.autorc`, or during `auto init`.
