import { ILogger, execPromise } from "@auto-it/core";
import envCi from "env-ci";
import registryUrl from "registry-url";
import { loadPackageJson } from "@auto-it/package-json-utils";
import to from "await-to-js";
import path from "path";
import os from "os";

import {
  readFile,
  writeFile,
  isMonorepo,
  getLernaJson,
  getNpmrcPath,
  removeFile,
} from "./utils";
import urljoin from "url-join";

const { isCi } = envCi();

export const DEFAULT_REGISTRY = "https://registry.npmjs.org";

/** Get the registry for the project */
export const getRegistry = async () => {
  const { publishConfig = {}, name } = await loadPackageJson();
  const lernaJson = isMonorepo() ? getLernaJson() : undefined;
  let registry: string;

  if (publishConfig.registry) {
    registry = publishConfig.registry;
  } else if (lernaJson?.command?.publish?.registry) {
    registry = lernaJson.command.publish.registry;
  } else if (name?.startsWith("@")) {
    const scope = name.split(`/`)[0];
    registry = registryUrl(scope);
  } else {
    registry = registryUrl();
  }

  return registry;
};

/**
 * Set the .npmrc only when in a continuos integration environment
 *
 * @returns `true` if the .npmrc token was written, `false` otherwise
 * */
export async function setTokenOnCI(logger: ILogger): Promise<boolean> {
  if (!isCi) {
    return false;
  }

  const { private: isPrivate } = await loadPackageJson();

  if (isPrivate && !isMonorepo()) {
    logger.verbose.info("NPM token not set for private package.");
    return false;
  }

  const npmrcFilePath = getNpmrcPath();

  const [readRCError, npmrcContents = ""] = await to(
    readFile(npmrcFilePath, "utf-8")
  );
  if (readRCError) {
    logger.veryVerbose.error(
      `${npmrcFilePath} doesn't exist or cannot be read`
    );
  }

  const registry = await getRegistry();

  logger.verbose.note(`Using ${registry} registry for package`);

  const registryPrefix = urljoin(
    registry.replace(/^https?:/, ``),
    ":_authToken="
  );
  // Intentionally escape this so it can be replaced by npm later
  const authTokenString = `${registryPrefix}\${NPM_TOKEN}`;

  logger.verbose.info(
    `Will set authentication token string in ${npmrcFilePath}`
  );

  const { NPM_TOKEN } = process.env;
  if (
    npmrcContents.includes(authTokenString) ||
    (NPM_TOKEN && npmrcContents.includes(`${registryPrefix}${NPM_TOKEN}`))
  ) {
    logger.verbose.success(
      `npmrc file, ${npmrcFilePath}, is already setup correctly`
    );
    return false;
  }

  logger.verbose.info(
    `Writing authentication token string, ${authTokenString}, to ${npmrcFilePath}`
  );

  await writeFile(npmrcFilePath, `${npmrcContents}\n${authTokenString}`.trim());

  if (path.dirname(npmrcFilePath) === process.cwd()) {
    await execPromise("git", ["--assume-unchanged", npmrcFilePath]);
  }

  logger.log.success(`Wrote authentication token string to ${npmrcFilePath}`);
  return true;
}

/**
 * Remove the token if we previously wrote it
 */
export async function unsetTokenOnCI(logger: ILogger) {
  if (!isCi) {
    return;
  }

  const npmrcPath = getNpmrcPath();
  const npmrcDir = path.dirname(npmrcPath);

  if (npmrcDir === process.cwd()) {
    const [fileUntracked] = await to(
      execPromise("git", ["ls-files", "--error-unmatch", npmrcPath])
    );

    if (fileUntracked) {
      await removeFile(npmrcPath);
    } else {
      await execPromise("git", ["--no-assume-unchanged", npmrcPath]);
      await execPromise("git", ["checkout", npmrcPath]);
    }
  } else if (npmrcDir === os.homedir()) {
    /**
     * This probably isn't the safest. Likely, instead of removing ~/.npmrc we should
     * only delete the line that we specifically added. Given that this is CI though
     * and it _should_ be unlikely that folks are writing a .npmrc to the home directory
     * that's supposed to persist over a large series of actions, I think it's safe _enough_
     * that we ignore this for now.
     */
    await removeFile(npmrcPath);
  } else {
    logger.log.error("Unable to clear .npmrc, invalid .npmrc path:", npmrcPath);
  }
}
