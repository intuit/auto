# Plugins

`auto` uses the package [tapable](https://github.com/webpack/tapable) to expose a plugin system.

## Using Plugins

To use a plugin you can either supply the plugin via a CLI arg or in your [.autorc](./autorc.md#plugins). Specifying a plugin overrides the defaults.

There are three ways to load a plugin.

### 1. Official Plugins

To use an official plugin all you have to do is supply the name.

```sh
auto shipit --plugins npm
```

### 2. `npm` package

Unofficial plugins pulled from NPM should be named in the format `auto-plugin-PLUGIN_NAME` where `PLUGIN_NAME` is the name of the plugin.

That name is provided to auto to use that particular plugin.

```sh
auto shipit --plugins PLUGIN_NAME
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

### None

By default, `auto` defaults to use the `npm` plugin if you don't supply anything in the `.autorc` configuration file. If you don't want to include any plugins, you can supply an empty array in the `.autorc` configuration file like the following:

```json
{
  "plugins": []
}
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
