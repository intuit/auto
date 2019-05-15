import {
  GlobalArgs,
  ICanaryOptions,
  IChangelogOptions,
  ICommentOptions,
  ICreateLabelsOptions,
  IInitOptions,
  ILabelOptions,
  IPRBodyOptions,
  IPRCheckOptions,
  IPRStatusOptions,
  IReleaseOptions,
  IShipItOptions,
  IVersionOptions
} from '@intuit-auto/core';

export interface IInitCommandOptions extends IInitOptions {
  command: 'init';
}

export interface ICreateLabelsCommandOptions extends ICreateLabelsOptions {
  command: 'create-labels';
}

export interface ILabelCommandOptions extends ILabelOptions {
  command: 'label';
}

export interface IPRCheckCommandOptions extends IPRCheckOptions {
  command: 'pr-check';
}

export interface IPRStatusCommandOptions extends IPRStatusOptions {
  command: 'pr-status';
}

export interface IVersionCommandOptions extends IVersionOptions {
  command: 'version';
}

export interface IChangelogCommandOptions extends IChangelogOptions {
  command: 'changelog';
}

export interface IReleaseCommandOptions extends IReleaseOptions {
  command: 'release';
}

export interface ICommentCommandOptions extends ICommentOptions {
  command: 'comment';
}

export interface IPRBodyCommandOptions extends IPRBodyOptions {
  command: 'pr-body';
}

export interface IShipItCommandOptions extends IShipItOptions {
  command: 'shipit';
}

export interface ICanaryCommandOptions extends ICanaryOptions {
  command: 'canary';
}

export type CliArgs = GlobalArgs &
  (
    | IInitCommandOptions
    | ICreateLabelsCommandOptions
    | ILabelCommandOptions
    | IPRCheckCommandOptions
    | IPRStatusCommandOptions
    | ICommentCommandOptions
    | IChangelogCommandOptions
    | IPRBodyCommandOptions
    | IReleaseCommandOptions
    | IVersionCommandOptions
    | ICanaryCommandOptions
    | IShipItCommandOptions);

export type Flags =
  | keyof GlobalArgs
  | keyof IInitOptions
  | keyof ICreateLabelsOptions
  | keyof ILabelOptions
  | keyof IPRCheckOptions
  | keyof IPRStatusOptions
  | keyof ICommentOptions
  | keyof IReleaseOptions
  | keyof IVersionOptions
  | keyof IShipItOptions
  | keyof IChangelogOptions
  | keyof ICanaryOptions;
