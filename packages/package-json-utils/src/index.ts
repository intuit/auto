import * as fs from "fs";
import path from "path";
import { promisify } from "util";
import parseGitHubUrl from "parse-github-url";
import parseAuthor from "parse-author";

const readFile = promisify(fs.readFile);

/** Load and parse the root package json for the project */
export async function loadPackageJson(root = "./"): Promise<IPackageJSON> {
  return JSON.parse(await readFile(path.join(root, "package.json"), "utf-8"));
}

export interface IRepoConfig {
  /** Owner of the repo (or GitHub user) */
  owner: string;
  /** The project */
  repo: string;
}

/** Try to the the owner/repo from the package.json */
export async function getRepo(): Promise<IRepoConfig | undefined> {
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

/** Get the author from a package.json */
export async function getAuthor() {
  const packageJson = await loadPackageJson();

  if (!packageJson.author) {
    return;
  }

  const { author } = packageJson;

  if (typeof author === "string") {
    return parseAuthor(author);
  }

  return author;
}
