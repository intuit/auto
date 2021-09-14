import {
  AuthorInformation,
  RepoInformation,
  GithubInformation,
  LogOptions,
  ReleaseCalculationOptions,
  AutoRc,
} from "./types";

export type ICreateLabelsOptions = DryRunOption;

export interface ILabelOptions {
  /** PR to get the labels for */
  pr?: number;
  /** Label to check for */
  exists?: string;
}

export interface IPRCheckOptions extends DryRunOption {
  /** PR to check the label for */
  pr?: number;
  /** URL to attach to the checkmark */
  url?: string;
  /** The context the check should be attached to */
  context?: string;
}

export interface IPRStatusOptions extends DryRunOption {
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
}

export type IVersionOptions = ReleaseCalculationOptions & {
  /** Commit to start calculating the version from */
  from?: string;
};

export interface QuietOption {
  /** Print **only** the result of the command */
  quiet?: boolean;
}

type NoVersionPrefix = Pick<AutoRc, "noVersionPrefix">;

export interface DryRunOption {
  /** Do not actually do anything */
  dryRun?: boolean;
}

interface ChangelogTitle {
  /** Override the title use in the addition to the CHANGELOG.md. */
  title?: string;
}

type BaseBranch = Pick<GithubInformation, "baseBranch">;

export type IChangelogOptions = BaseBranch &
  ChangelogTitle &
  NonNullable<AutoRc["changelog"]> &
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
  NonNullable<AutoRc["release"]> &
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

export type ICommentOptions = DryRunOption &
  NonNullable<AutoRc["comment"]> & {
    /** The message to use when commenting */
    message?: string;
    /** THe PR to comment on */
    pr?: number;
    /** The context the message should be attached to. Use to post multiple comments to a PR */
    context?: string;
  };

export type IPRBodyOptions = Omit<ICommentOptions, "edit" | "delete">;

export type ILatestOptions = BaseBranch &
  DryRunOption &
  NonNullable<AutoRc["latest"]> &
  NoVersionPrefix &
  ChangelogTitle &
  QuietOption &
  ReleaseCalculationOptions &
  Partial<AuthorInformation> &
  Partial<RepoInformation> & {
    /** Commit to start calculating the release from */
    from?: string;
    /** Override the version to release */
    useVersion?: string;
  };

export type IShipItOptions = ILatestOptions & NonNullable<AutoRc["shipit"]>;

export type ICanaryOptions = QuietOption &
  NonNullable<AutoRc["canary"]> &
  DryRunOption & {
    /** THe PR to attach the canary to */
    pr?: number;
    /** The build to attach the canary to */
    build?: number;
  };

export type INextOptions = QuietOption &
  NonNullable<AutoRc["next"]> &
  DryRunOption;

export interface IInfoOptions {
  /** List some of the available plugins */
  listPlugins?: boolean;
}

export type GlobalOptions = Pick<AutoRc, "plugins"> &
  Partial<GithubInformation & RepoInformation> &
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
