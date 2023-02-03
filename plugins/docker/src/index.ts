import {
  Auto,
  determineNextVersion,
  execPromise,
  IPlugin,
  getCurrentBranch,
  DEFAULT_PRERELEASE_BRANCHES,
  validatePluginConfiguration,
  getPrNumberFromEnv,
} from "@auto-it/core";
import * as t from "io-ts";
import { inc, ReleaseType } from "semver";

const pluginOptions = t.partial({
  /** The source image, if a static name and/or tag */
  image: t.string,
  /** The target registry to push too */
  registry: t.string,
  /** Whether to tag non-prerelease images with latest alias tag */
  tagLatest: t.boolean,
  /** Whether to tag prereleases with alias tags too */
  tagPrereleaseAliases: t.boolean,
  /** Whether to tag pull requests with alias tags  */
  tagPullRequestAliases: t.boolean,
  /** Prerelease alias tag mappings (BRANCH=ALIAS_NAME) */
  prereleaseAliasMappings: t.record(t.string, t.string),
});

/** Convert string/number to boolean value */
function toBoolean(v?: string|number) {
  return String(v).search(/(true|1)/i) >= 0
}

enum DOCKER_PLUGIN_ENV_VARS {
  IMAGE = 'IMAGE',
  REGISTRY = 'REGISTRY',
  TAG_LATEST = 'TAG_LATEST',
  TAG_PRERELEASE_ALIASES = 'TAG_PRERELEASE_ALIASES',
  TAG_PULL_REQUEST_ALIASES = 'TAG_PULL_REQUEST_ALIASES'
}

export type IDockerPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Manages tagging and publishing to docker registries. */
export default class DockerPlugin implements IPlugin {
  /** The name of the plugin */
  name = "docker";

  /** The calculated docker tags for publish */
  private calculatedTags?: string[];

  /** Initialize the plugin with it's options */
  constructor(private readonly options: IDockerPluginOptions) {
    this.options.image = options.image || process.env[DOCKER_PLUGIN_ENV_VARS.IMAGE];
    this.options.registry = options.registry || process.env[DOCKER_PLUGIN_ENV_VARS.REGISTRY];
    this.options.tagLatest = options.tagLatest || toBoolean(process.env[DOCKER_PLUGIN_ENV_VARS.TAG_LATEST]);
    this.options.tagPrereleaseAliases = options.tagPrereleaseAliases || toBoolean(process.env[DOCKER_PLUGIN_ENV_VARS.TAG_PRERELEASE_ALIASES]);
    this.options.tagPullRequestAliases = options.tagPullRequestAliases || toBoolean(process.env[DOCKER_PLUGIN_ENV_VARS.TAG_PULL_REQUEST_ALIASES]);
    this.options.prereleaseAliasMappings = options.prereleaseAliasMappings || {};
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    /** Gets the latest tag for a given branch */
    async function getTag() {
      try {
        return await auto.git!.getLatestTagInBranch();
      } catch (error) {
        return auto.prefixRelease("0.0.0");
      }
    }

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.beforeRun.tap(this.name, (rc) => {
      const dockerPlugin = rc.plugins!.find(
        (plugin) =>
          plugin[0] === this.name || plugin[0] === `@auto-it/${this.name}`
      ) as [string, IDockerPluginOptions];
      if (!dockerPlugin?.[1]?.image) {
        auto.checkEnv(this.name, DOCKER_PLUGIN_ENV_VARS.IMAGE);
      }

      if (!dockerPlugin?.[1]?.registry) {
        auto.checkEnv(this.name, DOCKER_PLUGIN_ENV_VARS.REGISTRY);
      }

      if (!dockerPlugin?.[1]?.tagLatest) {
        auto.checkEnv(this.name, DOCKER_PLUGIN_ENV_VARS.TAG_LATEST);
      }

      if (!dockerPlugin?.[1]?.tagPrereleaseAliases) {
        auto.checkEnv(this.name, DOCKER_PLUGIN_ENV_VARS.TAG_PRERELEASE_ALIASES);
      }

      if (!dockerPlugin?.[1]?.tagPullRequestAliases) {
        auto.checkEnv(this.name, DOCKER_PLUGIN_ENV_VARS.TAG_PULL_REQUEST_ALIASES);
      }
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      if (!auto.git) {
        throw new Error(
          "Can't calculate previous version without Git initialized!"
        );
      }

      return getTag();
    });

    auto.hooks.version.tapPromise(
      this.name,
      async ({ bump, dryRun, quiet }) => {
        if (!auto.git) {
          return;
        }

        const lastTag = await getTag();
        const newTag = inc(lastTag, bump as ReleaseType);
        const aliasTag = "latest";

        if (dryRun && newTag) {
          if (quiet) {
            console.log(this.options.tagLatest ? [newTag, aliasTag].join(', ') : newTag);
          } else {
            auto.logger.log.info(`Would have published: ${this.options.tagLatest ? [newTag, aliasTag].join(', ') : newTag}`);
          }

          return;
        }

        if (!newTag) {
          auto.logger.log.info("No release found, doing nothing");
          return;
        }

        const prefixedTag = auto.prefixRelease(newTag);

        auto.logger.log.info(`Tagging new tag: ${lastTag} => ${prefixedTag}`);
        await execPromise("git", [
          "tag",
          prefixedTag,
          "-m",
          `"Update version to ${prefixedTag}"`,
        ]);

        if (this.options.tagLatest) {
          await execPromise("git", [
            "tag",
            "-f",
            aliasTag,
            "-m",
            `"Tag release alias: ${aliasTag} (${prefixedTag})"`
          ]);
        }

        await execPromise("docker", [
          "tag",
          this.options.image,
          `${this.options.registry}:${newTag}`,
        ]);
        this.calculatedTags = [newTag];

        if (this.options.tagLatest === true && !bump.startsWith("pre")) {
          await execPromise("docker", [
            "tag",
            this.options.image,
            `${this.options.registry}:latest`,
          ]);
          this.calculatedTags.push("latest");
        }
      }
    );

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ bump, canaryIdentifier, dryRun, quiet }) => {
        if (!auto.git) {
          return;
        }

        const lastRelease = await auto.git.getLatestRelease();
        const current = await auto.getCurrentVersion(lastRelease);
        const nextVersion = inc(current, bump as ReleaseType);
        const canaryVersion = `${nextVersion}-${canaryIdentifier}`;

        const prNumber = getPrNumberFromEnv();
        const canaryAliasVersion = `pr-${prNumber}`;

        if (dryRun) {
          if (quiet) {
            console.log(prNumber ? [canaryVersion, canaryAliasVersion].join(', ') : canaryVersion);
          } else {
            auto.logger.log.info(`Would have published: ${prNumber ? [canaryVersion, canaryAliasVersion].join(', ') : canaryVersion}`);
          }

          return;
        }

        const targetImage = `${this.options.registry}:${canaryVersion}`;

        await execPromise("docker", ["tag", this.options.image, targetImage]);
        await execPromise("docker", ["push", targetImage]);

        if (prNumber && this.options.tagPullRequestAliases) {
          const aliasImage = `${this.options.registry}:${canaryAliasVersion}`;
          await execPromise("docker", ["tag", this.options.image, aliasImage]);
          await execPromise("docker", ["push", aliasImage]);
          await execPromise("git", ["tag", "-f", `${canaryAliasVersion}`, "-m", `Tag pull request canary: ${canaryAliasVersion} (${canaryVersion})`]);
          await execPromise("git", ["push", auto.remote, `refs/tags/${canaryAliasVersion}`, "-f"]);
        }

        auto.logger.verbose.info("Successfully published canary version");
        return canaryVersion;
      }
    );

    auto.hooks.next.tapPromise(
      this.name,
      async (preReleaseVersions, { bump, dryRun }) => {
        if (!auto.git) {
          return preReleaseVersions;
        }

        const prereleaseBranches =
          auto.config?.prereleaseBranches ?? DEFAULT_PRERELEASE_BRANCHES;
        const branch = getCurrentBranch() || "";
        const prereleaseBranch = prereleaseBranches.includes(branch)
          ? branch
          : prereleaseBranches[0];
        const prereleaseAlias = (this.options.prereleaseAliasMappings as {[key: string]: string})[prereleaseBranch] ?? prereleaseBranch;

        const lastRelease = await auto.git.getLatestRelease();
        const current =
          (await auto.git.getLastTagNotInBaseBranch(prereleaseBranch)) ||
          (await auto.getCurrentVersion(lastRelease));
        const prerelease = determineNextVersion(
          lastRelease,
          current,
          bump,
          prereleaseAlias
        );
        const targetImage = `${this.options.registry}:${prerelease}`;
        const aliasImage = `${this.options.registry}:${prereleaseAlias}`;

        preReleaseVersions.push(prerelease);

        if (this.options.tagPrereleaseAliases) {
          preReleaseVersions.push(aliasImage);
        }

        if (dryRun) {
          return preReleaseVersions;
        }

        await execPromise("git", [
          "tag",
          prerelease,
          "-m",
          `"Tag pre-release: ${prerelease}"`,
        ]);
        await execPromise("docker", ["tag", this.options.image, targetImage]);
        await execPromise("docker", ["push", targetImage]);
        await execPromise("git", ["push", auto.remote, branch, "--tags"]);

        if (this.options.tagPrereleaseAliases) {
          await execPromise("git", [
            "tag",
            "-f",
            prereleaseAlias,
            "-m",
            `"Tag pre-release alias: ${prereleaseAlias} (${prerelease})"`,
          ]);
          await execPromise("docker", ["tag", this.options.image, aliasImage]);
          await execPromise("docker", ["push", aliasImage]);
          await execPromise("git", ["push", auto.remote, `refs/tags/${prereleaseAlias}`, "-f"]);
        }

        return preReleaseVersions;
      }
    );

    auto.hooks.publish.tapPromise(this.name, async () => {
      auto.logger.log.info("Pushing new tag to GitHub");

      await Promise.all(
        this.calculatedTags!.map((tag) =>
          execPromise("docker", ["push", `${this.options.registry}:${tag}`])
        )
      );

      if (this.options.tagLatest) {
        await execPromise("git", ["push", auto.remote, `refs/tags/latest`, "-f"]);
      }

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        getCurrentBranch() || auto.baseBranch,
      ]);
    });
  }
}
