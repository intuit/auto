# Plugins

`auto` uses the package [tapable](https://github.com/webpack/tapable) to expose a plugin system. If you've ever written a webpack plugin it's a lot like that.

## Hooks

Plugins work by hooking into various actions that `auto` has to do in order to facilitate a release or interact with your GitHub repo. The hooks that it exposes are:

- beforeRun - Happens before anything is done. This is a great place to check for platform specific secrets such as a NPM token.
- getAuthor - Get git author
- getPreviousVersion - Get the previous version
- getRepository - Get owner/repo
- publish - Publish the package

## Example Plugin - NPM

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
