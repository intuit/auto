import { z } from "zod";

import { labelDefinition } from "./semver";

const author = z
  .strictObject({
    /** The name and email of the author to make commits with */
    author: z.union([
      z.string(),
      // Extra keys weren't rejected here under io-ts either
      z.looseObject({
        /** The name of the author to make commits with */ name: z.string(),
        /** The email of the author to make commits with */
        email: z.string(),
      }),
    ]),
    /** The name of the author to make commits with */
    name: z.string(),
    /** The email of the author to make commits with */
    email: z.string(),
  })
  .partial();

export type AuthorInformation = z.infer<typeof author>;

const githubInformation = z
  .strictObject({
    /** The github api to interact with */
    githubApi: z.string(),
    /** The github graphql api to interact with */
    githubGraphqlApi: z.string(),
    /** The branch that is used as the base */
    baseBranch: z.string(),
  })
  .partial();

export type GithubInformation = z.infer<typeof githubInformation>;

const repoInformation = z
  .strictObject({
    /** The repo of to publish, might be set in package manager file. */
    repo: z.string(),
    /** The owner of the repo to publish, might be set in package manager file. */
    owner: z.string(),
  })
  .partial();

export type RepoInformation = z.infer<typeof repoInformation>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginConfig = [string, any] | string;

const releaseCalculationOptions = z
  .strictObject({
    /** Instead of publishing every PR only publish when "release" label is present */
    onlyPublishWithReleaseLabel: z.boolean(),
  })
  .partial();

export type ReleaseCalculationOptions = z.infer<
  typeof releaseCalculationOptions
>;

const logOptions = z
  .strictObject({
    /** Show more logs */
    verbose: z.union([z.boolean(), z.tuple([z.boolean(), z.boolean()])]),
  })
  .partial();

export type LogOptions = z.infer<typeof logOptions>;

export const globalOptions = z
  .strictObject({
    /** Another auto configuration to extend */
    extends: z.string(),
    /** Labels that power auto */
    labels: z.array(labelDefinition),
    /** Don't add default labels */
    noDefaultLabels: z.boolean(),
    /** Branches to create pre-releases from */
    prereleaseBranches: z.array(z.string()),
    /** Configured auto plugins */
    plugins: z.array(z.union([z.string(), z.tuple([z.string(), z.any()])])),
    /** Whether to prefix the version with a "v" */
    noVersionPrefix: z.boolean(),
    /**
     * Manage old version branches.
     * Can be a true or a custom version branch prefix.
     *
     * @default 'version-'
     */
    versionBranches: z.union([z.boolean(), z.string()]),
    /** Options to pass to "auto comment" */
    comment: z
      .strictObject({
        /** Delete the previous comment */
        delete: z.boolean(),
        /** Instead of deleting/adding a new comment. Just edit the old one */
        edit: z.boolean(),
      })
      .partial(),
    /** Options to pass to "auto changelog" */
    changelog: z
      .strictObject({
        /** The commit message to commit the changelog changes with */
        message: z.string(),
      })
      .partial(),
    /** Options to pass to "auto release" */
    release: z
      .strictObject({
        /** Create a prerelease */
        prerelease: z.boolean(),
      })
      .partial(),
    /** Options to pass to "auto shipit" */
    shipit: z
      .strictObject({
        /** Create a prerelease */
        prerelease: z.boolean(),
        /** Skip creating the changelog */
        noChangelog: z.boolean(),
        /** The commit message to commit the changelog changes with */
        message: z.string(),
        /**
         * Make auto publish prerelease versions when merging to baseBranch.
         * Only PRs merged with "release" label will generate a "latest" release.
         * Only use this flag if you do not want to maintain a prerelease branch,
         * and instead only want to use baseBranch.
         */
        onlyGraduateWithReleaseLabel: z.boolean(),
      })
      .partial(),
    /** Options to pass to "auto latest" */
    latest: z
      .strictObject({
        /** Create a prerelease */
        prerelease: z.boolean(),
        /** Skip creating the changelog */
        noChangelog: z.boolean(),
        /** The commit message to commit the changelog changes with */
        message: z.string(),
      })
      .partial(),
    /** Options to pass to "auto canary" */
    canary: z
      .strictObject({
        /** Always deploy even if marked as skip release */
        force: z.boolean(),
        /** The message used when attaching the canary version to a PR */
        message: z.union([z.literal(false), z.string()]),
        /** How the canary version should be attached to a PR */
        target: z.enum(["pr-body", "comment", "status"]),
      })
      .partial(),
    /** Options to pass to "auto next" */
    next: z
      .strictObject({
        /** Always deploy even if marked as skip release */
        force: z.boolean(),
        /** The message used when attaching the prerelease version to a PR */
        message: z.string(),
      })
      .partial(),
  })
  .partial();

export type GlobalOptions = z.infer<typeof globalOptions>;

export const autoRc = globalOptions.extend({
  ...repoInformation.shape,
  ...githubInformation.shape,
  ...author.shape,
  ...releaseCalculationOptions.shape,
  ...logOptions.shape,
});

export type AutoRc = z.infer<typeof autoRc>;

export const loadedAutoRc = autoRc.extend({
  /** Labels that power auto */
  labels: z.array(labelDefinition),
  /** Branches to create pre-releases from */
  prereleaseBranches: z.array(z.string()),
  /** The branch that is used as the base */
  baseBranch: z.string(),
});

export type LoadedAutoRc = z.infer<typeof loadedAutoRc>;
