import * as t from "io-ts";

import { labelDefinition } from "./semver";

const author = t.partial({
  /** The name and email of the author to make commits with */
  author: t.string,
  /** The name of the author to make commits with */
  name: t.string,
  /** The email of the author to make commits with */
  email: t.string,
});

export type AuthorInformation = t.TypeOf<typeof author>;

const githubInformation = t.partial({
  /** The github api to interact with */
  githubApi: t.string,
  /** The github graphql api to interact with */
  githubGraphqlApi: t.string,
  /** The branch that is used as the base. defaults to master */
  baseBranch: t.string,
});

export type GithubInformation = t.TypeOf<typeof githubInformation>;

const repoInformation = t.partial({
  /** The repo of to publish, might be set in package manager file. */
  repo: t.string,
  /** The owner of the repo to publish, might be set in package manager file. */
  owner: t.string,
});

export type RepoInformation = t.TypeOf<typeof repoInformation>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginConfig = [string, any] | string;

const releaseCalculationOptions = t.partial({
  /** Instead of publishing every PR only publish when "release" label is present */
  onlyPublishWithReleaseLabel: t.boolean,
});

export type ReleaseCalculationOptions = t.TypeOf<
  typeof releaseCalculationOptions
>;

const logOptions = t.partial({
  /** Show more logs */
  verbose: t.union([t.boolean, t.tuple([t.boolean, t.boolean])]),
});

export type LogOptions = t.TypeOf<typeof logOptions>;

const globalOptions = t.partial({
  /** Another auto configuration to extend */
  extends: t.string,
  /** Labels that power auto */
  labels: t.array(labelDefinition),
  /** Branches to create pre-releases from */
  prereleaseBranches: t.array(t.string),
  /** Configured auto plugins */
  plugins: t.array(t.union([t.string, t.tuple([t.string, t.any])])),
  /** Whether to prefix the version with a "v" */
  noVersionPrefix: t.boolean,
  /**
   * Manage old version branches.
   * Can be a true or a custom version branch prefix.
   *
   * @default 'version-'
   */
  versionBranches: t.union([t.boolean, t.string]),
  /** Options to pass to "auto comment" */
  comment: t.partial({
    delete: t.boolean,
    edit: t.boolean,
  }),
  /** Options to pass to "auto changelog" */
  changelog: t.partial({
    message: t.string,
  }),
  /** Options to pass to "auto release" */
  release: t.partial({
    prerelease: t.boolean,
  }),
  /** Options to pass to "auto shipit" */
  shipit: t.partial({
    prerelease: t.boolean,
    noChangelog: t.boolean,
    message: t.string,
    onlyGraduateWithReleaseLabel: t.boolean,
  }),
  /** Options to pass to "auto latest" */
  latest: t.partial({
    prerelease: t.boolean,
    noChangelog: t.boolean,
    message: t.string,
  }),
  /** Options to pass to "auto canary" */
  canary: t.partial({
    force: t.boolean,
    message: t.union([t.literal(false), t.string]),
  }),
  /** Options to pass to "auto next" */
  next: t.partial({
    message: t.string,
  }),
});

export type GlobalOptions = t.TypeOf<typeof globalOptions>;

export const autoRc = t.intersection([
  globalOptions,
  t.intersection([
    repoInformation,
    githubInformation,
    author,
    releaseCalculationOptions,
    logOptions,
  ]),
]);

export type AutoRc = t.TypeOf<typeof autoRc>;

export const loadedAutoRc = t.intersection([
  autoRc,
  t.type({
    /** Labels that power auto */
    labels: t.array(labelDefinition),
    /** Branches to create pre-releases from */
    prereleaseBranches: t.array(t.string),
    /** The branch that is used as the base. defaults to master */
    baseBranch: t.string,
  }),
]);

export type LoadedAutoRc = t.TypeOf<typeof loadedAutoRc>;
