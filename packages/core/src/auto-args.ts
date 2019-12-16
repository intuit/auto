export interface IAuthorOptions {
  /** Author's name */
  name?: string;
  /** Author's email */
  email?: string;
}

export interface IRepoOptions {
  /** Github repo owner (user) */
  owner?: string;
  /** GitHub project to operate on */
  repo?: string;
}

export interface ILogOptions {
  /** Show more logs */
  verbose?: boolean | boolean[];
}

export interface IInitOptions {
  /** Only show prompts for creating labels */
  onlyLabels?: boolean;
  /** Do not actually do anything */
  dryRun?: boolean;
}

export interface ICreateLabelsOptions {
  /** Do not actually do anything */
  dryRun?: boolean;
}

export interface ILabelOptions {
  /** PR to get the labels for */
  pr?: number;
}

export interface IPRCheckOptions {
  /** PR to check the label for */
  pr?: number;
  /** URL to attach to the checkmark */
  url?: string;
  /** The context the check should be attached to */
  context?: string;
  /** Do not actually do anything */
  dryRun?: boolean;
}

export interface IPRStatusOptions {
  /** The commit to attach a check to */
  sha?: string;
  /** The pr to attach a check to */
  pr?: number;
  /** URL to attach to the checkmark */
  url: string;
  /** The state to set the checkmark to */
  state: 'pending' | 'success' | 'error' | 'failure';
  /** The description to attach to the checkmark */
  description: string;
  /** The context the check should be attached to */
  context: string;
  /** Do not actually do anything */
  dryRun?: boolean;
}

export interface IVersionOptions {
  /** Instead of publishing every PR only publish when "release" label is present */
  onlyPublishWithReleaseLabel?: boolean;
  /** Commit to start calculating the version from */
  from?: string;
}

export interface IChangelogOptions extends IAuthorOptions {
  /** Whether to prefix the version with a "v" */
  noVersionPrefix?: boolean;
  /** Do not actually do anything */
  dryRun?: boolean;
  /** Commit to start calculating the changelog from */
  from?: string;
  /** Commit to start calculating the changelog to */
  to?: string;
  /** The commit message to commit the changelog changes with */
  message?: string;
}

export interface IReleaseOptions extends IAuthorOptions {
  /** Whether to prefix the version with a "v" */
  noVersionPrefix?: boolean;
  /** Do not actually do anything */
  dryRun?: boolean;
  /** Commit to start calculating the release from */
  from?: string;
  /** Override the version to release */
  useVersion?: string;
  /** Create a prerelease */
  prerelease?: boolean;
}

export interface ICommentOptions {
  /** The message to use when commenting */
  message?: string;
  /** THe PR to comment on */
  pr?: number;
  /** The context the message should be attached to. Use to post multiple comments to a PR */
  context?: string;
  /** Do not actually do anything */
  dryRun?: boolean;
  /** Delete the previous comment */
  delete?: boolean;
  /** Instead of deleting/adding a new comment. Just edit the old one */
  edit?: boolean;
}

export type IPRBodyOptions = ICommentOptions;

export interface IShipItOptions {
  /** Do not actually do anything */
  dryRun?: boolean;
  /**
   * Make auto publish prerelease versions when merging to master.
   * Only PRs merged with "release" label will generate a "latest" release.
   * Only use this flag if you do not want to maintain a prerelease branch,
   * and instead only want to use master.
   */
  onlyGraduateWithReleaseLabel?: boolean;
}

export interface ICanaryOptions {
  /** Do not actually do anything */
  dryRun?: boolean;
  /** THe PR to attach the canary to */
  pr?: number;
  /** The build to attach the canary to */
  build?: number;
  /** The message used when attaching the canary version to a PR */
  message?: string | 'false';
}

export interface INextOptions {
  /** Do not actually do anything */
  dryRun?: boolean;
  /** The message used when attaching the prerelease version to a PR */
  message?: string;
}

export type GlobalOptions = {
  /** The GitHub api to communicate with through octokit */
  githubApi?: string;
  /** The branch that is used as the base. defaults to master */
  baseBranch?: string;
  /** The GitHub graphql api to communicate with through octokit */
  githubGraphqlApi?: string;
  /** Plugins to initialize "auto" with */
  plugins?: string[];
} & IRepoOptions &
  ILogOptions;

export type ApiOptions = GlobalOptions &
  (
    | IInitOptions
    | ICreateLabelsOptions
    | ILabelOptions
    | IPRCheckOptions
    | IPRStatusOptions
    | ICommentOptions
    | IChangelogOptions
    | IPRBodyOptions
    | IReleaseOptions
    | IVersionOptions
    | ICanaryOptions
    | IShipItOptions
  );
