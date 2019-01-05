import * as fs from 'fs';
import { promisify } from 'util';

import { ILogger } from '../../github-release';
import { IAutoHooks } from '../../main';
import SEMVER from '../../semver';
import execPromise from '../../utils/exec-promise';
import getConfigFromPackageJson from './package-config';

const readFile = promisify(fs.readFile);

function isMonorepo() {
  return fs.existsSync('lerna.json');
}

export default class NPMPlugin {
  public apply(auto: IAutoHooks, logger: ILogger) {
    auto.getAuthor.tapPromise('NPM', async () => {
      logger.verbose.info('NPM: Getting repo information from package.json');
      const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));

      if (packageJson.author) {
        return packageJson.author;
      }
    });

    auto.getPreviousVersion.tapPromise('NPM', async prefixRelease => {
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
        logger.veryVerbose.info('Using lerna.json as previous version');
      } else if (packageVersion) {
        logger.veryVerbose.info('Using package.json as previous version');
      }

      logger.verbose.info(
        'NPM: Trying to get previous version from package.json',
        monorepoVersion || packageVersion
      );

      return monorepoVersion || packageVersion;
    });

    auto.getRepository.tapPromise('NPM', async () => {
      logger.verbose.info('NPM: getting repo information from package.json');
      return getConfigFromPackageJson();
    });

    auto.publish.tapPromise('NPM', async (version: SEMVER) => {
      if (isMonorepo()) {
        await execPromise(
          `npx lerna publish --yes --force-publish=* ${version} -m '%v [skip ci]'`
        );
      } else {
        await execPromise(
          `npm version ${version} -m "Bump version to: %s [skip ci]"`
        );
        await execPromise('npm publish');
        await execPromise(
          'git push --follow-tags --set-upstream origin $branch'
        );
      }
    });
  }
}
