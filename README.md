<div align="center">
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
  <img width="200" height="200"
    src="./auto.gif">
  <h1>auto-release</h1>
  <p>Generate releases based on semantic version labels on pull requests.</p>
</div

[![Codecov](https://img.shields.io/codecov/c/github/intuit/auto-release.svg?style=for-the-badge)](https://codecov.io/gh/intuit/auto-release) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier) [![CircleCI](https://img.shields.io/circleci/project/github/intuit/auto-release/master.svg?style=for-the-badge)](https://circleci.com/gh/intuit/auto-release)

CI/CD helpers for github releases. Generate releases based on semantic version labels on pull requests.

Release Features:

- Release every merge to master based on a PR labels
- Skip a release with the `no-release` label
- Generate a changelog with fancy headers, authors, and monorepo package association
- Generate a Github release

Pull Request Interaction Features:

- Get the labels for a PR
- Set the status of a PR
- Check that a pull request has a SemVer label
- Comment on a PR with markdown

## API

### Publishing

The following tools help facilitate automated publishing.

Here is an example release release script:

```sh
export PATH=$(npm bin):$PATH

VERSION=`auto version`

## Support for label 'no-release'
if [ ! -z "$VERSION" ]; then
  auto changelog
  npm version $VERSION -m "Bump version to: %s [skip ci]"
  npm publish
  git push --follow-tags --set-upstream origin $branch
  auto release
fi
```

or for lerna

```sh
export PATH=$(npm bin):$PATH

VERSION=`auto version`

if [ ! -z "$VERSION" ]; then
  auto changelog
  lerna publish --yes --force-publish=* $VERSION -m '%v [skip ci]'
  auto release
fi
```

or you could just use scripts

```json
{
  "scripts": {
    "release": "if [ ! -z `auto version` ]; then npm run publish; fi",
    "prepublish": "auto changelog",
    "publish": "npm version `auto version` -m \"Bump version to: %s [skip ci]\" && npm publish",
    "postpublish": "git push --follow-tags --set-upstream origin $branch && auto release"
  }
}
```

#### `auto version`

Get the semantic version bump for the given changes. Requires all PRs to have labels for the change type.

```bash
>  auto version -h

usage: auto version.js [-h] [--onlyPublishWithReleaseLabel] [--major MAJOR]
                         [--minor MINOR] [--patch PATCH] [-v] [-vv]
                         [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --onlyPublishWithReleaseLabel
                        Only bump version if `release` label is on pull
                        request
  --major MAJOR         The name of the tag for a major version bump
  --minor MINOR         The name of the tag for a minor version bump
  --patch PATCH         The name of the tag for a patch version bump
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

Useful in conjunction with `npm version` to auto-version releases.

##### Prerelease

To create a prerelease add the `prerelease` label to your pull request.

##### No Release

To not create a release for a pull request add the `no-release` label. Any pull request with this tag will make `auto version` return `''`.

**_NOTE:_** You must check the return value of `auto version` in a bash script like in the example above for the `no-release` label to function properly.

##### Configure Versioning Labels

To override the label text used for versioning define new labels in the `.autorc`.

```json
{
  "labels": {
    "major": "Version: Major",
    "minor": "Version: Minor",
    "patch": "Version: Patch",
    "no-release": "NO!",
    "release": "Autobots, rollout!",
    "prerelease": "beta"
  }
}
```

#### `auto changelog`

Prepend release notes to `CHANGELOG.md`, create one if it doesn't exist, and commit the changes.

NOTE: This should be run before `npm version` so the `CHANGELOG.md` changes are committed before the release gets tagged.

```bash
>  auto changelog -h

usage: auto changelog.js [-h] [--from FROM] [--to TO] [--jira JIRA]
                           [--no-version-prefix] [-d] [-m MESSAGE] [-v] [-vv]
                           [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --from FROM           Tag to start changelog generation on. Defaults to
                        latest tag.
  --to TO               Tag to end changelog generation on. Defaults to HEAD.
  --jira JIRA           Jira base URL
  --no-version-prefix   Use the version as the tag without the `v` prefix
  -d, --dry-run         Don't actually commit status. Just print the request
                        body
  -m MESSAGE, --message MESSAGE
                        Message to commit the changelog with. Defaults to
                        "Update CHANGELOG.md [skip ci]"
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

##### Jira

To include Jira story information you must include a URL to your hosted JIRA instance as a CLI or `.autorc` config option.

#### `auto release`

Auto-generate a github release.

```json
# package.json
{
    "postpublish": "auto release"
}
```

Make sure the branch/tag you're releasing is on github before running `auto release`.
You may need to push the tags to github first:

```json
# package.json
{
    "postpublish": "git push --follow-tags --set-upstream origin $branch && auto release"
}
```

```bash
>  auto release -h

usage: auto release.js [-h] [-s SLACK] [--use-version USE_VERSION]
                         [--jira JIRA] [--no-version-prefix] [-d] [-v] [-vv]
                         [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  -s SLACK, --slack SLACK
                        Post a message to slack about the release. Make sure
                        the SLACK_TOKEN environment variable is set.
  --use-version USE_VERSION
                        Version number to publish as. Defaults to reading
                        from the package.json.
  --jira JIRA           Jira base URL
  --no-version-prefix   Use the version as the tag without the `v` prefix
  -d, --dry-run         Don't actually commit status. Just print the request
                        body
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

##### Slack URL

When posting to slack you must provide your slack services hook url at the CLI or in your `.autorc` config.

##### Changelog Titles

To configure the titles used in the changelog add `changelogTitles` to the `.autorc`.

```json
{
  "changelogTitles": {
    "major": "Breaking",
    "minor": "Feature",
    "patch": "Fix",
    "internal": "Internal",
    "documentation": "Docz"
  }
}
```

If you want more sections in your changelog to further detail the change set you can use the `changelogTitles` to add more.

```json
{
  "changelogTitles": {
    "typescript": "Typescript Rewrite",
    "front-end": "Front End Updates",
    "back-end": "Back End Updates"
  }
}
```

### Pull Request Interaction

#### `auto label`

Get the labels for a pull request.

```bash
>  auto label -h

usage: auto label.js [-h] --pr PR [--repo REPO] [--owner OWNER] [-v] [-vv]
                       [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --pr PR               The pull request number you want the labels of
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

#### `auto pr`

Set the status on a PR commit

```bash
>  auto pr -h

usage: auto pr.js [-h] [--sha SHA] --state STATE --description DESCRIPTION
                    --url URL --context CONTEXT --pr PR [--owner OWNER]
                    [--repo REPO] [-v] [-vv] [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --sha SHA             Specify a custom git sha. Defaults to the HEAD for a
                        git repo in the current repository
  --state STATE         State of the PR
  --description DESCRIPTION
                        A description of the status
  --url URL             URL to associate with this status
  --context CONTEXT     A string label to differentiate this status from
                        others
  --pr PR               The pull request number you want the labels of
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

#### `auto pr-check`

Check that a pull request has a SemVer label.

```bash
>  auto pr-check -h

usage: auto pr-check.js [-h] [--pr PR] [-d] --url URL
                          [--owner OWNER] [--repo REPO]
                          [--onlyPublishWithReleaseLabel] [--major MAJOR]
                          [--minor MINOR] [--patch PATCH] [-v] [-vv]
                          [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  --pr PR       The PR number
  -d, --dry-run         Don't actually commit status. Just print the request
                        body
  --url URL             URL to associate with this status
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  --onlyPublishWithReleaseLabel
                        Only bump version if `release` label is on pull
                        request
  --major MAJOR         The name of the tag for a major version bump
  --minor MINOR         The name of the tag for a minor version bump
  --patch PATCH         The name of the tag for a patch version bump
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

#### `auto comment`

Comment on a pull request with a markdown message.

```bash
>  auto version -h

usage: auto comment.js [-h] -m MESSAGE [--context CONTEXT] [--owner OWNER]
                         [--repo REPO] --pr PR [-v] [-vv]
                         [--githubApi GITHUBAPI]


Optional arguments:
  -h, --help            Show this help message and exit.
  -m MESSAGE, --message MESSAGE
                        Message to post to comment.
  --context CONTEXT     A string label to differentiate this status from
                        others
  --owner OWNER         Version number to publish as. Defaults to reading
                        from the package.json
  --repo REPO           The repo to set the status on. Defaults to looking in
                        the package.json
  --pr PR               The pull request number you want the labels of
  -v, --verbose         Show some more logs
  -vv, --very-verbose   Show a lot more logs
  --githubApi GITHUBAPI
                        Github API to use
```

## Continuous Integration

`auto-release` was built for use in a continuous integration environment. Here's how to set it up in various tools.

### CircleCI

The following config declares the `release` job and uses it in the `build_and_release` workflow. The `release` job will only run on commits to master.

```yaml
version: 2

defaults: &defaults
  working_directory: ~/auto-release-test
  docker:
    - image: circleci/node:latest-browsers

jobs:
  install: # your install job

  release:
    <<: *defaults
    steps:
      - attach_workspace:
          at: ~/auto-release-test
      - run:
          name: Release
          command: npm run publish

workflows:
  version: 2
  build_and_release:
    jobs:
      - install:
          filters:
            tags:
              only: /.*/

      - release:
          requires:
            - install
          filters:
            branches:
              only:
                - master
```

## Enterprise

If you are using enterprise github `auto-release` lets you configure the github API URL that it uses. You can configure this by using the CLI option `--githubApi` or by setting the value in your `.autorc`.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/1192452?v=4" width="100px;"/><br /><sub><b>Andrew Lisowski</b></sub>](http://hipstersmoothie.com)<br />[💻](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Code") [📖](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Documentation") [🤔](#ideas-hipstersmoothie "Ideas, Planning, & Feedback") [🚇](#infra-hipstersmoothie "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Tests") | [<img src="https://avatars1.githubusercontent.com/u/13004162?v=4" width="100px;"/><br /><sub><b>Adam Dierkens</b></sub>](https://adamdierkens.com)<br />[💻](https://github.com/intuit/auto-release/commits?author=adierkens "Code") [📖](https://github.com/intuit/auto-release/commits?author=adierkens "Documentation") [🤔](#ideas-adierkens "Ideas, Planning, & Feedback") [⚠️](https://github.com/intuit/auto-release/commits?author=adierkens "Tests") |
| :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
