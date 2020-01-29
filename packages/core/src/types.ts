import { ILabelDefinition } from './release';

export interface AuthorInformation {
  /** The name of the author to make commits with */
  name: string;
  /** The email of the author to make commits with */
  email: string;
}

export interface GithubInformation {
  /** The github api to interact with */
  githubApi?: string;
  /** The github graphql api to interact with */
  githubGraphqlApi?: string;
  /** The branch that is used as the base. defaults to master */
  baseBranch?: string;
}

export interface RepoInformation {
  /** The repo of to publish, might be set in package manager file. */
  repo: string;
  /** The owner of the repo to publish, might be set in package manager file. */
  owner: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginConfig = [string, any] | string;

export interface ReleasesPackage {
  /** Where the project is */
  target: string;
  /** What extra plugins the package should use */
  plugins?: PluginConfig[];
}

export interface ReleaseCalculationOptions {
  /** Instead of publishing every PR only publish when "release" label is present */
  onlyPublishWithReleaseLabel?: boolean;
}

export interface LogOptions {
  /** Show more logs */
  verbose?: boolean | boolean[];
}

export type AutoRc = Partial<
  RepoInformation &
    GithubInformation &
    AuthorInformation &
    ReleaseCalculationOptions &
    LogOptions
> & {
  /** Labels that power auto */
  labels?: ILabelDefinition[];
  /** Configured auto plugins */
  plugins?: PluginConfig[];
  /** Support for multi-package repos */
  packages?: ReleasesPackage[];
  /** Branches to create pre-releases from */
  prereleaseBranches?: string[];
  /** Whether to prefix the version with a "v" */
  noVersionPrefix?: boolean;
  /**
   * Manage old version branches.
   * Can be a true or a custom version branch prefix.
   *
   * @default 'version-'
   */
  versionBranches?: true | string;
};

export type LoadedAutoRc = AutoRc &
  Required<Pick<AutoRc, 'labels' | 'prereleaseBranches' | 'baseBranch'>>;
