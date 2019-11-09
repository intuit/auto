import envCi from 'env-ci';
import * as fs from 'fs';
import parseAuthor from 'parse-author';
import path from 'path';
import { Memoize as memoize } from 'typescript-memoize';

import { Auto, execPromise, ILogger, IPlugin, SEMVER } from '@auto-it/core';
import getPackages from 'get-monorepo-packages';
import { gt, inc, ReleaseType } from 'semver';

import getConfigFromPackageJson from './package-config';
import setTokenOnCI from './set-npm-token';
import { loadPackageJson, readFile } from './utils';
import { execSync } from 'child_process';

const { isCi } = envCi();

/** Check if the project is a monorepo */
const isMonorepo = () => fs.existsSync('lerna.json');

/** Get the last published version for a npm package */
async function getPublishedVersion(name: string) {
  try {
    return await execPromise('npm', ['view', name, 'version']);
  } catch (error) {}
}

/**
 * Determine the greatest version between last published version of a
 * package and the version in the package.json.
 */
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
  /** Path to the monorepo package */
  path: string;
  /** Name to the monorepo package */
  name: string;
  /** Version to the monorepo package */
  version: string;
}

/** Check if one path is within a parent path */
const inFolder = (parent: string, child: string) => {
  const relative = path.relative(parent, child);

  return Boolean(
    relative && !relative.startsWith('..') && !path.isAbsolute(relative)
  );
};

interface ChangedPackagesArgs {
  /** Commit hash to find changes for */
  sha: string;
  /** All of the pacakges in the monorepo */
  packages: IMonorepoPackage[];
  /** The lerna.json for the monorepo */
  lernaJson: {
    /** The version of the monorepo */
    version?: string;
  };
  /** An "auto" logger to use for loggin */
  logger: ILogger;
  /** The semver bump being applied */
  version?: SEMVER;
}

/**
 * Determine what packages in a monorepo have git changes.
 * We are specifically not using `lerna changed` here because
 * we only care about the package that changed, not what other
 * packages that might effect.
 */
export async function changedPackages({
  sha,
  packages,
  lernaJson,
  logger,
  version
}: ChangedPackagesArgs) {
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

/** Get the package with the greatest version in a monorepo */
export function getMonorepoPackage() {
  const packages = getPackages(process.cwd());

  return packages.reduce((greatest, subPackage) => {
    if (subPackage.package.version) {
      if (!greatest.version) {
        return subPackage.package;
      }

      return gt(greatest.version, subPackage.package.version)
        ? greatest
        : subPackage.package;
    }

    return greatest;
  }, {} as IPackageJSON);
}

/**
 * Increment the version number of a package based the bigger
 * release between the last published version and the version
 * in the package.json.
 */
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
  deprecateCanaries?: false | string;
  /** Whether to create sub-package changelogs */
  subPackageChangelogs?: boolean;
  /** Whether to set the npm token on CI */
  setRcToken?: boolean;
  /** Whether to force publish all the packages in a monorepo */
  forcePublish?: boolean;
}

/** Parse the lerna.json file. */
const getLernaJson = () => JSON.parse(fs.readFileSync('lerna.json', 'utf8'));

/**
 * Check if `git status` is clean. We try to ensure that no
 * changes haven't been staged to match the behavior of NPM.
 */
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

const defaultOptions: Required<INpmConfig> = {
  deprecateCanaries:
    'This is a canary version of "%package" and should only be used for testing! Please use "%package@latest" instead.',
  forcePublish: true,
  setRcToken: true,
  subPackageChangelogs: true
};

/** Publish to NPM. Works in both a monorepo setting and for a single package. */
export default class NPMPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'NPM';

  /** Whether to render a changelog like a monorepo's */
  private renderMonorepoChangelog: boolean;
  private readonly options: Required<INpmConfig>;

  /** Initialize the plugin with it's options */
  constructor(config: INpmConfig = {}) {
    this.renderMonorepoChangelog = true;

    this.options = {
      ...defaultOptions,
      ...config
    };
  }

  /** Get all of the packages in the lerna monorepo */
  @memoize()
  async getLernaPackages() {
    return execPromise('npx', ['lerna', 'ls', '-pl']).then(res =>
      res.split('\n').map(packageInfo => {
        const [packagePath, name, version] = packageInfo.split(':');
        return { path: packagePath, name, version };
      })
    );
  }

  /** Get all of the packages+version in the lerna "independent" monorepo */
  @memoize()
  async getIndependentPackageList() {
    return this.getLernaPackages().then(packages =>
      packages
        .map(p => `\n - \`${p.name}@${p.version.split('+')[0]}\``)
        .join('')
    );
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const isVerbose =
      auto.logger.logLevel === 'verbose' ||
      auto.logger.logLevel === 'veryVerbose';
    const verboseArgs = isVerbose ? verbose : [];

    const deprecate = async (
      name: string,
      version: string,
      message: string,
      ...args: string[]
    ) => {
      try {
        execSync('npm whoami', { stdio: 'inherit' });

        const exact = `${name}@${version}`;
        await execPromise('npm', [
          'deprecate',
          exact,
          `"${message.replace(/%package/g, name)}"`,
          ...args
        ]);
        auto.logger.verbose.info(`Deprecated: "${exact}"`);
      } catch (error) {
        auto.logger.log.error(
          `Something went wrong! Couldn't deprecate "${name}@${version}"`
        );
        auto.logger.log.error(error);
        process.exit(1);
      }
    };

    auto.hooks.beforeShipIt.tap(this.name, async () => {
      if (!isCi) {
        return;
      }

      auto.checkEnv(this.name, 'NPM_TOKEN');
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

    auto.hooks.onCreateChangelog.tap(
      this.name,
      (changelog, version = SEMVER.patch) => {
        changelog.hooks.renderChangelogLine.tapPromise(
          'NPM - Monorepo',
          async ([commit, line]) => {
            if (!isMonorepo() || !this.renderMonorepoChangelog) {
              return [commit, line];
            }

            const lernaPackages = await this.getLernaPackages();
            const lernaJson = getLernaJson();

            const packages = await changedPackages({
              sha: commit.hash,
              packages: lernaPackages,
              lernaJson,
              logger: auto.logger,
              version
            });

            const section =
              packages && packages.length
                ? packages.map(p => `\`${p}\``).join(', ')
                : 'monorepo';

            if (section === 'monorepo') {
              return [commit, line];
            }

            return [commit, [`- ${section}`, `  ${line}`].join('\n')];
          }
        );
      }
    );

    auto.hooks.beforeCommitChangelog.tapPromise(
      this.name,
      async ({ commits, bump }) => {
        if (
          !isMonorepo() ||
          !auto.release ||
          !this.options.subPackageChangelogs
        ) {
          return;
        }

        const lernaPackages = await this.getLernaPackages();
        const changelog = await auto.release.makeChangelog(bump);

        this.renderMonorepoChangelog = false;

        const promises = lernaPackages.map(async lernaPackage => {
          const includedCommits = commits.filter(commit =>
            commit.files.some(file => {
              const relative = path.relative(lernaPackage.path, file);

              return (
                relative &&
                !relative.startsWith('..') &&
                !path.isAbsolute(relative)
              );
            })
          );
          const title = `v${inc(lernaPackage.version, bump as ReleaseType)}`;
          const releaseNotes = await changelog.generateReleaseNotes(
            includedCommits
          );

          if (releaseNotes.trim()) {
            await auto.release!.updateChangelogFile(
              title,
              releaseNotes,
              path.join(lernaPackage.path, 'CHANGELOG.md')
            );
          }
        });

        this.renderMonorepoChangelog = true;

        // Cannot run git operations in parallel
        await promises.reduce(
          async (last, next) => last.then(() => next),
          Promise.resolve()
        );
      }
    );

    auto.hooks.version.tapPromise(this.name, async version => {
      await checkClean(auto);

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');
        const isIndependent = getLernaJson().version === 'independent';
        const monorepoBump = isIndependent
          ? undefined
          : await bumpLatest(getMonorepoPackage(), version);

        await execPromise('npx', [
          'lerna',
          'version',
          monorepoBump || version,
          !isIndependent && this.options.forcePublish && '--force-publish',
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

      if (this.options.setRcToken) {
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
          '--no-git-tag-version', // no need to tag and commit,
          '--exact', // do not add ^ to canary versions, this can result in `npm i` resolving the wrong canary version
          ...verboseArgs
        ]);

        auto.logger.verbose.info('Successfully published canary version');

        const packages = await this.getLernaPackages();
        const independentPackages = await this.getIndependentPackageList();
        const deprecateCanaries = async () => {
          const deprecationMessage = this.options.deprecateCanaries;

          if (deprecationMessage) {
            await Promise.all(
              packages.map(async p => {
                deprecate(
                  p.name,
                  p.version,
                  deprecationMessage,
                  ...verboseArgs
                );
              })
            );
          }
        };

        // Reset after we read the packages from the system
        await execPromise('git', ['reset', '--hard', 'HEAD']);

        if (getLernaJson().version === 'independent') {
          if (!independentPackages.includes('canary')) {
            return { error: 'No packages were changed. No canary published.' };
          }

          await deprecateCanaries();
          return `<details><summary>Canary Versions</summary>${independentPackages}</details>`;
        }

        const versioned = packages.find(p => p.version.includes('canary'));

        if (!versioned) {
          return { error: 'No packages were changed. No canary published.' };
        }

        await deprecateCanaries();
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

      if (this.options.deprecateCanaries) {
        await deprecate(
          name,
          canaryVersion,
          this.options.deprecateCanaries,
          ...verboseArgs
        );
      }

      auto.logger.verbose.info('Successfully published canary version');
      return canaryVersion;
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      const status = await execPromise('git', ['status', '--porcelain']);

      if (isVerbose && status) {
        auto.logger.log.error('Changed Files:\n', status);
      }

      if (this.options.setRcToken) {
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
        auto.baseBranch
      ]);
      auto.logger.verbose.info('Successfully published repo');
    });
  }
}
