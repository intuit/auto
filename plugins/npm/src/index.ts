import envCi from 'env-ci';
import * as fs from 'fs';
import { execSync } from 'child_process';
import parseAuthor from 'parse-author';
import path from 'path';
import { Memoize as memoize } from 'typescript-memoize';

import { Auto, execPromise, ILogger, IPlugin, SEMVER } from '@auto-it/core';
import getPackages from 'get-monorepo-packages';
import { gt, gte, lte, inc, ReleaseType } from 'semver';

import getConfigFromPackageJson from './package-config';
import setTokenOnCI from './set-npm-token';
import { loadPackageJson, readFile } from './utils';

const { isCi } = envCi();
/** When the next hook is running branch is also the tag to publish under (ex: next, beta) */
const branch = execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' });

const VERSION_COMMIT_MESSAGE = '"Bump version to: %s [skip ci]"';

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
  packageVersion: string,
  prereleaseBranch?: string
) {
  const publishedVersion = await getPublishedVersion(name);

  if (!publishedVersion) {
    return packageVersion;
  }

  const publishedPrefixed = prefixRelease(publishedVersion);
  // The branch (ex: next) is also the --preid
  const baseVersion =
    prereleaseBranch && packageVersion.includes(prereleaseBranch)
      ? inc(packageVersion, 'patch') || packageVersion
      : packageVersion;

  return gte(baseVersion, publishedPrefixed)
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

  return Boolean(!relative?.startsWith('..') && !path.isAbsolute(relative));
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

/** Render a list of string in markdown */
const markdownList = (lines: string[]) =>
  lines.map(line => `- \`${line}\``).join('\n');

/** Bump the version but no too much */
function determineBump(
  version: string,
  current: string,
  bump: SEMVER,
  tag: string
) {
  const next = inc(version, `pre${bump}` as ReleaseType, tag) || 'prerelease';

  return lte(next, current) ? 'prerelease' : next;
}

/** Publish to NPM. Works in both a monorepo setting and for a single package. */
export default class NPMPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'NPM';

  /** Whether to render a changelog like a monorepo's */
  private renderMonorepoChangelog: boolean;

  /** Whether to create sub-package changelogs */
  private readonly subPackageChangelogs: boolean;
  /** Whether to set the npm token in CI */
  private readonly setRcToken: boolean;
  /** Whether to always publish all packages in a monorepo */
  private readonly forcePublish: boolean;

  /** Initialize the plugin with it's options */
  constructor(config: INpmConfig = {}) {
    this.renderMonorepoChangelog = true;
    this.subPackageChangelogs = config.subPackageChangelogs || true;
    this.setRcToken =
      typeof config.setRcToken === 'boolean' ? config.setRcToken : true;
    this.forcePublish =
      typeof config.forcePublish === 'boolean' ? config.forcePublish : true;
  }

  /** Get all of the packages in the lerna monorepo */
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
      packages.map(p => `${p.name}@${p.version.split('+')[0]}`)
    );
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const isVerbose =
      auto.logger.logLevel === 'verbose' ||
      auto.logger.logLevel === 'veryVerbose';
    const verboseArgs = isVerbose ? verbose : [];
    const prereleaseBranches = auto.config?.prereleaseBranches!;
    // if ran from master we publish the prerelease to the first
    // configured prerelease branch
    const prereleaseBranch = prereleaseBranches.includes(branch)
      ? branch
      : prereleaseBranches[0];

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

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
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
              ? markdownList(await this.getIndependentPackageList())
              : '';
        } else {
          const releasedPackage = getMonorepoPackage();

          if (!releasedPackage.name && !releasedPackage.version) {
            previousVersion = auto.prefixRelease(monorepoVersion);
          } else {
            previousVersion = await greaterRelease(
              auto.prefixRelease,
              releasedPackage.name,
              auto.prefixRelease(monorepoVersion),
              prereleaseBranch
            );
          }
        }
      } else if (fs.existsSync('package.json')) {
        auto.logger.veryVerbose.info(
          'Using package.json to calculate previous version'
        );
        const { version, name } = await loadPackageJson();

        previousVersion = version
          ? await greaterRelease(
              auto.prefixRelease,
              name,
              auto.prefixRelease(version),
              prereleaseBranch
            )
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

            const section = packages?.length
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
        if (!isMonorepo() || !auto.release || !this.subPackageChangelogs) {
          return;
        }

        const lernaPackages = await this.getLernaPackages();
        const changelog = await auto.release.makeChangelog(bump);

        this.renderMonorepoChangelog = false;

        const promises = lernaPackages.map(async lernaPackage => {
          const includedCommits = commits.filter(commit =>
            commit.files.some(file => inFolder(lernaPackage.path, file))
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
          !isIndependent && this.forcePublish && '--force-publish',
          '--no-commit-hooks',
          '--yes',
          '--no-push',
          '-m',
          VERSION_COMMIT_MESSAGE,
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
        VERSION_COMMIT_MESSAGE,
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

      const lastRelease = await auto.git!.getLatestRelease();
      const isIndependent = getLernaJson().version === 'independent';

      if (isMonorepo()) {
        auto.logger.verbose.info('Detected monorepo, using lerna');

        const packagesBefore = await this.getLernaPackages();
        const next =
          (isIndependent && `pre${version}`) ||
          determineBump(
            lastRelease,
            packagesBefore[0].version,
            version,
            'canary'
          );

        await execPromise('npx', [
          'lerna',
          'publish',
          next,
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
        const independentPackages = await this.getIndependentPackageList();
        // Reset after we read the packages from the system
        await execPromise('git', ['reset', '--hard', 'HEAD']);

        if (isIndependent) {
          if (!independentPackages.some(p => p.includes('canary'))) {
            return { error: 'No packages were changed. No canary published.' };
          }

          return `<details><summary>Canary Versions</summary>${markdownList(
            independentPackages
          )}</details>`;
        }

        const packages = await this.getLernaPackages();
        const versioned = packages.find(p => p.version.includes('canary'));

        if (!versioned) {
          return { error: 'No packages were changed. No canary published.' };
        }

        return versioned.version.split('+')[0];
      }

      auto.logger.verbose.info('Detected single npm package');
      const { private: isPrivate, name } = await loadPackageJson();
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

    auto.hooks.next.tapPromise(this.name, async (preReleaseVersions, bump) => {
      await checkClean(auto);

      if (this.setRcToken) {
        await setTokenOnCI(auto.logger);
        auto.logger.verbose.info('Set CI NPM_TOKEN');
      }

      const lastRelease = await auto.git!.getLatestRelease();

      if (isMonorepo()) {
        const packages = await this.getLernaPackages();
        const inPreRelease = packages.find(p =>
          p.version.includes(prereleaseBranch)
        );
        const isIndependent = getLernaJson().version === 'independent';

        auto.logger.verbose.info('Detected monorepo, using lerna');
        await execPromise('npx', [
          'lerna',
          'publish',
          (inPreRelease &&
            // It's hard to accurately predict how we should bump independent versions.
            // So we just prerelease most of the time. (independent only)
            ((isIndependent && 'prerelease') ||
              determineBump(
                lastRelease,
                inPreRelease.version,
                bump,
                prereleaseBranch
              ))) ||
            `pre${bump}`,
          '--dist-tag',
          prereleaseBranch,
          '--preid',
          prereleaseBranch,
          '--message',
          VERSION_COMMIT_MESSAGE,
          '--force-publish', // you always want a next version to publish
          '--yes', // skip prompts,
          '--exact', // do not add ^ to next versions, this can result in `npm i` resolving the wrong next version
          ...verboseArgs
        ]);

        auto.logger.verbose.info('Successfully published next version');

        if (isIndependent) {
          const independentPackages = await this.getIndependentPackageList();
          preReleaseVersions = [...preReleaseVersions, ...independentPackages];
        } else {
          const packages = await this.getLernaPackages();
          const { version = '' } =
            packages.find(p => p.version.includes(prereleaseBranch)) || {};

          preReleaseVersions.push(auto.prefixRelease(version));
        }
      } else {
        auto.logger.verbose.info('Detected single npm package');

        const current = await auto.getCurrentVersion(lastRelease);
        const next = determineBump(
          lastRelease,
          current,
          bump,
          prereleaseBranch
        );

        await execPromise('npm', [
          'version',
          next,
          '--message',
          VERSION_COMMIT_MESSAGE,
          ...verboseArgs
        ]);
        await execPromise('npm', [
          'publish',
          '--tag',
          prereleaseBranch,
          ...verboseArgs
        ]);
        await execPromise('git', ['push', '--follow-tags']);

        auto.logger.verbose.info('Successfully published next version');
        const { version } = await loadPackageJson();
        preReleaseVersions.push(auto.prefixRelease(version!));
      }

      return preReleaseVersions;
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

        if (auto.options?.verbose) {
          await execPromise('git', ['status', '--short']);
        }

        await execPromise('npx', [
          'lerna',
          'publish',
          '--yes',
          // Plugins can add as many commits as they want, lerna will still
          // publish the changed package versions. from-git broke when HEAD
          // didn't contain the tags
          'from-package',
          ...verboseArgs
        ]);
      } else {
        const { private: isPrivate, name } = await loadPackageJson();
        const isScopedPackage = name.match(/@\S+\/\S+/);

        await execPromise(
          'npm',
          !isPrivate && isScopedPackage
            ? ['publish', '--access', 'public', ...verboseArgs]
            : ['publish', ...verboseArgs]
        );
      }

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
