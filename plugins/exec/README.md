# Exec Plugin

Tap into select hooks and run a command on the terminal.

Tapable hooks, in call order:

- beforeRun
- beforeShipIt
- afterAddToChangelog
- beforeCommitChangelog
- version
- afterVersion
- publish
- afterPublish
- afterRelease
- afterShipIt

Don't see the hook you want? Try making a pull request if you can figure out how to make that type of hook to work!

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/exec
# or
yarn add -D @auto-it/exec
```

## Usage

Here is an example of replacing the `npm` plugins with a light-weight version.

All args to a hook are exposed on the process in enviroment variables.
The format looks like `$ARG_0`, `$ARG_1`, and so on.
Please look at the docs for [writing plugins](../../docs/pages/writing-plugins.md) for more detail on what's available.

```json
{
  "plugins": [
    [
      "exec",
      {
        "version": "npm version $ARG_0",
        "publish": "npm publish && git push --tags"
      }
    ]
    // other plugins
  ]
}
```
