# Magic-Zero Plugin

A plugin that closely adheres to semver versioning for 0.0.x and 0.x.y releases.

In the default `auto` experience the `patch`, `minor`, and `major` only increment the corresponding digit in the version.
The rules for incrementing version `< 1.0.0` are not as intuitive or [agreed upon](https://github.com/semver/semver/issues/221).
This plugin adds a new label (`graduate`) and changes `auto`'s behavior to do the following:

**0.0.x:**

_Starting version:_ `0.0.1`

`patch` => `0.0.2`  
`minor` => `0.0.2`  
`major` => `0.0.2`  
`graduate` => `0.1.0`

**0.x.y:**

_Starting version:_ `0.1.0`

`patch` => `0.1.1`  
`minor` => `0.1.1`  
`major` => `0.2.0`  
`graduate` => `1.0.0`

Once you're project is `>= 1.0.0` this plugin effectively does nothing.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/magic-zero
# or
yarn add -D @auto-it/magic-zero
```

## Usage

```json
{
  "plugins": [
    "magic-zero"
    // other plugins
  ]
}
```

## Options

### `label`

The label to graduate a version to the next left 0 digit.

```json
{
  "plugins": [
    ["magic-zero", { "label": "super major" }]
    // other plugins
  ]
}
```

If you want to customize the label color/description you must define the label in your `.autorc`.

```json
{
  "plugins": [
    ["magic-zero", { "label": "super major" }]
    // other plugins
  ],
  "labels": [
    {
      "name": "super major",
      "description": "Graduate a version to the next left 0 digit",
      "releaseType": "major",
      "color": "#000"
    }
  ]
}
```
