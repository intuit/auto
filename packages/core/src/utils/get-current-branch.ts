import envCi from "env-ci";
import { execSync } from "child_process";

const env = envCi();

/** Get the current branch the git repo is set to */
export function getCurrentBranch() {
  const isPR = "isPr" in env && env.isPr;
  let branch: string | undefined;
  // env-ci sets branch to target branch (ex: main) in some CI services.
  // so we should make sure we aren't in a PR just to be safe

  if (isPR && "prBranch" in env) {
    branch = env.prBranch;
  } else {
    branch = env.branch;
  }

  if (!branch) {
    try {
      branch = execSync("git symbolic-ref --short HEAD", {
        encoding: "utf8",
        stdio: "ignore",
      });
    } catch (error) {}
  }

  return branch;
}
