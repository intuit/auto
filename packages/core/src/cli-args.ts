interface IAuthorArgs {
  name?: string;
  email?: string;
}

export interface IRepoArgs {
  owner?: string;
  repo?: string;
}

export interface ILogArgs {
  verbose?: boolean;
  veryVerbose?: boolean;
}

export interface IInitCommandOptions {
  onlyLabels?: boolean;
  dryRun?: boolean;
}

export interface ICreateLabelsCommandOptions {
  dryRun?: boolean;
}

export interface ILabelCommandOptions {
  pr?: number;
}

export interface IPRCheckCommandOptions {
  pr?: number;
  url?: string;
  skipReleaseLabels?: string[];
  context?: string;
  dryRun?: boolean;
}

export interface IPRCommandOptions {
  sha?: string;
  pr?: number;
  url: string;
  state: 'pending' | 'success' | 'error' | 'failure';
  description: string;
  context: string;
  dryRun?: boolean;
}

export interface IVersionCommandOptions {
  skipReleaseLabels?: string[];
  onlyPublishWithReleaseLabel?: boolean;
}

export interface IChangelogOptions extends IAuthorArgs {
  noVersionPrefix?: boolean;
  dryRun?: boolean;
  from?: string;
  to?: string;
  message?: string;
}

export interface IReleaseCommandOptions extends IAuthorArgs {
  noVersionPrefix?: boolean;
  dryRun?: boolean;
  useVersion?: string;
}

export interface ICommentCommandOptions {
  message?: string;
  pr?: number;
  context?: string;
  dryRun?: boolean;
  delete?: boolean;
}

export interface IShipItCommandOptions {
  dryRun?: boolean;
}

export interface ICanaryCommandOptions {
  dryRun?: boolean;
  pr?: number;
  build?: number;
  message?: string | 'false';
}

type GlobalFlags = {
  command: string;
  githubApi?: string;
  baseBranch?: string;
  githubGraphqlApi?: string;
  plugins?: string[];
} & IRepoArgs &
  ILogArgs;

export type ArgsType = GlobalFlags &
  (
    | IInitCommandOptions
    | ICreateLabelsCommandOptions
    | ILabelCommandOptions
    | IPRCheckCommandOptions
    | IPRCommandOptions
    | ICommentCommandOptions
    | IReleaseCommandOptions
    | IVersionCommandOptions
    | IShipItCommandOptions);

export type Flags =
  | keyof GlobalFlags
  | keyof IInitCommandOptions
  | keyof ICreateLabelsCommandOptions
  | keyof ILabelCommandOptions
  | keyof IPRCheckCommandOptions
  | keyof IPRCommandOptions
  | keyof ICommentCommandOptions
  | keyof IReleaseCommandOptions
  | keyof IVersionCommandOptions
  | keyof IShipItCommandOptions;
