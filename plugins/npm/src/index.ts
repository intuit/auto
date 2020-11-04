import envCi from "env-ci";
import * as fs from "fs";
import parseAuthor from "parse-author";
import path from "path";
import { Memoize as memoize } from "typescript-memoize";
import { RestEndpointMethodTypes } from "@octokit/rest";
import * as t from "io-ts";
import { execSync } from "child_process";
import on from "await-to-js";

import {
  Auto,
  determineNextVersion,
  getCurrentBranch,
  getLernaPackages,
  LernaPackage,
  inFolder,
  execPromise,
  ILogger,
  IPlugin,
  InteractiveInit,
  SEMVER,
  validatePluginConfiguration,
  ShipitRelease,
  DEFAULT_PRERELEASE_BRANCHES,
} from "@auto-it/core";
import getPackages from "get-monorepo-packages";
import { gt, gte, inc, ReleaseType } from "semver";

import getConfigFromPackageJson from "./package-config";
import setTokenOnCI, { getRegistry, DEFAULT_REGISTRY } from "./set-npm-token";
import {
  loadPackageJson,
  writeFile,
  isMonorepo,
  readFile,
  getLernaJson,
} from "./utils";

const { isCi } = envCi();
const VERSION_COMMIT_MESSAGE = '"Bump version to: %s [skip ci]"';

/** Get the last published version for a npm package */
async function getPublishedVersion(name: string) {
  try {
    return await execPromise("npm", [
      "view",
      name,
      "version",
      "--registry",
      await getRegistry(),
    ]);
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
      ? inc(packageVersion, "patch") || packageVersion
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

interface GetChangedPackagesArgs {
  /** Commit hash to find changes for */
  sha: string;
  /** All of the packages in the monorepo */
  packages: IMonorepoPackage[];
  /** Whether to add the version to the package name */
  addVersion: boolean;
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
export async function getChangedPackages({
  sha,
  packages,
  addVersion,
  logger,
  version,
}: GetChangedPackagesArgs) {
  const changed = new Set<string>();
  const changedFiles = execSync(
    `git --no-pager show --first-parent ${sha} --name-only --pretty=`,
    { encoding: "utf8" }
  );

  changedFiles.split("\n").forEach((filePath) => {
    const monorepoPackage = packages.find((subPackage) =>
      inFolder(subPackage.path, filePath)
    );

    if (!monorepoPackage) {
      return;
    }

    changed.add(
      addVersion
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

  if (!packages.length) {
    return {} as IPackageJSON;
  }

  const monorepoPackage = packages.reduce((greatest, subPackage) => {
    if (subPackage.package.version) {
      if (!greatest.package.version) {
        return subPackage;
      }

      if (subPackage.package.private) {
        return greatest;
      }

      return gt(greatest.package.version, subPackage.package.version)
        ? greatest
        : subPackage;
    }

    return greatest;
  });

  return monorepoPackage.package;
}

/** Get all of the packages+version in the lerna monorepo */
async function getPackageList() {
  return getLernaPackages().then((packages) =>
    packages.map((p) => `${p.name}@${p.version.split("+")[0]}`)
  );
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
    ? await greaterRelease((s) => s, name, localVersion)
    : undefined;

  return latestVersion ? inc(latestVersion, version as ReleaseType) : version;
}

interface GetLegacyAuthArgsOptions {
  /** whether the project is a monorepo */
  isMonorepo?: boolean;
}

/** Get the args to use legacy auth */
function getLegacyAuthArgs(
  useLegacy: boolean,
  options: GetLegacyAuthArgsOptions = {}
) {
  if (!useLegacy) {
    return [];
  }

  return [
    options.isMonorepo ? "--legacy-auth" : "--_auth",
    process.env.NPM_TOKEN,
  ];
}

/** Get the args to set the registry. Only used with lerna */
async function getRegistryArgs() {
  const registry = await getRegistry();
  return registry === DEFAULT_REGISTRY || !registry
    ? []
    : ["--registry", registry];
}

const pluginOptions = t.partial({
  /** Whether to create sub-package changelogs */
  subPackageChangelogs: t.boolean,
  /** Whether to create a commit for "next" version. The default behavior will only create the tags */
  commitNextVersion: t.boolean,
  /** Whether to set the npm token on CI */
  setRcToken: t.boolean,
  /** Whether to force publish all the packages in a monorepo */
  forcePublish: t.boolean,
  /** A scope to publish canary versions under */
  canaryScope: t.string,
  /** Publish a monorepo with the lerna --exact flag */
  exact: t.boolean,
  /**
   * When publishing packages that require authentication but you are working with an internally
   * hosted NPM Registry that only uses the legacy Base64 version of username:password. This is
   * the same as the NPM publish _auth flag.
   */
  legacyAuth: t.boolean,
  /** Whether to add package information to monorepo changelogs */
  monorepoChangelog: t.boolean,
});

export type INpmConfig = t.TypeOf<typeof pluginOptions>;

/** Render a list of string in markdown */
const markdownList = (lines: string[]) =>
  lines.map((line) => `- \`${line}\``).join("\n");

/** Get the previous version. Typically from a package distribution description file. */
async function getPreviousVersion(auto: Auto, prereleaseBranch: string) {
  let previousVersion = "";

  if (isMonorepo()) {
    auto.logger.veryVerbose.info(
      "Using monorepo to calculate previous release"
    );
    const monorepoVersion = getLernaJson().version;

    if (monorepoVersion === "independent") {
      previousVersion =
        "dryRun" in auto.options && auto.options.dryRun
          ? markdownList(await getPackageList())
          : "";
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
  } else if (fs.existsSync("package.json")) {
    auto.logger.veryVerbose.info(
      "Using package.json to calculate previous version"
    );
    const { version, name } = await loadPackageJson();

    previousVersion = version
      ? await greaterRelease(
          auto.prefixRelease,
          name,
          auto.prefixRelease(version),
          prereleaseBranch
        )
      : "0.0.0";
  }

  auto.logger.verbose.info(
    "NPM: Got previous version from package.json",
    previousVersion
  );

  return previousVersion;
}

/** Remove the @ sign */
const sanitizeScope = (canaryScope: string) => canaryScope.replace("@", "");

/** Add a npm scope to a package name. Can have leading @ or not. */
const addCanaryScope = (canaryScope: string, name: string) =>
  `@${sanitizeScope(canaryScope)}/${name}`;

/** Change the scope of all the packages to the canary scope */
async function setCanaryScope(canaryScope: string, paths: string[]) {
  const packages = await Promise.all(
    paths.map(async (p) => [p, await loadPackageJson(p)] as const)
  );
  const names = packages.map(([, p]) => p.name);

  await Promise.all(
    packages.map(async ([p, packageJson]) => {
      const newJson = { ...packageJson };
      const name = packageJson.name.match(/@\S+\/\S+/)
        ? packageJson.name.split("/")[1]
        : packageJson.name;

      newJson.name = addCanaryScope(canaryScope, name);

      if (newJson.dependencies) {
        Object.keys(newJson.dependencies).forEach((d) => {
          if (names.includes(d)) {
            const depName = d.match(/@\S+\/\S+/) ? d.split("/")[1] : d;

            newJson.dependencies![
              addCanaryScope(canaryScope, depName)
            ] = newJson.dependencies![d];
            delete newJson.dependencies![d];
          }
        });
      }

      await writeFile(
        path.join(p, "package.json"),
        JSON.stringify(newJson, null, 2)
      );
    })
  );
}

/** Reset the scope changes of all the packages  */
async function gitReset() {
  await execPromise("git", ["reset", "--hard", "HEAD"]);
}

/** Make install instructions for multiple repos */
const makeMonorepoInstallList = (packageList: string[]) =>
  [
    ":sparkles: Test out this PR locally via:\n",
    "```bash",
    ...packageList.map((p) => `npm install ${p}`),
    "# or ",
    ...packageList.map((p) => `yarn add ${p}`),
    "```",
  ].join("\n");

interface IndependentPackageUpdate extends LernaPackage {
  /** The packages new version */
  newVersion: string;
}

/** Get an array of independent next version package updates */
const getIndependentNextReleases = async (
  bump: SEMVER,
  prereleaseBranch: string
) => {
  const packages = await getLernaPackages();
  const [, changedPackagesResult = ""] = await on(
    execPromise("yarn", ["lerna", "changed", "-a"])
  );
  const changedPackages = changedPackagesResult
    .split("\n")
    .map((changedPackage) => changedPackage.replace("(PRIVATE)", "").trim())
    .filter((changedPackage) =>
      packages.some((p) => p.name === changedPackage)
    );
  const allTags = (await execPromise("git", ["tag", "--sort='creatordate'"]))
    .split("\n")
    .reverse();

  if (!changedPackages.length) {
    return;
  }

  // Get all version updates
  const updates = await Promise.all(
    changedPackages.map(async (p) => {
      const lernaPackage = packages.find((pack) => pack.name === p);

      if (!lernaPackage) {
        return;
      }

      const currentVersion = lernaPackage?.version || "0.0.0";
      const name = `${p}@`;
      const lastTag =
        allTags.find((tag) => tag.startsWith(name)) || currentVersion;
      const lastVersion = lastTag.replace(name, "");

      return {
        ...lernaPackage,
        newVersion: determineNextVersion(
          currentVersion,
          lastVersion,
          bump,
          prereleaseBranch
        ),
      };
    })
  );

  return updates.filter((p): p is IndependentPackageUpdate => Boolean(p));
};

/** Apply updates to inter dependencies  */
const updateDependencies = (
  packageJson: IPackageJSON,
  type: "dependencies" | "devDependencies",
  updates: IndependentPackageUpdate[]
) => {
  const deps = packageJson[type];

  if (!deps) {
    return;
  }

  Object.entries(deps).forEach(([name, version]) => {
    if (
      typeof version !== "string" ||
      version.startsWith("link:") ||
      version.startsWith("file:")
    ) {
      return;
    }

    const depUpdate = updates.find((update) => update.name === name);

    if (depUpdate && version.includes(depUpdate.version)) {
      deps[name] = version.replace(depUpdate.version, depUpdate.newVersion);
    }
  });
};

/** Find changed packages and create a tag for the current next release. */
const tagIndependentNextReleases = async (
  bump: SEMVER,
  prereleaseBranch: string
) => {
  // Get all version updates
  const updates = await getIndependentNextReleases(bump, prereleaseBranch);

  if (!updates || !updates.length) {
    return;
  }

  // Update package.json
  await Promise.all(
    updates.map(async (lernaPackage) => {
      if (!lernaPackage) {
        return;
      }

      const packageJsonPath = path.join(lernaPackage.path, "package.json");
      const packageJson = JSON.parse(
        await readFile(packageJsonPath, {
          encoding: "utf-8",
        })
      );

      packageJson.version = lernaPackage.newVersion;

      updateDependencies(packageJson, "dependencies", updates);
      updateDependencies(packageJson, "devDependencies", updates);

      await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    })
  );

  // Commit work
  await execPromise("git", ["commit", "-am", "'Update versions'"]);

  // Create tags will be rolled back in the next hook
  await Promise.all(
    updates.map(async (lernaPackage) => {
      if (!lernaPackage) {
        return;
      }

      const newTag = `${lernaPackage.name}@${lernaPackage.newVersion}`;
      await execPromise("git", [
        "tag",
        "-a",
        "-m",
        `"Update version to ${newTag}"`,
        newTag,
      ]);
    })
  );
};

/** Find an available canary version to publish */
const findAvailableCanaryVersion = async (
  auto: Auto,
  packageName: string,
  startVersion: string
) => {
  let canaryVersion = startVersion;

  // eslint-disable-next-line no-await-in-loop
  while (await getPublishedVersion(`${packageName}@${canaryVersion}`)) {
    auto.logger.verbose.info(
      `Version "${canaryVersion}" is taken! Trying another...`
    );
    canaryVersion = inc(canaryVersion, "prerelease")!;
  }

  auto.logger.verbose.info(`Version "${canaryVersion}" is available!`);
  return canaryVersion;
};

/** Publish to NPM. Works in both a monorepo setting and for a single package. */
export default class NPMPlugin implements IPlugin {
  /** The name of the plugin */
  name = "npm";

  /** Whether to render a changelog like a monorepo's */
  private monorepoChangelog: boolean;
  /** the type of release shipit is making */
  private releaseType?: ShipitRelease;

  /** Whether to create sub-package changelogs */
  private readonly subPackageChangelogs: boolean;
  /** Whether to set the npm token in CI */
  private readonly setRcToken: boolean;
  /** Whether to always publish all packages in a monorepo */
  private readonly forcePublish: boolean;
  /** Publish a monorepo with the lerna --exact flag */
  private readonly exact: boolean;
  /** A scope to publish canary versions under */
  private readonly canaryScope: string | undefined;
  /** Whether to use legacy auth for npm */
  private readonly legacyAuth: boolean;
  /** Whether to use legacy auth for npm */
  private readonly commitNextVersion: boolean;

  /** Initialize the plugin with it's options */
  constructor(config: INpmConfig = {}) {
    this.legacyAuth = Boolean(config.legacyAuth);
    this.exact = Boolean(config.exact);
    this.monorepoChangelog = config.monorepoChangelog ?? true;
    this.subPackageChangelogs = config.subPackageChangelogs ?? true;
    this.setRcToken = config.setRcToken ?? true;
    this.forcePublish = config.forcePublish ?? true;
    this.commitNextVersion = config.commitNextVersion ?? false;
    this.canaryScope = config.canaryScope || undefined;
  }

  /** A memoized version of getLernaPackages */
  @memoize()
  private async getLernaPackages() {
    return getLernaPackages();
  }

  /** Custom initialization for this plugin */
  init(initializer: InteractiveInit) {
    initializer.hooks.createEnv.tap(this.name, (vars) => [
      ...vars,
      {
        variable: "NPM_TOKEN",
        message: `Enter a npm token for publishing packages https://docs.npmjs.com/creating-and-viewing-authentication-tokens`,
      },
    ]);

    initializer.hooks.getAuthor.tapPromise(this.name, async () => {
      const packageJson = await loadPackageJson();

      if (packageJson.author) {
        return true;
      }

      const author = await initializer.getAuthorInformation();
      const newPackageJson = { ...packageJson };
      newPackageJson.author = `${author.name} <${author.email}>`;
      await writeFile("package.json", JSON.stringify(newPackageJson, null, 2));

      return true;
    });

    initializer.hooks.getRepo.tapPromise(this.name, async () => {
      const packageJson = await loadPackageJson();

      if (packageJson.repository) {
        return true;
      }

      const repository = await initializer.getRepoInformation();
      const newPackageJson = { ...packageJson };
      newPackageJson.repository = `${repository.owner}/${repository.repo}`;
      await writeFile("package.json", JSON.stringify(newPackageJson, null, 2));

      return true;
    });

    initializer.hooks.writeRcFile.tapPromise(this.name, async (rc) => {
      const packageJson = await loadPackageJson();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((packageJson as any).auto) {
        initializer.logger.log.note(
          "Would have wrote configuration:\n",
          JSON.stringify(rc, null, 2)
        );
        initializer.logger.log.warn(
          "Found auto configuration in package.json. Doing nothing."
        );
      } else {
        await writeFile(
          "package.json",
          JSON.stringify({ ...packageJson, auto: rc }, null, 2)
        );
        initializer.logger.log.success("Wrote configuration to package.json");
      }

      return true;
    });
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const isQuiet = auto.logger.logLevel === "quiet";
    const isVerbose =
      auto.logger.logLevel === "verbose" ||
      auto.logger.logLevel === "veryVerbose";
    const verboseArgs = isQuiet
      ? ["--loglevel", "silent"]
      : isVerbose
      ? ["--loglevel", "silly"]
      : [];
    const prereleaseBranches =
      auto.config?.prereleaseBranches || DEFAULT_PRERELEASE_BRANCHES;
    const branch = getCurrentBranch();
    // if ran from master we publish the prerelease to the first
    // configured prerelease branch
    const prereleaseBranch =
      branch && prereleaseBranches.includes(branch)
        ? branch
        : prereleaseBranches[0];

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.modifyConfig.tap(this.name, (config) => {
      if (isMonorepo()) {
        const lernaJson = getLernaJson();

        if (lernaJson.tagVersionPrefix === "") {
          return {
            ...config,
            noVersionPrefix: true,
          };
        }
      }

      return config;
    });

    auto.hooks.beforeShipIt.tap(this.name, async ({ releaseType }) => {
      this.releaseType = releaseType;
      const isIndependent = getLernaJson().version === "independent";

      // In independent mode it's possible that no changes to packages have been
      // made, so no release will be made.
      if (isIndependent) {
        try {
          await execPromise("yarn", ["lerna", "updated", "-a"]);
        } catch (error) {
          auto.logger.log.warn(
            "Lerna detected no changes in project. Aborting release since nothing would be published."
          );
          auto.logger.verbose.warn(error);
          process.exit(0);
        }
      }

      if (!isCi) {
        return;
      }

      const { private: isPrivate } = await loadPackageJson();

      if (isPrivate) {
        return;
      }

      auto.checkEnv(this.name, "NPM_TOKEN");
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        "NPM: Getting repo information from package.json"
      );
      const packageJson = await loadPackageJson();

      if (!packageJson.author) {
        return;
      }

      const { author } = packageJson;

      if (typeof author === "string") {
        return parseAuthor(author);
      }

      return author;
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, () =>
      getPreviousVersion(auto, prereleaseBranch)
    );

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        "NPM: getting repo information from package.json"
      );
      const repo = await getConfigFromPackageJson();

      if (repo) {
        return repo;
      }
    });

    auto.hooks.onCreateRelease.tap(this.name, (release) => {
      release.hooks.createChangelogTitle.tap(
        `${this.name} - lerna independent`,
        () => {
          if (isMonorepo() && getLernaJson().version === "independent") {
            return "";
          }
        }
      );
    });

    auto.hooks.onCreateChangelog.tap(
      this.name,
      (changelog, { bump = SEMVER.patch }) => {
        changelog.hooks.renderChangelogLine.tapPromise(
          "NPM - Monorepo",
          async (line, commit) => {
            if (!isMonorepo() || !this.monorepoChangelog) {
              return line;
            }

            const lernaPackages = await this.getLernaPackages();
            const changedPackages = await getChangedPackages({
              sha: commit.hash,
              packages: lernaPackages,
              // If we are making a next release it's hard to get the independent next
              // versions to put in the changelog so we just omit them
              addVersion:
                this.releaseType !== "next" &&
                getLernaJson().version === "independent",
              logger: auto.logger,
              version: bump,
            });

            const section = changedPackages?.length
              ? changedPackages.map((p) => `\`${p}\``).join(", ")
              : "monorepo";

            if (section === "monorepo") {
              return line;
            }

            return [`- ${section}`, `  ${line}`].join("\n");
          }
        );

        changelog.hooks.sortChangelogLines.tap(
          "NPM - Monorepo Grouping",
          (lines) => {
            if (!isMonorepo() || !this.monorepoChangelog) {
              return lines;
            }

            const lineMap: Record<string, string[]> = {};

            lines.forEach((line) => {
              const monoRepoLine = line.split("\n");

              if (monoRepoLine.length === 1) {
                if (!lineMap.root) {
                  lineMap.root = [];
                }

                lineMap.root.push(line);
              } else {
                const [packageName, change] = monoRepoLine;

                if (!lineMap[packageName]) {
                  lineMap[packageName] = [];
                }

                lineMap[packageName].push(change);
              }
            });

            return Object.entries(lineMap).map(([packageName, changes]) => {
              if (packageName === "root") {
                return changes.join("\n");
              }

              return [packageName, ...changes].join("\n");
            });
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

        const [, changedPackagesResult = ""] = await on(
          execPromise("yarn", ["lerna", "changed"])
        );
        const changedPackages = changedPackagesResult.split("\n");

        if (!changedPackages.length) {
          return;
        }

        const lernaPackages = await getLernaPackages();
        const changelog = await auto.release.makeChangelog(bump);

        const monorepoChangelogSetting = this.monorepoChangelog;
        this.monorepoChangelog = false;

        // Cannot run git operations in parallel
        await lernaPackages.reduce(async (last, lernaPackage) => {
          await last;

          // If lerna doesn't think a package has changed then do not create sub-package changelog
          // Since we use "git log -m", merge commits can have lots of files in them. Lerna does not
          // use this option. This means that this hooks will only create a sub-package changelog if
          // lerna will publish an update for it
          if (!changedPackages.some((name) => lernaPackage.name === name)) {
            return;
          }

          auto.logger.verbose.info(
            `Updating changelog for: ${lernaPackage.name}`
          );

          const includedCommits = commits.filter((commit) =>
            commit.files.some((file) => inFolder(lernaPackage.path, file))
          );
          const title = `v${inc(lernaPackage.version, bump as ReleaseType)}`;
          const releaseNotes = await changelog.generateReleaseNotes(
            includedCommits
          );

          if (releaseNotes.trim()) {
            await auto.release!.updateChangelogFile(
              title,
              releaseNotes,
              path.join(lernaPackage.path, "CHANGELOG.md")
            );
          }
        }, Promise.resolve());

        this.monorepoChangelog = monorepoChangelogSetting;
      }
    );

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        const isBaseBranch = branch === auto.baseBranch;

        /** Log the version */
        const logVersion = (version: string) => {
          if (quiet) {
            console.log(version);
          } else {
            auto.logger.log.info(`Would have published: ${version}`);
          }
        };

        if (isMonorepo()) {
          auto.logger.verbose.info("Detected monorepo, using lerna");
          const monorepoVersion = getLernaJson().version;
          const isIndependent = monorepoVersion === "independent";

          if (dryRun) {
            if (isIndependent) {
              await execPromise("npx", [
                "lerna",
                "version",
                bump,
                ...(await getRegistryArgs()),
                ...getLegacyAuthArgs(this.legacyAuth, { isMonorepo: true }),
                "--yes",
                "--no-push",
                "--no-git-tag-version",
                "--no-commit-hooks",
                "--exact",
                "--ignore-scripts",
                ...verboseArgs,
              ]);

              const canaryPackageList = await getPackageList();
              // Reset after we read the packages from the system!
              await gitReset();

              logVersion(canaryPackageList.join("\n"));
            } else {
              logVersion(inc(monorepoVersion, bump as ReleaseType) || bump);
            }

            return;
          }

          const monorepoBump =
            isIndependent || !isBaseBranch
              ? bump
              : (await bumpLatest(getMonorepoPackage(), bump)) || bump;

          await execPromise("npx", [
            "lerna",
            "version",
            monorepoBump,
            !isIndependent && this.forcePublish && "--force-publish",
            "--no-commit-hooks",
            "--yes",
            "--no-push",
            "-m",
            isIndependent
              ? '"Bump independent versions [skip ci]"'
              : VERSION_COMMIT_MESSAGE,
            this.exact && "--exact",
            ...verboseArgs,
          ]);
          auto.logger.verbose.info("Successfully versioned repo");
          return;
        }

        const latestBump = isBaseBranch
          ? (await bumpLatest(await loadPackageJson(), bump)) || bump
          : bump;

        if (dryRun) {
          logVersion(latestBump);
          return;
        }

        await execPromise("npm", [
          "version",
          latestBump,
          "--no-commit-hooks",
          "-m",
          VERSION_COMMIT_MESSAGE,
          ...verboseArgs,
        ]);
        auto.logger.verbose.info("Successfully versioned repo");
      }
    );

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ bump, canaryIdentifier, dryRun, quiet }) => {
        if (this.setRcToken) {
          await setTokenOnCI(auto.logger);
          auto.logger.verbose.info("Set CI NPM_TOKEN");
        }

        const lastRelease = await auto.git!.getLatestRelease();
        const [, latestTag = lastRelease] = await on(
          auto.git!.getLatestTagInBranch()
        );
        const inPrerelease = prereleaseBranches.some((b) =>
          latestTag.includes(`-${b}.`)
        );

        /** Log the version */
        const logVersion = (version: string) => {
          if (quiet) {
            console.log(version);
          } else {
            auto.logger.log.info(`Would have published: ${version}`);
          }
        };

        if (isMonorepo()) {
          const isIndependent = getLernaJson().version === "independent";
          auto.logger.verbose.info("Detected monorepo, using lerna");

          const packagesBefore = await getLernaPackages();
          let canaryVersion =
            (isIndependent && `pre${bump}`) ||
            determineNextVersion(
              lastRelease,
              inPrerelease ? latestTag : packagesBefore[0].version,
              bump,
              canaryIdentifier
            );

          if (this.canaryScope && !dryRun) {
            await setCanaryScope(
              this.canaryScope,
              packagesBefore.map((p) => p.path)
            );
          }

          if (!isIndependent) {
            const { name } = getMonorepoPackage();

            canaryVersion = await findAvailableCanaryVersion(
              auto,
              name,
              canaryVersion
            );

            if (dryRun) {
              logVersion(canaryVersion);
              return;
            }
            // Is independent and a dry run
          } else if (dryRun) {
            await execPromise("npx", [
              "lerna",
              "version",
              canaryVersion,
              ...(await getRegistryArgs()),
              ...getLegacyAuthArgs(this.legacyAuth, { isMonorepo: true }),
              "--yes",
              "--no-push",
              "--no-git-tag-version",
              "--no-commit-hooks",
              "--exact",
              "--ignore-scripts",
              "--preid",
              canaryIdentifier,
              ...verboseArgs,
            ]);

            const canaryPackageList = await getPackageList();
            // Reset after we read the packages from the system!
            await gitReset();

            logVersion(canaryPackageList.join("\n"));
            return;
          }

          await execPromise("npx", [
            "lerna",
            "publish",
            canaryVersion,
            "--dist-tag",
            "canary",
            ...(await getRegistryArgs()),
            !isIndependent && "--force-publish",
            ...getLegacyAuthArgs(this.legacyAuth, { isMonorepo: true }),
            "--yes", // skip prompts,
            "--no-git-reset", // so we can get the version that just published
            "--no-git-tag-version", // no need to tag and commit,
            "--exact", // do not add ^ to canary versions, this can result in `npm i` resolving the wrong canary version
            ...(isIndependent ? ["--preid", canaryIdentifier] : []),
            ...verboseArgs,
          ]);

          auto.logger.verbose.info("Successfully published canary version");
          const packages = await getLernaPackages();
          const packageList = await getPackageList();
          // Reset after we read the packages from the system!
          await gitReset();

          if (isIndependent) {
            if (!packageList.some((p) => p.includes("canary"))) {
              return {
                error: "No packages were changed. No canary published.",
              };
            }

            return {
              newVersion: "Canary Versions",
              details: makeMonorepoInstallList(
                packageList.filter((p) => p.includes("canary"))
              ),
            };
          }

          const versioned = packages.find((p) => p.version.includes("canary"));

          if (!versioned) {
            return { error: "No packages were changed. No canary published." };
          }

          const version = versioned.version.split("+")[0];

          return {
            newVersion: this.canaryScope
              ? `under canary scope @${sanitizeScope(
                  this.canaryScope
                )}@${version}`
              : version,
            details: makeMonorepoInstallList(packageList),
          };
        }

        auto.logger.verbose.info("Detected single npm package");
        const current = await auto.getCurrentVersion(lastRelease);
        const { name, private: isPrivate } = await loadPackageJson();

        if (isPrivate) {
          return {
            error: "Package private, cannot make canary release to npm.",
          };
        }

        const canaryVersion = await findAvailableCanaryVersion(
          auto,
          name,
          determineNextVersion(lastRelease, current, bump, canaryIdentifier)
        );

        if (dryRun) {
          logVersion(canaryVersion);
          return;
        }

        if (this.canaryScope) {
          await setCanaryScope(this.canaryScope, ["./"]);
        }

        await execPromise("npm", [
          "version",
          canaryVersion,
          "--no-git-tag-version",
          "--no-commit-hooks",
          ...verboseArgs,
        ]);

        const publishArgs = ["--tag", "canary"];
        await execPromise("npm", [
          "publish",
          ...publishArgs,
          ...verboseArgs,
          ...getLegacyAuthArgs(this.legacyAuth),
        ]);

        if (this.canaryScope) {
          await gitReset();
        }

        auto.logger.verbose.info("Successfully published canary version");

        return {
          newVersion: canaryVersion,
          details: makeMonorepoInstallList([`${name}@${canaryVersion}`]),
        };
      }
    );

    auto.hooks.next.tapPromise(
      this.name,
      async (preReleaseVersions, { bump, dryRun }) => {
        if (this.setRcToken) {
          await setTokenOnCI(auto.logger);
          auto.logger.verbose.info("Set CI NPM_TOKEN");
        }

        const lastRelease = await auto.git!.getLatestRelease();
        const latestTag =
          (await auto.git?.getLastTagNotInBaseBranch(prereleaseBranch)) ||
          (await getPreviousVersion(auto, prereleaseBranch));

        if (isMonorepo()) {
          auto.logger.verbose.info("Detected monorepo, using lerna");
          const isIndependent = getLernaJson().version === "independent";
          // It's hard to accurately predict how we should bump independent versions.
          // So we manually make all the tags. (independent only)
          const next = isIndependent
            ? "from-git"
            : determineNextVersion(
                lastRelease,
                latestTag,
                bump,
                prereleaseBranch
              );

          auto.logger.verbose.info({
            lastRelease,
            latestTag,
            bump,
            prereleaseBranch,
            next,
          });

          if (dryRun) {
            if (isIndependent) {
              const packageUpdates = await getIndependentNextReleases(
                bump,
                prereleaseBranch
              );

              if (!packageUpdates || !packageUpdates.length) {
                auto.logger.log.warn(
                  "No independent package version updates found. No canary releases would be made"
                );
              } else {
                packageUpdates.forEach((p) =>
                  preReleaseVersions.push(`${p.name}@${p.newVersion}`)
                );
              }
            } else {
              preReleaseVersions.push(next);
            }

            return preReleaseVersions;
          }

          if (isIndependent) {
            await tagIndependentNextReleases(bump, prereleaseBranch);
          }

          await execPromise("npx", [
            "lerna",
            "publish",
            next,
            "--dist-tag",
            prereleaseBranch,
            "--preid",
            prereleaseBranch,
            "--no-push",
            // you always want a next version to publish
            !isIndependent && "--force-publish",
            ...(await getRegistryArgs()),
            ...getLegacyAuthArgs(this.legacyAuth, { isMonorepo: true }),
            // skip prompts
            "--yes",
            // do not add ^ to next versions, this can result in `npm i` resolving the wrong next version
            "--exact",
            "--no-commit-hooks",
            ...verboseArgs,
          ]);

          const tags = (
            await execPromise("git", ["tag", "--points-at", "HEAD"])
          ).split("\n");

          if (!this.commitNextVersion) {
            // we do not want to commit the next version. this causes
            // merge conflicts when merged into master. We also do not want
            // to re-implement the magic lerna does. So instead we let lerna
            // commit+tag the new version and roll back all the tags to the
            // previous commit.
            await Promise.all(
              // Move tags back one commit
              tags.map((tag) =>
                execPromise("git", ["tag", tag, "-f", "HEAD^", "-am", tag])
              )
            );
            // Move branch back one commit
            await execPromise("git", ["reset", "--hard", "HEAD~1"]);
          }

          auto.logger.verbose.info("Successfully published next version");

          preReleaseVersions = [
            ...preReleaseVersions,
            ...(isIndependent ? tags : tags.map(auto.prefixRelease)),
          ];
        } else {
          auto.logger.verbose.info("Detected single npm package");

          const newVersion = determineNextVersion(
            lastRelease,
            latestTag,
            bump,
            prereleaseBranch
          );
          const prefixedVersion = auto.prefixRelease(newVersion);

          preReleaseVersions.push(prefixedVersion);

          if (dryRun) {
            return preReleaseVersions;
          }

          await execPromise("npm", [
            "version",
            newVersion,
            // we do not want to commit the next version. this causes
            // merge conflicts when merged into master
            "--no-git-tag-version",
            ...verboseArgs,
          ]);

          const { private: isPrivate } = await loadPackageJson();

          await execPromise("git", [
            "tag",
            prefixedVersion,
            "-m",
            `"Update version to ${prefixedVersion}"`,
          ]);

          if (isPrivate) {
            auto.logger.log.info(
              `Package private, skipping prerelease publish to npm.`
            );
          } else {
            await execPromise("npm", [
              "publish",
              "--tag",
              prereleaseBranch,
              ...verboseArgs,
              ...getLegacyAuthArgs(this.legacyAuth),
            ]);
          }

          auto.logger.verbose.info("Successfully published next version");
        }

        await execPromise("git", ["push", auto.remote, branch, "--tags"]);
        return preReleaseVersions;
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      const status = await execPromise("git", ["status", "--porcelain"]);
      const isBaseBranch = branch === auto.baseBranch;
      // The only other time this hook is called is when creating a version
      // branch. So when on one of those branches publish to a tag of the same
      // name
      const tag = isBaseBranch
        ? []
        : [isMonorepo() ? "--dist-tag" : "--tag", branch];

      if (isVerbose && status) {
        auto.logger.log.error("Changed Files:\n", status);
      }

      if (this.setRcToken) {
        await setTokenOnCI(auto.logger);
        auto.logger.verbose.info("Set CI NPM_TOKEN");
      }

      if (isMonorepo()) {
        auto.logger.verbose.info("Detected monorepo, using lerna");

        if (auto.options?.verbose) {
          await execPromise("git", ["status", "--short"]);
        }

        await execPromise("npx", [
          "lerna",
          "publish",
          ...tag,
          "--yes",
          // Plugins can add as many commits as they want, lerna will still
          // publish the changed package versions. from-git broke when HEAD
          // didn't contain the tags
          "from-package",
          this.exact && "--exact",
          ...verboseArgs,
          ...(await getRegistryArgs()),
          ...getLegacyAuthArgs(this.legacyAuth, { isMonorepo: true }),
        ]);
      } else {
        const { private: isPrivate } = await loadPackageJson();

        if (isPrivate) {
          auto.logger.log.info(`Package private, skipping publish to npm.`);
        } else {
          await execPromise("npm", [
            "publish",
            ...tag,
            ...verboseArgs,
            ...getLegacyAuthArgs(this.legacyAuth),
          ]);
        }
      }

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        branch || auto.baseBranch,
      ]);
      auto.logger.verbose.info("Successfully published repo");
    });

    auto.hooks.makeRelease.tapPromise(this.name, async (options) => {
      const isIndependent = getLernaJson().version === "independent";

      // Independent mode will create multiple releases on Github.
      // Each release will only contain the release notes for the
      // package + global changes.
      if (isIndependent) {
        const lernaPackages = await getLernaPackages();
        // Go through each new tag:
        const newTags = (
          await execPromise("git", ["tag", "--points-at", "HEAD"])
        ).split("\n");

        if (options.dryRun) {
          newTags.map(async (tag) => {
            const lernaPackage = lernaPackages.find((p) =>
              tag.includes(p.name)
            );

            if (!lernaPackage) {
              return;
            }

            auto.logger.log.info(
              `Would have created a release on GitHub for: ${tag}`
            );
          });

          auto.logger.log.note(
            "The above versions reflect the current git tags pointing at the HEAD commit. During the normal release flow these tags would reflect the latest released version."
          );

          return [];
        }

        const packagePaths = lernaPackages.map((p) => p.path);
        const commitsAtRoot = options.commits.filter(
          (commit) =>
            !commit.files.some((file) =>
              packagePaths.some((p) => inFolder(p, file))
            )
        );
        auto.logger.log.info(`Releasing ${options.newVersion} to GitHub.`);
        const changelog = await auto.release!.makeChangelog();
        this.monorepoChangelog = false;

        const releases = await Promise.all(
          newTags.map(async (tag) => {
            const lernaPackage = lernaPackages.find((p) =>
              tag.includes(p.name)
            );

            if (!lernaPackage) {
              return;
            }

            auto.logger.log.info(`Releasing ${tag}...`);

            // 1. generate release notes for just the commits for the package
            const includedCommits = options.commits.filter((commit) =>
              commit.files.some((file) => inFolder(lernaPackage.path, file))
            );
            const releaseNotes = await changelog.generateReleaseNotes([
              ...commitsAtRoot,
              ...includedCommits,
            ]);

            auto.logger.log.info(`Using release notes:\n${releaseNotes}`);

            // 2. make a release for just that package
            return auto.git?.publish(releaseNotes, tag, options.isPrerelease);
          })
        );

        this.monorepoChangelog = false;

        return releases.filter(
          (
            release
          ): release is RestEndpointMethodTypes["repos"]["createRelease"]["response"] =>
            Boolean(release)
        );
      }
    });
  }
}
