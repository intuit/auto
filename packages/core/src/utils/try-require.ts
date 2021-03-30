import importCwd from "import-cwd";
import requireg from "requireg";
import importFrom from "import-from";
import createLog from "./logger";

const logger = createLog();

/** Try to require something either from the CWD or the regular way */
export default function tryRequire(tryPath: string, from?: string) {
  try {
    // Require from CWD
    return importCwd(tryPath);
  } catch (error) {
    // if we try to actually require npm we will import something that is the actual npm API
    // not the plugin that we want
    if (tryPath === "npm") {
      return;
    }

    // If a plugin has any errors we want to inform the user
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }

    try {
      // Require from __dirname and then common global package places. Needed for npx and global installs
      return requireg(tryPath);
    } catch (error) {
      logger.veryVerbose.warn(error.message);
    }

    if (from) {
      try {
        // For loading plugins specified in a configuration (yarn 2)
        return importFrom(from, tryPath);
      } catch (error) {
        logger.veryVerbose.warn({ from, tryPath, error });
      }
    }
  }
}
