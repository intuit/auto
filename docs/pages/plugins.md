# Plugins

`auto` uses the package [tapable](https://github.com/webpack/tapable) to expose a plugin system.

Current official plugins:

- npm - publish code to npm (DEFAULT)
- chrome - publish code to Chrome Web Store
- conventional-commits - parse conventional commit messages for version bumps

## Using Plugins

To use a plugin you can either supply the plugin via a CLI arg or in your [.autorc](./autorc.md#plugins).

There are three ways to load a plugin.

### 1. Official Plugins

To use an official plugin all you have to do is supply the name. Currently the only supported plugin is the `npm` plugin.

```sh
auto shipit --plugins npm
```

### 2. `npm` package

If you are using a plugin distributed on `npm` simply supply the name.

```sh
auto shipit --plugins NPM_PACKAGE_NAME
```

### 3. Path

Or if you have a plugin locally supply the path.

```sh
auto shipit --plugins ../path/to/plugin.js
```

### Multiple

If you want to use multiple plugins you can supply multiple.

```sh
auto shipit --plugins npm NPM_PACKAGE_NAME ../path/to/plugin.js
```

### Plugin Configuration

To provide plugin specific config change the following:

```json
{
  "plugins": ["chrome"]
}
```

To this:

```json
{
  "plugins": [
    ["chrome", { "extensionId": "1234", "build": "my-compiled-extension.zip" }]
  ]
}
```
