import setToken from '@hutson/set-npm-auth-token-for-ci';
import envCi from 'env-ci';
import * as fs from 'fs';
import parseAuthor from 'parse-author';
import { promisify } from 'util';

import getPackages from 'get-monorepo-packages';
import { gt, inc, ReleaseType } from 'semver';
import { IExtendedCommit } from '../../log-parse';
import { Auto, IPlugin } from '../../main';
import SEMVER from '../../semver';
import execPromise from '../../utils/exec-promise';
import { ILogger } from '../../utils/logger';
import getConfigFromPackageJson from './package-config';

const { isCi } = envCi();
const readFile = promisify(fs.readFile);

function isMonorepo() {
  return fs.existsSync('lerna.json');
}

async function setTokenOnCI() {
  if (isCi) {
    setToken();
  }
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

async function bumpLatest(
  { version: localVersion, name }: IPackageJSON,
  version: SEMVER
) {
  const latestVersion = localVersion
    ? await greaterRelease(s => s, name, localVersion)
    : undefined;

  return latestVersion ? inc(latestVersion, version as ReleaseType) : version;
}

async function loadPackageJson(): Promise<IPackageJSON> {
  return JSON.parse(await readFile('package.json', 'utf-8'));
}

const verbose = ['--loglevel', 'silly'];

interface INpmConfig {
  setRcToken?: boolean;
  forcePublish?: boolean;
}

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

  apply(auto: Auto) {
    const isVerbose =
      auto.logLevel === 'verbose' || auto.logLevel === 'veryVerbose';
    const verboseArgs = isVerbose ? verbose : [];

    auto.hooks.beforeShipIt.tap(this.name, async () => {
      if (!isCi) {
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
        const monorepoVersion = prefixRelease(
          JSON.parse(await readFile('lerna.json', 'utf-8')).version
        );

        const releasedPackage = getMonorepoPackage();

        if (!releasedPackage.name && !releasedPackage.version) {
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

    auto.hooks.onCreateChangelog.tap(this.name, async changelog => {
      changelog.hooks.renderChangelogLine.tapPromise(
        'NPM - Monorepo',
        async (commits, renderLine) => {
          if (!isMonorepo()) {
            return;
          }

          await Promise.all(
            commits.map(async commit => {
              commit.packages = await changedPackages(commit.hash, auto.logger);
            })
          );

          const packageCommits = await partitionPackages(commits, renderLine);
          const pkgCount = Object.keys(packageCommits).length;
          const hasRepoCommits =
            packageCommits.monorepo && packageCommits.monorepo.length > 0;

          if (pkgCount <= 0 || (pkgCount === 1 && packageCommits.monorepo)) {
            return;
          }

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
      );
    });

    auto.hooks.version.tapPromise(this.name, async (version: SEMVER) => {
      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');
        const monorepoBump = await bumpLatest(getMonorepoPackage(), version);

        await execPromise('npx', [
          'lerna',
          'version',
          monorepoBump || version,
          this.forcePublish && '--force-publish',
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

    auto.hooks.canary.tapPromise(this.name, async canaryVersion => {
      if (this.setRcToken) {
        await setTokenOnCI();
        auto.logger.verbose.info('Set CI NPM_TOKEN');
      }

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');

        await execPromise('npx', [
          'lerna',
          'publish',
          canaryVersion,
          '--dist-tag',
          'canary',
          '--no-git-tag-version', // do not create a tag or commit for the canary version
          '--no-push', // do not push anything
          '--no-git-reset', // allow uncommitted changes when publishing,
          '--yes', // skip prompts
          ...verboseArgs
        ]);

        auto.logger.verbose.info('Successfully published canary version');
        return;
      }

      auto.logger.verbose.info('Detected single npm package');
      const { private: isPrivate, name } = await loadPackageJson();
      const isScopedPackage = name.match(/@\S+\/\S+/);

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
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      if (this.setRcToken) {
        await setTokenOnCI();
        auto.logger.verbose.info('Set CI NPM_TOKEN');
      }

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');

        if (auto.args && auto.args.verbose) {
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
