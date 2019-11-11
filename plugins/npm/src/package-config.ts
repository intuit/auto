import parseGitHubUrl from 'parse-github-url';
import { loadPackageJson } from './utils';

export interface IRepoConfig {
  /** Owner of the repo (or GitHub user) */
  owner: string;
  /** The project */
  repo: string;
}

/** Try to the the owner/repo from the package.json */
export default async function getConfigFromPackageJson(): Promise<IRepoConfig> {
  const { repository } = await loadPackageJson();

  if (!repository) {
    throw new Error('Cannot read repo info from package.json');
  }

  const { owner, name } =
    parseGitHubUrl(
      typeof repository === 'string' ? repository : repository.url
    ) || {};

  if (!owner || !name) {
    throw new Error(
      'Cannot read owner and package name from GitHub URL in package.json'
    );
  }

  return {
    repo: name,
    owner
  };
}
