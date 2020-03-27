import parseGitHubUrl from "parse-github-url";
import on from "await-to-js";

import execPromise from "./exec-promise";

/**
 * Get the owner and repo from the configure remote "origin"
 */
export default async function getRepository() {
  const [, origin] = await on(
    execPromise("git", ["remote", "get-url", "origin"])
  );

  if (origin) {
    const info =
      parseGitHubUrl(origin) || ({} as Record<string, string | undefined>);
    const { name, owner } = info;

    if (name && owner) {
      return { repo: name, owner };
    }
  }
}
