/* tslint:disable:no-inferrable-types */

class Labels {
  public major?: string = 'major';
  public minor?: string = 'minor';
  public patch?: string = 'patch';
  public skipRelease?: string = 'skip-release';
  public prerelease?: string = 'prerelease';
}

export class Config {
  public name?: string;
  public email?: string;
  public labels?: Labels = new Labels();
  public skipReleaseLabels?: string[];
  public slack?: string;
  public jira?: string;
  public githubApi?: string;
}
