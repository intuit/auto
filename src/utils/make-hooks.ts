import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';
import { IGitHubReleaseHooks } from '../github-release';
import { ILogParseHooks } from '../log-parse';
import { IAutoHooks } from '../main';

export const makeHooks = (): IAutoHooks => ({
  beforeRun: new SyncHook(['config']),
  beforeShipit: new SyncHook([]),
  onCreateGitHubRelease: new SyncHook(['config']),
  onCreateLogParse: new SyncHook(['gitHubReleaseConfig']),
  getAuthor: new AsyncSeriesBailHook([]),
  getPreviousVersion: new AsyncSeriesBailHook(['prefixRelease']),
  getRepository: new AsyncSeriesBailHook([]),
  publish: new AsyncSeriesHook(['version'])
});

export const makeGitHubReleaseHooks = (): IGitHubReleaseHooks => ({
  onCreateLogParse: new SyncHook(['logParser'])
});

export const makeLogHooks = (): ILogParseHooks => ({
  renderChangelogLine: new AsyncSeriesBailHook(['commits', 'lineRender']),
  renderChangelogTitle: new AsyncSeriesBailHook(['commits', 'lineRender']),
  renderChangelogAuthor: new AsyncSeriesBailHook([
    'author',
    'commit',
    'options'
  ]),
  renderChangelogAuthorLine: new AsyncSeriesBailHook(['author', 'user'])
});
