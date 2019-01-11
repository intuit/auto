import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';
import { IAutoHooks } from '../main';

export const makeHooks = (): IAutoHooks => ({
  beforeRun: new SyncHook(['config']),
  getAuthor: new AsyncSeriesBailHook([]),
  getPreviousVersion: new AsyncSeriesBailHook(['prefixRelease']),
  getRepository: new AsyncSeriesBailHook([]),
  renderChangelogLine: new AsyncSeriesBailHook(['commits', 'lineRender']),
  renderChangelogTitle: new AsyncSeriesBailHook(['commits', 'lineRender']),
  renderChangelogAuthor: new AsyncSeriesBailHook([
    'author',
    'commit',
    'options'
  ]),
  renderChangelogAuthorLine: new AsyncSeriesBailHook(['author', 'user']),
  publish: new AsyncSeriesHook(['version'])
});
