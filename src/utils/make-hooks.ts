import {
  AsyncSeriesBailHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
  SyncHook
} from 'tapable';
import { IChangelogHooks } from '../changelog';
import { IGitHubReleaseHooks } from '../github-release';
import { ILogParseHooks } from '../log-parse';
import { IAutoHooks } from '../main';

export const makeHooks = (): IAutoHooks => ({
  beforeRun: new SyncHook(['config']),
  beforeShipIt: new SyncHook([]),
  onCreateGitHubRelease: new SyncHook(['gitHubReleaseConfig']),
  onCreateChangelog: new SyncHook(['changelog']),
  onCreateLogParse: new SyncHook(['logParse']),
  getAuthor: new AsyncSeriesBailHook([]),
  getPreviousVersion: new AsyncSeriesBailHook(['prefixRelease']),
  getRepository: new AsyncSeriesBailHook([]),
  publish: new AsyncSeriesHook(['version'])
});

export const makeGitHubReleaseHooks = (): IGitHubReleaseHooks => ({
  onCreateChangelog: new SyncHook(['changelog']),
  onCreateLogParse: new SyncHook(['logParse'])
});

export const makeLogParseHooks = (): ILogParseHooks => ({
  parseCommit: new AsyncSeriesWaterfallHook(['commit']),
  omitCommit: new AsyncSeriesBailHook(['commit'])
});

export const makeChangelogHooks = (): IChangelogHooks => ({
  renderChangelogLine: new AsyncSeriesBailHook(['commits', 'lineRender']),
  renderChangelogTitle: new AsyncSeriesBailHook(['commits', 'lineRender']),
  renderChangelogAuthor: new AsyncSeriesBailHook([
    'author',
    'commit',
    'options'
  ]),
  renderChangelogAuthorLine: new AsyncSeriesBailHook(['author', 'user'])
});
