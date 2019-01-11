# Plugins

`auto` uses the package [tapable](https://github.com/webpack/tapable) to expose a plugin system. If you've ever written a webpack plugin it's a lot like that.

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

## Writing Plugins

### Hooks

Plugins work by hooking into various actions that `auto` has to do in order to facilitate a release or interact with your GitHub repo. The hooks that it exposes are:

#### beforeRun

Happens before anything is done. This is a great place to check for platform specific secrets such as a NPM token.

```ts
auto.hooks.beforeRun.tapPromise('NPM', async config => {
  if (!process.env.NPM_TOKEN) {
    throw new Error('NPM Token is needed for the NPM plugin!');
  }
});
```

#### getAuthor

Get git author. Typically from a package distribution description file.

```ts
auto.hooks.getAuthor.tapPromise('NPM', async () => {
  const { author } = JSON.parse(await readFile('package.json', 'utf-8'));

  if (author) {
    return author;
  }
});
```

#### getPreviousVersion

Get the previous version. Typically from a package distribution description file.

```ts
auto.hooks.getPreviousVersion.tapPromise('NPM', async prefixRelease => {
  const { version } = JSON.parse(await readFile('package.json', 'utf-8'));

  if (version) {
    return prefixRelease(
      JSON.parse(await readFile('package.json', 'utf-8')).version
    );
  }
});
```

#### getRepository

Get owner and repository. Typically from a package distribution description file.

```ts
auto.hooks.getRepository.tapPromise('NPM', async () => {
  const owner = // get the owner from package.json
  const repo = // get the repo from package.json

  return {
    owner,
    repo
  }
});
```

#### modifyChangelog

Change how the changelog renders lines. This hook provides the default line renderer so you don't have to change much.

The following plugin would change all the bullet points in the changelog to star emojis.

```ts
auto.hooks.modifyChangelog.tapPromise('Stars', async (commits, renderLine) =>
  commits.map(commit =>
    renderLine(commit).map(line => `${line.replace('-', ':star:')}\n`)
  )
);
```

#### publish

Publish the package to some package distributor. You must push the tags to github!

```ts
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
    'origin',
    '$branch'
  ]);
});
```

### Example Plugin - NPM (simple)

To create a plugin simply make a class with an `apply` method and tap into the hooks you need.

```ts
import * as fs from 'fs';
import { promisify } from 'util';

import { IAutoHooks, AutoRelease, SEMVER, execPromise } from 'auto';
import getConfigFromPackageJson from './package-config';

const readFile = promisify(fs.readFile);

export default class NPMPlugin {
  public apply(auto: AutoRelease) {
    auto.hooks.getAuthor.tapPromise('NPM', async () => {
      const { author } = JSON.parse(await readFile('package.json', 'utf-8'));

      if (author) {
        auto.logger.log.info('NPM: Got author information from package.json');
        return author;
      }
    });

    auto.hooks.getPreviousVersion.tapPromise('NPM', async prefixRelease => {
      const { version } = JSON.parse(await readFile('package.json', 'utf-8'));

      auto.logger.log.info(
        'NPM: Got previous version from package.json - ',
        version
      );

      if (version) {
        return prefixRelease(
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
        'origin',
        '$branch'
      ]);
    });
  }
}
```
