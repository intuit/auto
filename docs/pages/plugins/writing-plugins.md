# Writing Plugins

If you've ever written a `webpack` plugin it's a lot like that.

A plugin definition is:

- a class the has an `apply` function where a plugin hooks into various functions in auto (REQUIRED)
- a name for the plugin, should match the [name of the package](./plugins.md#plugin-declaration) (REQUIRED)
- a constructor where you can load plugin specific config

```ts
import { Auto, IPlugin } from 'auto';

export default class TestPlugin implements IPlugin {
  name = 'test';

  private readonly config: any;

  constructor(config: any) {
    this.config = config;
  }

  apply(auto: Auto) {
    // hook into auto
  }
}
```

Or in JavaScript:

```js
module.exports = class TestPlugin {
  constructor(config) {
    this.config = config;
    this.name = 'test';
  }

  /**
   * Setup the plugin
   * @param {import('@auto-it/core').default} auto
   */
  apply(auto) {
    // hook into auto
  }
};
```

## Constructor

In the constructor you have access to any plugin specific config provided in the `.autorc`.
It might be useful to write a more type-safe interface for your config.

```ts
import { Auto, IPlugin } from 'auto';

interface ITestPluginConfig {
  foo?: string;
  bar?: boolean;
}

export default class TestPlugin implements IPlugin {
  name = 'test';

  private readonly config: ITestPluginConfig;

  constructor(config: ITestPluginConfig) {
    this.config = config;
  }
}
```

## Hooks

Plugins work by hooking into various actions that `auto` has to do in order to facilitate a release or interact with your GitHub repo.
The hooks that it exposes are:

[Read more about the available hooks.](./writing-plugins.md)

## Example Plugin - NPM (simple)

To create a plugin simply make a class with an `apply` method and tap into the hooks you need.

```ts
import * as fs from 'fs';
import { promisify } from 'util';

import { IAutoHooks, Auto, SEMVER, execPromise } from 'auto';
import getConfigFromPackageJson from './package-config';

const readFile = promisify(fs.readFile);

export default class NPMPlugin {
  public apply(auto: Auto) {
    auto.hooks.getAuthor.tapPromise('NPM', async () => {
      const { author } = JSON.parse(await readFile('package.json', 'utf-8'));

      if (author) {
        auto.logger.log.info('NPM: Got author information from package.json');
        return author;
      }
    });

    auto.hooks.getPreviousVersion.tapPromise('NPM', async () => {
      const { version } = JSON.parse(await readFile('package.json', 'utf-8'));

      auto.logger.log.info(
        'NPM: Got previous version from package.json - ',
        version
      );

      if (version) {
        return auto.prefixRelease(
          JSON.parse(await readFile('package.json', 'utf-8')).version
        );
      }
    });

    auto.hooks.getRepository.tapPromise('NPM', async () => {
      auto.logger.log.info('NPM: getting repo information from package.json');
      return getConfigFromPackageJson();
    });

    auto.hooks.publish.tapPromise('NPM', async (version: SEMVER) => {
      await execPromise('npm', [
        'version',
        version,
        '-m',
        'Bump version to: %s [skip ci]'
      ]);
      await execPromise('npm', ['publish']);
      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        auto.remote,
        '$branch'
      ]);
    });
  }
}
```
