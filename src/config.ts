/* tslint:disable:no-inferrable-types */
export enum Label {
  major = 'major',
  minor = 'minor',
  patch = 'patch',
  release = 'release',
  prerelease = 'prerelease',
  skipRelease = 'skipRelease'
}

export class Labels {
  public [Label.major]: string = 'major';
  public [Label.minor]: string = 'minor';
  public [Label.patch]: string = 'patch';
  public [Label.skipRelease]: string = 'skip-release';
  /**
   * @deprecated
   */
  public 'skip-release': string = 'skip-release';
  public [Label.release]: string = 'release';
  public [Label.prerelease]: string = 'prerelease';
}

export class ChangelogTitles {
  public major = '💥  Breaking Change';
  public minor = '🚀  Enhancement';
  public patch = '🐛  Bug Fix';
  public internal = '🏠  Internal';
  public documentation = '📝  Documentation';
  [label: string]: string;
}

export class Config {
  public noVersionPrefix?: boolean;
  public onlyPublishWithReleaseLabel?: boolean;
  public name?: string;
  public email?: string;
  public owner?: string;
  public repo?: string;
  public labels?: Labels = new Labels();
  public changelogTitles?: ChangelogTitles = new ChangelogTitles();
  public skipReleaseLabels?: string[] = [];
  public slack?: string;
  public jira?: string;
  public githubApi?: string;
}
