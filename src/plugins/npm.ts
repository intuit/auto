import * as fs from 'fs';
import { promisify } from 'util';

import { IAutoHooks } from '../main';

const readFile = promisify(fs.readFile);

function isMonorepo() {
  return fs.existsSync('lerna.json');
}

export default class NPMPlugin {
  public apply(auto: IAutoHooks) {
    auto.getUser.tapPromise('NPM', async () => {
      const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));

      if (packageJson.author) {
        return packageJson.author;
      }
    });

    auto.getPreviousVersion.tapAsync(
      'NPM',
      async (prefixRelease, veryVerbose) => {
        let packageVersion = '';
        let monorepoVersion = '';

        if (isMonorepo()) {
          monorepoVersion = prefixRelease(
            JSON.parse(await readFile('lerna.json', 'utf-8')).version
          );
        }

        if (fs.existsSync('package.json')) {
          packageVersion = prefixRelease(
            JSON.parse(await readFile('package.json', 'utf-8')).version
          );
        }

        if (monorepoVersion) {
          veryVerbose.info('Using lerna.json as previous version');
        } else if (packageVersion) {
          veryVerbose.info('Using package.json as previous version');
        }

        return monorepoVersion || packageVersion;
      }
    );
  }
}
