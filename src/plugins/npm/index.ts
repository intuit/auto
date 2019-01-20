import setToken from '@hutson/set-npm-auth-token-for-ci';
import * as fs from 'fs';
import isCI from 'is-ci';
import parseAuthor from 'parse-author';
import { promisify } from 'util';

import getPackages from 'get-monorepo-packages';
import { gt, inc, ReleaseType } from 'semver';
import { IExtendedCommit } from '../../log-parse';
import { AutoRelease, IPlugin } from '../../main';
import SEMVER from '../../semver';
import execPromise from '../../utils/exec-promise';
import { ILogger } from '../../utils/logger';
import getConfigFromPackageJson from './package-config';

const readFile = promisify(fs.readFile);

function isMonorepo() {
  return fs.existsSync('lerna.json');
}

function setTokenOnCI() {
  if (isCI) {
    setToken();
  }
}

async function getPublishedVersion(name: string) {
  try {
    return await execPromise('npm', ['view', name, 'version']);
  } catch (error) {
    return null;
  }
}

export async function greaterRelease(
  prefixRelease: (release: string) => string,
  name: string,
  packageVersion: string
) {
  const publishedVersion = await getPublishedVersion(name);

  if (!publishedVersion) {
    return packageVersion;
  }

  const publishedPrefixed = prefixRelease(publishedVersion);

  return gt(packageVersion, publishedPrefixed)
    ? packageVersion
    : publishedPrefixed;
}

export async function changedPackages(sha: string, logger: ILogger) {
  const packages = new Set<string>();
  const changedFiles = await execPromise('git', [
    'show',
    '--first-parent',
    sha,
    '--name-only',
    '--pretty='
  ]);

  changedFiles.split('\n').forEach(filePath => {
    const parts = filePath.split('/');

    if (parts[0] !== 'packages' || parts.length < 3) {
      return;
    }

    packages.add(
      parts.length > 3 && parts[1][0] === '@'
        ? `${parts[1]}/${parts[2]}`
        : parts[1]
    );
  });

  if (packages.size > 0) {
    logger.veryVerbose.info(`Got changed packages for ${sha}:\n`, packages);
  }

  return [...packages];
}

export function getMonorepoPackage() {
  const packages = getPackages(process.cwd());

  return packages.reduce(
    (greatest, subPackage) => {
      if (subPackage.package.version) {
        return gt(greatest.version!, subPackage.package.version)
          ? greatest
          : subPackage.package;
      }

      return greatest;
    },
    { version: '0.0.0' } as IPackageJSON
  );
}

interface INotePartition {
  [key: string]: string[];
}

/**
 * Attempt to create a map of monorepo packages
 */
async function partitionPackages(
  labelCommits: IExtendedCommit[],
  lineRender: (commit: IExtendedCommit) => Promise<string>
) {
  const packageCommits: INotePartition = {};

  await Promise.all(
    labelCommits.map(async commit => {
      const line = await lineRender(commit);

      const packages =
        commit.packages && commit.packages.length
          ? commit.packages.map(p => `\`${p}\``).join(', ')
          : 'monorepo';

      if (!packageCommits[packages]) {
        packageCommits[packages] = [];
      }

      packageCommits[packages].push(line);
    })
  );

  return packageCommits;
}

async function loadPackageJson(): Promise<IPackageJSON> {
  return JSON.parse(await readFile('package.json', 'utf-8'));
}

export default class NPMPlugin implements IPlugin {
  public name = 'NPM';

  public apply(auto: AutoRelease) {
    auto.hooks.beforeRun.tap(this.name, async () => {
      if (!process.env.NPM_TOKEN) {
        auto.logger.log.warn('NPM Token is needed for the NPM plugin!');
      }
    });

    auto.hooks.beforeShipIt.tap(this.name, async () => {
      if (!isCI) {
        return;
      }

      if (!process.env.NPM_TOKEN) {
        throw new Error('NPM Token is needed for the NPM plugin!');
      }
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        'NPM: Getting repo information from package.json'
      );
      const packageJson = await loadPackageJson();

      if (packageJson.author) {
        const { author } = packageJson;

        if (typeof author === 'string') {
          return parseAuthor(author);
        }

        return author;
      }
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async prefixRelease => {
      let previousVersion = '';

      if (isMonorepo()) {
        auto.logger.veryVerbose.info(
          'Using monorepo to calculate previous release'
        );
        const monorepoVersion = prefixRelease(
          JSON.parse(await readFile('lerna.json', 'utf-8')).version
        );

        const releasedPackage = getMonorepoPackage();

        if (releasedPackage.version === '0.0.0') {
          previousVersion = monorepoVersion;
        } else {
          previousVersion = await greaterRelease(
            prefixRelease,
            releasedPackage.name,
            monorepoVersion
          );
        }
      } else if (fs.existsSync('package.json')) {
        auto.logger.veryVerbose.info(
          'Using package.json to calculate previous version'
        );
        const { version, name } = await loadPackageJson();

        previousVersion = version
          ? await greaterRelease(prefixRelease, name, prefixRelease(version))
          : '0.0.0';
      }

      auto.logger.verbose.info(
        'NPM: Got previous version from package.json',
        previousVersion
      );

      return previousVersion;
    });

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        'NPM: getting repo information from package.json'
      );
      return getConfigFromPackageJson();
    });

    auto.hooks.onCreateLogParse.tap(this.name, async logParser => {
      logParser.hooks.renderChangelogLine.tapPromise(
        'NPM - Monorepo',
        async (commits, renderLine) => {
          if (isMonorepo()) {
            await Promise.all(
              commits.map(async commit => {
                commit.packages = await changedPackages(
                  commit.hash,
                  auto.logger
                );
              })
            );

            const packageCommits = await partitionPackages(commits, renderLine);
            const pkgCount = Object.keys(packageCommits).length;
            const hasRepoCommits =
              packageCommits.monorepo && packageCommits.monorepo.length > 0;

            if (pkgCount > 0 && (pkgCount !== 1 || !packageCommits.monorepo)) {
              const section: string[] = [];

              if (hasRepoCommits) {
                packageCommits.monorepo.forEach(note => section.push(note));
                delete packageCommits.monorepo;
              }

              Object.entries(packageCommits).map(([pkg, lines]) => {
                section.push(`- ${pkg}`);
                lines.map(note => section.push(`  ${note}`));
              });

              return section;
            }
          }
        }
      );
    });

    auto.hooks.publish.tapPromise(this.name, async (version: SEMVER) => {
      if (isMonorepo()) {
        const { name, version: localVersion } = getMonorepoPackage();
        const latestVersion = localVersion
          ? await greaterRelease(s => s, name, localVersion)
          : null;
        const latestBump = latestVersion
          ? inc(latestVersion, version as ReleaseType)
          : version;

        await execPromise('npx', [
          'lerna',
          'version',
          latestBump || version,
          '--force-publish',
          '--yes',
          '-m',
          "'%v [skip ci]'"
        ]);

        setTokenOnCI();

        await execPromise('npx', ['lerna', 'publish', '--yes', 'from-git']);
      } else {
        const {
          private: isPrivate,
          name,
          version: localVersion
        } = await loadPackageJson();
        const isScopedPackage = name.match(/@\S+\/\S+/);
        const latestVersion = localVersion
          ? await greaterRelease(s => s, name, localVersion)
          : null;
        const latestBump = latestVersion
          ? inc(latestVersion, version as ReleaseType)
          : version;

        await execPromise('npm', [
          'version',
          latestBump || version,
          '-m',
          '"Bump version to: %s [skip ci]"'
        ]);

        setTokenOnCI();

        await execPromise(
          'npm',
          !isPrivate && isScopedPackage
            ? ['publish', '--access', 'public']
            : ['publish']
        );
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
