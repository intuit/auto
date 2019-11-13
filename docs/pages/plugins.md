# Plugins

`auto` uses the package [tapable](https://github.com/webpack/tapable) to expose a plugin system.

## Using Plugins

To use a plugin you can either supply the plugin via a CLI arg or in your [.autorc](./autorc.md#plugins). Specifying a plugin overrides the defaults.

### Defaults

If you don't configure plugins in your `.autorc` configuration file `auto` will use a default package manager plugin.

- Installed through `npm` => uses [`npm`](../../plugins/npm/README.md)
- Installed through executable => uses [`git-tag`](../../plugins/git-tag/README.md)

### No Plugins

If you don't want to include the default plugins, you can supply an empty array in the `.autorc` configuration file like the following:

```json
{
  "plugins": []
}
```

There are three ways to load a plugin.

### 1. Official Plugins

To use an official plugin all you have to do is supply the name.

```json
{
  "plugins": ["npm"]
}
```

### 2. `npm` package

Unofficial plugins pulled from NPM should be named in the format `auto-plugin-PLUGIN_NAME` where `PLUGIN_NAME` is the name of the plugin.

That name is provided to auto to use that particular plugin.

```json
{
  "plugins": ["auto-plugin-my-cool-plugin", "some-package"]
}
```

### 3. Path

Or if you have a plugin locally supply the path.

```json
{
  "plugins": ["../path/to/plugin.js"]
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
