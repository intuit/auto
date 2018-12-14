import fs from 'fs';
import parseGithubUrl from 'parse-github-url';
import { promisify } from 'util';

export interface IRepoConfig {
  owner: string;
  repo: string;
  version: string;
}

interface IPackageConfig {
  version: string;
  repository?:
    | {
        url: string;
      }
    | 'string';
}

const readFile = promisify(fs.readFile);

const getPackageConfig = async (): Promise<IPackageConfig> => {
  const pkgConfig = await readFile('./package.json', 'utf-8');
  return JSON.parse(pkgConfig);
};

export default async function getConfigFromPackageJson(): Promise<IRepoConfig> {
  const { repository, version } = await getPackageConfig();

  if (!repository) {
    throw new Error('Cannot read repo info from package.json');
  }

  const { owner, name } =
    parseGithubUrl(
      typeof repository === 'string' ? repository : repository.url
    ) || ({} as any);

  if (!owner || !name) {
    throw new Error(
      'Cannot read owner and package name from Github URL in package.json'
    );
  }

  return {
    repo: name,
    owner,
    version
  };
}
