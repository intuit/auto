# Exec Plugin

Tap into hooks and run scripts on the terminal.

Main hooks, in call order:

- beforeRun
- getRepository
- getAuthor
- beforeShipIt
- getPreviousVersion
- afterAddToChangelog
- beforeCommitChangelog
- version
- afterVersion
- publish
- afterPublish
- afterRelease
- afterShipIt

Other hooks:

- canary
- next
- modifyConfig
- makeRelease
- onCreateLogParse
  - parseCommit
  - omitCommit
- onCreateChangelog
  - renderChangelogLine
  - renderChangelogTitle
  - renderChangelogAuthor
  - renderChangelogAuthorLine
  - omitReleaseNotes
- onCreateRelease
  - createChangelogTitle

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/exec
# or
yarn add -D @auto-it/exec
```

## Usage

Here is an example of replacing the `npm` plugins with a light-weight version.

All args to a hook are exposed on the process in environment variables.
The format looks like `$ARG_0`, `$ARG_1`, and so on.
Please look at the docs for [writing plugins](../../docs/pages/writing-plugins.md) for more detail on what's available.

```json
{
  "plugins": [
    [
      "exec",
      {
        "version": "npm version $ARG_0",
        "publish": "npm publish && git push --tags",
        "afterRelease": "yarn docs && push-dir --dir=docs --branch=gh-pages"
      }
    ]
    // other plugins
  ]
}
```

> :warning: If you are tapping into a waterfall or bail hook you will need to return some value (ex: JSON or a boolean). Please refer to the documentation and return the right thing!
