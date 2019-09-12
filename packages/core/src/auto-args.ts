interface IAuthorOptions {
  name?: string;
  email?: string;
}

export interface IRepoOptions {
  owner?: string;
  repo?: string;
}

export interface ILogOptions {
  verbose?: boolean;
  veryVerbose?: boolean;
}

export interface IInitOptions {
  onlyLabels?: boolean;
  dryRun?: boolean;
}

export interface ICreateLabelsOptions {
  dryRun?: boolean;
}

export interface ILabelOptions {
  pr?: number;
}

export interface IPRCheckOptions {
  pr?: number;
  url?: string;
  skipReleaseLabels?: string[];
  context?: string;
  dryRun?: boolean;
}

export interface IPRStatusOptions {
  sha?: string;
  pr?: number;
  url: string;
  state: 'pending' | 'success' | 'error' | 'failure';
  description: string;
  context: string;
  dryRun?: boolean;
}

export interface IVersionOptions {
  skipReleaseLabels?: string[];
  onlyPublishWithReleaseLabel?: boolean;
  from?: string;
}

export interface IChangelogOptions extends IAuthorOptions {
  noVersionPrefix?: boolean;
  dryRun?: boolean;
  from?: string;
  to?: string;
  message?: string;
}

export interface IReleaseOptions extends IAuthorOptions {
  noVersionPrefix?: boolean;
  dryRun?: boolean;
  useVersion?: string;
}

export interface ICommentOptions {
  message?: string;
  pr?: number;
  context?: string;
  dryRun?: boolean;
  delete?: boolean;
}

export type IPRBodyOptions = ICommentOptions;

export interface IShipItOptions {
  dryRun?: boolean;
}

export interface ICanaryOptions {
  dryRun?: boolean;
  pr?: number;
  build?: number;
  message?: string | 'false';
}

export type GlobalOptions = {
  githubApi?: string;
  baseBranch?: string;
  githubGraphqlApi?: string;
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
    | IShipItOptions);
