import fs from 'fs';
import parseGitHubUrl from 'parse-github-url';
import { promisify } from 'util';

export interface IRepoConfig {
  owner: string;
  repo: string;
}

const readFile = promisify(fs.readFile);

const getPackageConfig = async (): Promise<IPackageJSON> => {
  const pkgConfig = await readFile('./package.json', 'utf-8');
  return JSON.parse(pkgConfig);
};

export default async function getConfigFromPackageJson(): Promise<IRepoConfig> {
  const { repository } = await getPackageConfig();

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
