import {
  AuthorInformation,
  RepoInformation,
  GithubInformation,
  LogOptions,
  ReleaseCalculationOptions,
} from "./types";

export interface ICreateLabelsOptions {
  /** Do not actually do anything */
  dryRun?: boolean;
}

export interface ILabelOptions {
  /** PR to get the labels for */
  pr?: number;

  /** Label to check for */
  exists?: string;
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
  state: "pending" | "success" | "error" | "failure";
  /** The description to attach to the checkmark */
  description: string;
  /** The context the check should be attached to */
  context: string;
  /** Do not actually do anything */
  dryRun?: boolean;
}

export type IVersionOptions = ReleaseCalculationOptions & {
  /** Commit to start calculating the version from */
  from?: string;
};

export interface QuietOption {
  /** Print **only** the result of the command */
  quiet?: boolean;
}

interface NoVersionPrefix {
  /** Whether to prefix the version with a "v" */
  noVersionPrefix?: boolean;
}

export interface DryRunOption {
  /** Do not actually do anything */
  dryRun?: boolean;
}

interface ChangelogMessage {
  /** The commit message to commit the changelog changes with */
  message?: string;
}

interface ChangelogTitle {
  /** Override the title use in the addition to the CHANGELOG.md. */
  title?: string;
}

interface Prerelease {
  /** Create a prerelease */
  prerelease?: boolean;
}

interface BaseBranch {
  /** The branch to treat as the base */
  baseBranch?: string;
}

export type IChangelogOptions = BaseBranch &
  ChangelogTitle &
  ChangelogMessage &
  QuietOption &
  DryRunOption &
  NoVersionPrefix &
  Partial<AuthorInformation> & {
    /** Commit to start calculating the changelog from */
    from?: string;
    /** Commit to start calculating the changelog to */
    to?: string;
    /** Don't commit the changelog */
    noCommit?: boolean;
  };

export type IReleaseOptions = BaseBranch &
  Prerelease &
  DryRunOption &
  NoVersionPrefix &
  Partial<AuthorInformation> &
  Partial<RepoInformation> & {
    /** Commit to start calculating the release from */
    from?: string;
    /** Commit to calculate the release to */
    to?: string;
    /** Override the version to release */
    useVersion?: string;
  };

export type ICommentOptions = DryRunOption & {
  /** The message to use when commenting */
  message?: string;
  /** THe PR to comment on */
  pr?: number;
  /** The context the message should be attached to. Use to post multiple comments to a PR */
  context?: string;
  /** Delete the previous comment */
  delete?: boolean;
  /** Instead of deleting/adding a new comment. Just edit the old one */
  edit?: boolean;
};

export type IPRBodyOptions = Omit<ICommentOptions, "edit" | "delete">;

export type ILatestOptions = BaseBranch &
  DryRunOption &
  Partial<AuthorInformation> &
  Prerelease &
  NoVersionPrefix &
  ChangelogTitle &
  ChangelogMessage &
  QuietOption &
  ReleaseCalculationOptions & {
    /** Skip creating the changelog */
    noChangelog?: boolean;
  };

export type IShipItOptions = ILatestOptions & {
  /**
   * Make auto publish prerelease versions when merging to baseBranch.
   * Only PRs merged with "release" label will generate a "latest" release.
   * Only use this flag if you do not want to maintain a prerelease branch,
   * and instead only want to use baseBranch.
   */
  onlyGraduateWithReleaseLabel?: boolean;
};

export type ICanaryOptions = QuietOption & {
  /** Do not actually do anything */
  dryRun?: boolean;
  /** THe PR to attach the canary to */
  pr?: number;
  /** The build to attach the canary to */
  build?: number;
  /** The message used when attaching the canary version to a PR */
  message?: string | "false";
  /** Always deploy a canary, even if the PR is marked as skip release */
  force?: boolean;
};

export type INextOptions = QuietOption & {
  /** Do not actually do anything */
  dryRun?: boolean;
  /** The message used when attaching the prerelease version to a PR */
  message?: string;
};

export interface IInfoOptions {
  /** List some of the available plugins */
  listPlugins?: boolean;
}

export type GlobalOptions = {
  /** Plugins to initialize "auto" with */
  plugins?: string[];
} & Partial<GithubInformation & RepoInformation> &
  LogOptions;

export type ApiOptions = GlobalOptions &
  (
    | ILatestOptions
    | IInfoOptions
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
