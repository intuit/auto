import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';
import { IAutoHooks } from '../main';

export const makeHooks = (): IAutoHooks => ({
  beforeRun: new SyncHook(['config']),
  getAuthor: new AsyncSeriesBailHook([]),
  getPreviousVersion: new AsyncSeriesBailHook(['prefixRelease']),
  getRepository: new AsyncSeriesBailHook([]),
  renderChangelogLine: new AsyncSeriesBailHook(['commits', 'lineRender']),
  publish: new AsyncSeriesHook(['version'])
});
