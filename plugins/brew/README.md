# Brew Plugin

Automate the creation of Homebrew formulae.

> NOTE: This plugin does not work in `lerna` monorepos that use `independent` versioning.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/brew
# or
yarn add -D @auto-it/brew
```

## Usage

```jsonc
{
  "plugins": [
    [
      "brew",
      {
        // REQUIRED: The executable to create a formula for
        "executable": "path/to/some/executable",
        // REQUIRED: The name of the formula to create
        "name": "name-of-formula",
        // Optional: A path to the formula template. Default is './formula.template'
        "formula": "path/to/formula/template"
      }
    ]
    // other plugins
  ]
}
```

You can also use this to create multiple `brew` formulae.

```jsonc
{
  "plugins": [
    [
      "brew",
      [
        {
          "executable": "path/to/some/executable",
          "name": "name-of-formula",
          "formula": "path/to/formula/template"
        },
        {
          "executable": "path/to/another/executable",
          "name": "another-formula",
          "formula": "path/to/formula/another"
        }
      ]
    ]
  ]
}
```
