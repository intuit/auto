import {
  Auto,
  determineNextVersion,
  execPromise,
  IPlugin,
  getCurrentBranch,
  DEFAULT_PRERELEASE_BRANCHES,
  validatePluginConfiguration,
} from "@auto-it/core";
import * as t from "io-ts";
import { inc, ReleaseType } from "semver";

const pluginOptions = t.intersection([
  t.interface({
    /** The target registry to push too */
    registry: t.string,
  }),
  t.partial({
    /** Whether to tag non-prerelease images with latest */
    tagLatest: t.boolean,
    /** The source image, if a static name and/or tag */
    image: t.string,
  }),
]);

export type IDockerPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Manages tagging and publishing to docker registries. */
export default class DockerPlugin implements IPlugin {
  /** The name of the plugin */
  name = "docker";

  /** The calculated docker tags for publish */
  private calculatedTags?: string[];

  /** Initialize the plugin with it's options */
  constructor(private readonly options: IDockerPluginOptions) {
    this.options.image = options.image || process.env.IMAGE;
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
        auto.checkEnv(this.name, "IMAGE");
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

    auto.hooks.version.tapPromise(this.name, async ({ bump, dryRun }) => {
      if (!auto.git) {
        return;
      }

      const lastTag = await getTag();
      const newTag = inc(lastTag, bump as ReleaseType);

      if (dryRun && newTag) {
        console.log(newTag);
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
    });

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ bump, canaryIdentifier, dryRun }) => {
        if (!auto.git) {
          return;
        }

        const lastRelease = await auto.git.getLatestRelease();
        const current = await auto.getCurrentVersion(lastRelease);
        const nextVersion = inc(current, bump as ReleaseType);
        const canaryVersion = `${nextVersion}-${canaryIdentifier}`;

        if (dryRun) {
          console.log(canaryVersion);
          return;
        }

        const targetImage = `${this.options.registry}:${canaryVersion}`;

        await execPromise("docker", ["tag", this.options.image, targetImage]);
        await execPromise("docker", ["push", targetImage]);

        auto.logger.verbose.info("Successfully published canary version");
        return canaryVersion;
      }
    );

    auto.hooks.next.tapPromise(
      this.name,
      async (preReleaseVersions, bump, { dryRun }) => {
        if (!auto.git) {
          return preReleaseVersions;
        }

        const prereleaseBranches =
          auto.config?.prereleaseBranches ?? DEFAULT_PRERELEASE_BRANCHES;
        const branch = getCurrentBranch() || "";
        const prereleaseBranch = prereleaseBranches.includes(branch)
          ? branch
          : prereleaseBranches[0];
        const lastRelease = await auto.git.getLatestRelease();
        const current =
          (await auto.git.getLastTagNotInBaseBranch(prereleaseBranch)) ||
          (await auto.getCurrentVersion(lastRelease));
        const prerelease = determineNextVersion(
          lastRelease,
          current,
          bump,
          prereleaseBranch
        );
        const targetImage = `${this.options.registry}:${prerelease}`;

        preReleaseVersions.push(prerelease);

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
