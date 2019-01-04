import fs from 'fs';
import path from 'path';
import registryUrl from 'registry-url';
import { promisify } from 'util';
import settingsUrl from './settings-url';

const readFile = promisify(fs.readFile);
const registry = registryUrl();
// tslint:disable-next-line
const normalizedRegistry = registry.replace('http:', '').replace('https:', '');

export default async function getGitHubToken(
  apiUrl = 'https://api.github.com'
): Promise<string> {
  if (process.env.GH_TOKEN) {
    return process.env.GH_TOKEN;
  }

  const helpText = `Try setting an access token up ${settingsUrl(apiUrl)}`;

  if (!process.env.HOME) {
    throw new Error(`Can't find the GH_TOKEN and no HOME defined. ${helpText}`);
  }

  const rcLocation = path.resolve(process.env.HOME, '.npmrc');

  if (fs.existsSync(rcLocation)) {
    const rc = await readFile(rcLocation, 'utf8');

    const regex = new RegExp(`${normalizedRegistry}:_authToken=\(\\w+\)`);
    const token = rc.match(regex);
    if (token && token[1]) {
      return token[1];
    }

    throw new Error(`No token in the .npmrc. ${helpText}`);
  }

  throw new Error(`Can't find a GitHub token to use. ${helpText}`);
}
