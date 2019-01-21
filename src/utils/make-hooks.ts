import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';
import { IGitHubReleaseHooks } from '../github-release';
import { IChangelogHooks } from '../log-parse';
import { IAutoHooks } from '../main';

export const makeHooks = (): IAutoHooks => ({
  beforeRun: new SyncHook(['config']),
  beforeShipIt: new SyncHook([]),
  onCreateGitHubRelease: new SyncHook(['config']),
  onCreateChangelog: new SyncHook(['gitHubReleaseConfig']),
  getAuthor: new AsyncSeriesBailHook([]),
  getPreviousVersion: new AsyncSeriesBailHook(['prefixRelease']),
  getRepository: new AsyncSeriesBailHook([]),
  publish: new AsyncSeriesHook(['version'])
});

export const makeGitHubReleaseHooks = (): IGitHubReleaseHooks => ({
  onCreateChangelog: new SyncHook(['changelog'])
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
