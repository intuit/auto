import execPromise from "./exec-promise";

/** Reset all git changes */
export const gitReset = async () =>
  execPromise("git", ["reset", "--hard", "HEAD"]);
