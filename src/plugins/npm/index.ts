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

const { isCi, ...env } = envCi();
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

interface IMonorepoPackage {
  path: string;
  name: string;
  version: string;
}

export async function changedPackages(
  sha: string,
  packages: IMonorepoPackage[],
  lernaJson: { version?: string },
  logger: ILogger
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
    const parts = filePath.split('/');

    if (parts[0] !== 'packages' || parts.length < 3) {
      return;
    }

    const packageName =
      parts.length > 3 && parts[1][0] === '@'
        ? `${parts[1]}/${parts[2]}`
        : parts[1];
    const version = packages.find(monorepoPackage =>
      monorepoPackage.path.includes(parts.slice(0, -1).join('/'))
    );

    changed.add(
      version && lernaJson.version === 'independent'
        ? `${packageName}@${version.version}`
        : packageName
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

const getLernaPackages = async () =>
  execPromise('npx', ['lerna', 'ls', '-pl']).then(res =>
    res.split('\n').map(packageInfo => {
      const [path, name, version] = packageInfo.split(':');
      return { path, name, version };
    })
  );

const getLernaJson = () => JSON.parse(fs.readFileSync('lerna.json', 'utf8'));

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
            'dryRun' in auto.args && auto.args.dryRun
              ? await getLernaPackages().then(packages =>
                  packages.map(p => `\n - ${p.name}@${p.version}`).join('')
                )
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

    auto.hooks.onCreateChangelog.tap(this.name, changelog => {
      changelog.hooks.renderChangelogLine.tapPromise(
        'NPM - Monorepo',
        async (commits, renderLine) => {
          if (!isMonorepo()) {
            return;
          }

          const lernaPackages = await getLernaPackages();
          const lernaJson = getLernaJson();

          await Promise.all(
            commits.map(async commit => {
              commit.packages = await changedPackages(
                commit.hash,
                lernaPackages,
                lernaJson,
                auto.logger
              );
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

    auto.hooks.canary.tapPromise(this.name, async (version, postFix) => {
      if (this.setRcToken) {
        await setTokenOnCI();
        auto.logger.verbose.info('Set CI NPM_TOKEN');
      }

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');
        const isPr = 'isPr' in env && env.isPr;

        await execPromise('npx', [
          'lerna',
          'publish',
          version,
          '--canary',
          '--dist-tag',
          'canary',
          // Locally we use sha for canary version's postFix, but the --canary flag
          // already attaches the SHA so we only attach postFix in PRs for context
          '--preid',
          isPr ? `canary${postFix}` : 'canary',
          '--yes', // skip prompts
          ...verboseArgs
        ]);

        auto.logger.verbose.info('Successfully published canary version');
        const lernaJson = getLernaJson();

        if (lernaJson.version === 'independent') {
          return '';
        }

        return lernaJson.version;
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
