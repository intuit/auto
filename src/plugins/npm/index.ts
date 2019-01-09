import * as fs from 'fs';
import parseAuthor from 'parse-author';
import { promisify } from 'util';

import getPackages from 'get-monorepo-packages';
import { gt } from 'semver';
import { AutoRelease, IPlugin } from '../../main';
import SEMVER from '../../semver';
import execPromise from '../../utils/exec-promise';
import getConfigFromPackageJson from './package-config';

const readFile = promisify(fs.readFile);

function isMonorepo() {
  return fs.existsSync('lerna.json');
}

async function greaterRelease(
  prefixRelease: (release: string) => string,
  name: any,
  packageVersion: string
) {
  const publishedVersion = prefixRelease(
    await execPromise('npm', ['view', name, 'version'])
  );

  return gt(packageVersion, publishedVersion)
    ? packageVersion
    : publishedVersion;
}

export default class NPMPlugin implements IPlugin {
  public name = 'NPM';

  public apply(auto: AutoRelease) {
    auto.hooks.getAuthor.tapPromise('NPM', async () => {
      auto.logger.verbose.info(
        'NPM: Getting repo information from package.json'
      );
      const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));

      if (packageJson.author) {
        const { author } = packageJson;

        if (typeof author === 'string') {
          return parseAuthor(author);
        }

        return author;
      }
    });

    auto.hooks.getPreviousVersion.tapPromise('NPM', async prefixRelease => {
      let previousVersion = '';

      if (isMonorepo()) {
        auto.logger.veryVerbose.info(
          'Using monorepo to calculate previous release'
        );
        const monorepoVersion = prefixRelease(
          JSON.parse(await readFile('lerna.json', 'utf-8')).version
        );

        const packages = getPackages(process.cwd());
        const releasedPackage = packages.find(
          subPackage =>
            !!subPackage.package.version && !subPackage.package.private
        );

        if (!releasedPackage) {
          previousVersion = monorepoVersion;
        } else {
          previousVersion = await greaterRelease(
            prefixRelease,
            releasedPackage.package.name,
            monorepoVersion
          );
        }
      } else if (fs.existsSync('package.json')) {
        auto.logger.veryVerbose.info(
          'Using package.json to calculate previous version'
        );
        const { version, name } = JSON.parse(
          await readFile('package.json', 'utf-8')
        );

        previousVersion = await greaterRelease(
          prefixRelease,
          name,
          prefixRelease(version)
        );
      }

      auto.logger.verbose.info(
        'NPM: Got previous version from package.json',
        previousVersion
      );

      return previousVersion;
    });

    auto.hooks.getRepository.tapPromise('NPM', async () => {
      auto.logger.verbose.info(
        'NPM: getting repo information from package.json'
      );
      return getConfigFromPackageJson();
    });

    auto.hooks.publish.tapPromise('NPM', async (version: SEMVER) => {
      if (isMonorepo()) {
        await execPromise('npx', [
          'lerna',
          'publish',
          '--yes',
          '--force-publish=*',
          version,
          '-m',
          "'%v [skip ci]'"
        ]);
      } else {
        await execPromise('npm', [
          'version',
          version,
          '-m',
          '"Bump version to: %s [skip ci]"'
        ]);
        await execPromise('npm', ['publish']);
        await execPromise('git', [
          'push',
          '--follow-tags',
          '--set-upstream',
          'origin',
          '$branch'
        ]);
      }
    });
  }
}
