import {
  AsyncParallelHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
  SyncHook
} from 'tapable';
import { IAutoHooks } from '../auto';
import { IChangelogHooks } from '../changelog';
import { ILogParseHooks } from '../log-parse';
import { IReleaseHooks } from '../release';

export const makeHooks = (): IAutoHooks => ({
  beforeRun: new SyncHook(['config']),
  beforeShipIt: new SyncHook([]),
  afterShipIt: new AsyncParallelHook(['version', 'commits']),
  onCreateRelease: new SyncHook(['options']),
  onCreateChangelog: new SyncHook(['changelog']),
  onCreateLogParse: new SyncHook(['logParse']),
  getAuthor: new AsyncSeriesBailHook([]),
  getPreviousVersion: new AsyncSeriesBailHook(['prefixRelease']),
  getRepository: new AsyncSeriesBailHook([]),
  version: new AsyncParallelHook(['version']),
  afterVersion: new AsyncParallelHook([]),
  publish: new AsyncParallelHook(['version']),
  afterPublish: new AsyncParallelHook([])
});

export const makeReleaseHooks = (): IReleaseHooks => ({
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
