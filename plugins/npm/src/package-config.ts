import parseGitHubUrl from "parse-github-url";
import { loadPackageJson } from "./utils";

export interface IRepoConfig {
  /** Owner of the repo (or GitHub user) */
  owner: string;
  /** The project */
  repo: string;
}

/** Try to the the owner/repo from the package.json */
export default async function getConfigFromPackageJson(): Promise<
  IRepoConfig | undefined
> {
  const { repository } = await loadPackageJson();

  if (!repository) {
    return;
  }

  const { owner, name } =
    parseGitHubUrl(
      typeof repository === "string" ? repository : repository.url
    ) || {};

  if (!owner || !name) {
    return;
  }

  return {
    repo: name,
    owner,
  };
}
