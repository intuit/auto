import envCi from 'env-ci';
import * as fs from 'fs';
import parseAuthor from 'parse-author';
import path from 'path';
import { Memoize } from 'typescript-memoize';

import { Auto, execPromise, ILogger, IPlugin, SEMVER } from '@auto-it/core';
import getPackages from 'get-monorepo-packages';
import { gt, inc, ReleaseType } from 'semver';

import getConfigFromPackageJson from './package-config';
import setTokenOnCI from './set-npm-token';
import { loadPackageJson, readFile } from './utils';

const { isCi } = envCi();

function isMonorepo() {
  return fs.existsSync('lerna.json');
}

async function getPublishedVersion(name: string) {
  try {
    return await execPromise('npm', ['view', name, 'version']);
  } catch (error) {
    return;
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

interface IMonorepoPackage {
  path: string;
  name: string;
  version: string;
}

const inFolder = (parent: string, child: string) => {
  const relative = path.relative(parent, child);

  return Boolean(
    relative && !relative.startsWith('..') && !path.isAbsolute(relative)
  );
};

export async function changedPackages(
  sha: string,
  packages: IMonorepoPackage[],
  lernaJson: { version?: string },
  logger: ILogger,
  version?: SEMVER
) {
  const changed = new Set<string>();
  const changedFiles = await execPromise('git', [
    'show',
    '--first-parent',
    sha,
    '--name-only',
    '--pretty='
  ]);

  changedFiles.split('\n').forEach(filePath => {
    const monorepoPackage = packages.find(subPackage =>
      inFolder(subPackage.path, filePath)
    );

    if (!monorepoPackage) {
      return;
    }

    changed.add(
      lernaJson.version === 'independent'
        ? `${monorepoPackage.name}@${inc(
            monorepoPackage.version,
            version as ReleaseType
          )}`
        : monorepoPackage.name
    );
  });

  if (changed.size > 0) {
    logger.veryVerbose.info(`Got changed packages for ${sha}:\n`, changed);
  }

  return [...changed];
}

export function getMonorepoPackage() {
  const packages = getPackages(process.cwd());

  return packages.reduce(
    (greatest, subPackage) => {
      if (subPackage.package.version) {
        if (!greatest.version) {
          return subPackage.package;
        }

        return gt(greatest.version, subPackage.package.version)
          ? greatest
          : subPackage.package;
      }

      return greatest;
    },
    {} as IPackageJSON
  );
}

async function bumpLatest(
  { version: localVersion, name }: IPackageJSON,
  version: SEMVER
) {
  const latestVersion = localVersion
    ? await greaterRelease(s => s, name, localVersion)
    : undefined;

  return latestVersion ? inc(latestVersion, version as ReleaseType) : version;
}

const verbose = ['--loglevel', 'silly'];

interface INpmConfig {
  setRcToken?: boolean;
  forcePublish?: boolean;
}

const getLernaJson = () => JSON.parse(fs.readFileSync('lerna.json', 'utf8'));

const checkClean = async (auto: Auto) => {
  const status = await execPromise('git', ['status', '--porcelain']);

  if (!status) {
    return;
  }

  auto.logger.log.error('Changed Files:\n', status);
  throw new Error(
    'Working direction is not clean, make sure all files are commited'
  );
};

export default class NPMPlugin implements IPlugin {
  name = 'NPM';

  private readonly setRcToken: boolean;
  private readonly forcePublish: boolean;

  constructor(config: INpmConfig = {}) {
    this.setRcToken =
      typeof config.setRcToken === 'boolean' ? config.setRcToken : true;
    this.forcePublish =
      typeof config.forcePublish === 'boolean' ? config.forcePublish : true;
  }

  @Memoize()
  async getLernaPackages() {
    return execPromise('npx', ['lerna', 'ls', '-pl']).then(res =>
      res.split('\n').map(packageInfo => {
        const [packagePath, name, version] = packageInfo.split(':');
        return { path: packagePath, name, version };
      })
    );
  }

  @Memoize()
  async getIndependentPackageList() {
    return this.getLernaPackages().then(packages =>
      packages
        .map(p => `\n - \`${p.name}@${p.version.split('+')[0]}\``)
        .join('')
    );
  }

  apply(auto: Auto) {
    const isVerbose =
      auto.logger.logLevel === 'verbose' ||
      auto.logger.logLevel === 'veryVerbose';
    const verboseArgs = isVerbose ? verbose : [];

    auto.hooks.beforeShipIt.tap(this.name, async () => {
      if (!isCi) {
        return;
      }

      if (!process.env.NPM_TOKEN) {
        auto.logger.log.warn('NPM Token is needed for the NPM plugin!');
      }
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        'NPM: Getting repo information from package.json'
      );
      const packageJson = await loadPackageJson();

      if (!packageJson.author) {
        return;
      }

      const { author } = packageJson;

      if (typeof author === 'string') {
        return parseAuthor(author);
      }

      return author;
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async prefixRelease => {
      let previousVersion = '';

      if (isMonorepo()) {
        auto.logger.veryVerbose.info(
          'Using monorepo to calculate previous release'
        );
        const monorepoVersion = JSON.parse(
          await readFile('lerna.json', 'utf-8')
        ).version;

        if (monorepoVersion === 'independent') {
          previousVersion =
            'dryRun' in auto.options && auto.options.dryRun
              ? await this.getIndependentPackageList()
              : '';
        } else {
          const releasedPackage = getMonorepoPackage();

          if (!releasedPackage.name && !releasedPackage.version) {
            previousVersion = prefixRelease(monorepoVersion);
          } else {
            previousVersion = await greaterRelease(
              prefixRelease,
              releasedPackage.name,
              prefixRelease(monorepoVersion)
            );
          }
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

    auto.hooks.onCreateRelease.tap(this.name, release => {
      release.hooks.createChangelogTitle.tap(
        `${this.name} - lerna independent`,
        () => {
          if (isMonorepo() && getLernaJson().version === 'independent') {
            return '';
          }
        }
      );
    });

    auto.hooks.onCreateChangelog.tap(this.name, (changelog, version) => {
      changelog.hooks.renderChangelogLine.tapPromise(
        'NPM - Monorepo',
        async ([commit, line]) => {
          if (!isMonorepo()) {
            return [commit, line];
          }

          const lernaPackages = await this.getLernaPackages();
          const lernaJson = getLernaJson();

          commit.packages = await changedPackages(
            commit.hash,
            lernaPackages,
            lernaJson,
            auto.logger,
            version
          );

          const section =
            commit.packages && commit.packages.length
              ? commit.packages.map(p => `\`${p}\``).join(', ')
              : 'monorepo';

          if (section === 'monorepo') {
            return [commit, line];
          }

          return [commit, [`- ${section}`, `  ${line}`].join('\n')];
        }
      );
    });

    auto.hooks.version.tapPromise(this.name, async (version: SEMVER) => {
      await checkClean(auto);

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');
        const isIndependent = getLernaJson().version === 'independent';
        const monorepoBump = !isIndependent
          ? await bumpLatest(getMonorepoPackage(), version)
          : undefined;

        await execPromise('npx', [
          'lerna',
          'version',
          monorepoBump || version,
          !isIndependent && this.forcePublish && '--force-publish',
          '--no-commit-hooks',
          '--yes',
          '-m',
          "'Bump version to: %v [skip ci]'",
          ...verboseArgs
        ]);
        auto.logger.verbose.info('Successfully versioned repo');
        return;
      }

      const latestBump = await bumpLatest(await loadPackageJson(), version);

      await execPromise('npm', [
        'version',
        latestBump || version,
        '-m',
        '"Bump version to: %s [skip ci]"',
        ...verboseArgs
      ]);
      auto.logger.verbose.info('Successfully versioned repo');
    });

    auto.hooks.canary.tapPromise(this.name, async (version, postFix) => {
      await checkClean(auto);

      if (this.setRcToken) {
        await setTokenOnCI(auto.logger);
        auto.logger.verbose.info('Set CI NPM_TOKEN');
      }

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');

        await execPromise('npx', [
          'lerna',
          'publish',
          `pre${version}`,
          '--dist-tag',
          'canary',
          '--preid',
          `canary${postFix}`,
          '--force-publish', // you always want a canary version to publish
          '--yes', // skip prompts,
          '--no-git-reset', // so we can get the version that just published
          '--no-git-tag-version', // no need to tag and commit
          ...verboseArgs
        ]);

        auto.logger.verbose.info('Successfully published canary version');
        const packages = await this.getLernaPackages();
        const independentPackages = await this.getIndependentPackageList();
        // Reset after we read the packages from the system
        await execPromise('git', ['reset', '--hard', 'HEAD']);

        if (getLernaJson().version === 'independent') {
          if (!independentPackages.includes('canary')) {
            return { error: 'No packages were changed. No canary published.' };
          }

          return `<details><summary>Canary Versions</summary>${independentPackages}</details>`;
        }

        const versioned = packages.find(p => p.version.includes('canary'));

        if (!versioned) {
          return { error: 'No packages were changed. No canary published.' };
        }

        return versioned.version.split('+')[0];
      }

      auto.logger.verbose.info('Detected single npm package');
      const { private: isPrivate, name } = await loadPackageJson();
      const lastRelease = await auto.git!.getLatestRelease();
      const current = await auto.getCurrentVersion(lastRelease);
      const nextVersion = inc(current, version as ReleaseType);
      const isScopedPackage = name.match(/@\S+\/\S+/);
      const canaryVersion = `${nextVersion}-canary${postFix}`;

      await execPromise('npm', [
        'version',
        canaryVersion,
        '--no-git-tag-version',
        ...verboseArgs
      ]);
      const publishArgs = ['--tag', 'canary'];
      await execPromise(
        'npm',
        !isPrivate && isScopedPackage
          ? ['publish', '--access', 'public', ...publishArgs, ...verboseArgs]
          : ['publish', ...publishArgs, ...verboseArgs]
      );

      auto.logger.verbose.info('Successfully published canary version');
      return canaryVersion;
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      const status = await execPromise('git', ['status', '--porcelain']);

      if (isVerbose && status) {
        auto.logger.log.error('Changed Files:\n', status);
      }

      if (this.setRcToken) {
        await setTokenOnCI(auto.logger);
        auto.logger.verbose.info('Set CI NPM_TOKEN');
      }

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');

        if (auto.options && auto.options.verbose) {
          await execPromise('git', ['status', '--short']);
        }

        await execPromise('npx', [
          'lerna',
          'publish',
          '--yes',
          'from-git',
          ...verboseArgs
        ]);

        auto.logger.verbose.info('Successfully published repo');
        return;
      }

      const { private: isPrivate, name } = await loadPackageJson();
      const isScopedPackage = name.match(/@\S+\/\S+/);

      await execPromise(
        'npm',
        !isPrivate && isScopedPackage
          ? ['publish', '--access', 'public', ...verboseArgs]
          : ['publish', ...verboseArgs]
      );
      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        '$branch'
      ]);
      auto.logger.verbose.info('Successfully published repo');
    });
  }
}
