/* tslint:disable:no-inferrable-types */

class Labels {
  public major: string = 'major';
  public minor: string = 'minor';
  public patch: string = 'patch';
  public skipRelease: string = 'skip-release';
  public release: string = 'release';
  public prerelease: string = 'prerelease';
}

class ChangelogTitles {
  public major = '💥  Breaking Change';
  public minor = '🚀  Enhancement';
  public patch = '🐛  Bug Fix';
  public internal = '🏠  Internal';
  public documentation = '📝  Documentation';
  [label: string]: string;
}

export class Config {
  public name?: string;
  public email?: string;
  public labels: Labels = new Labels();
  public changelogTitles: ChangelogTitles = new ChangelogTitles();
  public skipReleaseLabels: string[] = [];
  public slack?: string;
  public jira?: string;
  public githubApi?: string;
}
