import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import { updateRepo } from "@artsy/update-repo";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import parseGitHubUrl from "parse-github-url";
import * as t from "io-ts";

/** Determine if the current directory is an NPM package */
const isNpmPackage = (dir?: string) =>
  fs.existsSync(dir ? path.join(dir, "package.json") : "package.json");

/** Determine if the current directory is an lerna monorepo */
const isLernaMonorepo = (dir?: string) =>
  fs.existsSync(dir ? path.join(dir, "package.json") : "package.json");

/** Read a NPM package.json */
const readPackageJson = (dir?: string) =>
  JSON.parse(
    fs.readFileSync(dir ? path.join(dir, "package.json") : "package.json", {
      encoding: "utf-8",
    })
  );

/** Update package in an npm package */
const updateNpmPackage = (
  dir: string,
  name: string,
  version: string,
  isYarn: boolean
) => {
  const { dependencies, devDependencies } = readPackageJson(dir);

  const isDep = Boolean(dependencies[name]);
  const isDevDep = Boolean(devDependencies[name]);
  const command =
    (isYarn && isDevDep && "yarn add -D") ||
    (isYarn && "yarn add") ||
    (isDevDep && "npm i --save-dev") ||
    "npm i --save";

  if (isDep || isDevDep) {
    execSync(`${command} ${name}@${version}`, { cwd: dir });
  }
};

/** Update a dependency in a monorepo */
const updateLernaMonorepo = (dir: string, name: string, version: string) =>
  execSync(
    `npx lernaupdate --non-interactive --dependency ${name}@${version}`,
    { cwd: dir }
  );

/** Update a dependency in a JS project */
const updateJsProject = (dir: string, name: string, version: string) => {
  if (isLernaMonorepo()) {
    updateLernaMonorepo(dir, name, version);
  } else {
    const hasLock = fs.existsSync("yarn.lock");
    updateNpmPackage(dir, name, version, hasLock);
  }
};

interface LernaPackage {
  /** The name of the package */
  name: string;
  /** The current version of the package */
  version: string;
  /** Whether the package is private */
  private: boolean;
}

/** Get a package name + updater to use with updateRepo */
async function getUpdater(
  auto: Auto
): Promise<[string, (dir: string) => void] | undefined> {
  // We are in a lerna monorepo so we should try to make updates for all of the
  // packages in it. We assume that the thing we are updating is also a JS project
  if (isLernaMonorepo()) {
    const { name } = readPackageJson();
    // Since we have already tagged the release we need to calculate from the previous tag
    const lastRelease = await auto.git!.getPreviousTagInBranch();
    const changedPackages: LernaPackage[] = JSON.parse(
      execSync(`lerna ls --json --since ${lastRelease}`, { encoding: "utf8" })
    );

    return [
      name,
      (dir) => {
        changedPackages.forEach((p) => {
          if (p.private) {
            return;
          }

          updateJsProject(dir, p.name, p.version);
        });
      },
    ];
  }

  // We are in NPM package. We assume that the thing we are updating is also a JS project.
  if (isNpmPackage()) {
    const { name, version } = readPackageJson();
    return [name, (dir) => updateJsProject(dir, name, version)];
  }
}

const optionalOptions = t.interface({
  /** The repo to open a PR against */
  repo: t.string,
});

const requiredOptions = t.partial({
  /** The branch to make a PR against */
  targetBranch: t.string,
  /** People to assign to the opened PR */
  assignees: t.array(t.string),
  /** Labels to assign to the opened PR */
  labels: t.array(t.string),
});

const repoOptions = t.intersection([optionalOptions, requiredOptions]);

export type UpdateRepoConfiguration = t.TypeOf<typeof repoOptions>;

const pluginOptions = t.union([repoOptions, t.array(repoOptions)]);

/** Update github repos with a pull request */
export default class UpdateRepoPlugin implements IPlugin {
  /** The name of the plugin */
  name = "update-repo";

  /** The options of the plugin */
  readonly options: UpdateRepoConfiguration[];

  /** Initialize the plugin with it's options */
  constructor(options: UpdateRepoConfiguration | UpdateRepoConfiguration[]) {
    this.options = Array.isArray(options) ? options : [options];
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.afterRelease.tapPromise(
      this.name,
      async ({ newVersion, releaseNotes, response }) => {
        if (!newVersion || !response) {
          return;
        }

        const releases = Array.isArray(response) ? response : [response];

        if (releases.some((release) => release.data.prerelease)) {
          return;
        }

        for await (const config of this.options) {
          await this.updateRepo(auto, newVersion, releaseNotes, config);
        }
      }
    );
  }

  /** Open a pr with a dependency update */
  private async updateRepo(
    auto: Auto,
    newVersion: string,
    releaseNotes: string,
    config: UpdateRepoConfiguration
  ) {
    const repo = parseGitHubUrl(config.repo);

    if (!repo || !repo.owner || !repo.name) {
      throw new Error(
        "Could not find valid repo configuration for @auto-it/update-repo"
      );
    }

    const updater = await getUpdater(auto);

    if (!updater) {
      throw new Error(
        "@auto-it/update-repo does not support this type of package! Please make a PR to add this behavior"
      );
    }

    const [name, update] = updater;
    const message = `Update ${name} to version ${newVersion}`;

    await updateRepo({
      repo: { owner: repo.owner, repo: repo.name },
      targetBranch: config.targetBranch || "master",
      assignees: config.labels || [],
      labels: config.labels || ["dependency"],
      commitMessage: message,
      branch: `update-${name}`,
      title: message,
      body: releaseNotes,
      update,
    });
  }
}
