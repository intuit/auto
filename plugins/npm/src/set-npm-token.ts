import { ILogger } from "@auto-it/core";
import envCi from "env-ci";
import path from "path";
import registryUrl from "registry-url";
import urlJoin from "url-join";
import userHome from "user-home";
import { loadPackageJson } from "@auto-it/package-json-utils";

import { readFile, writeFile, isMonorepo, getLernaJson } from "./utils";

const { isCi } = envCi();

export const DEFAULT_REGISTRY = "https://registry.npmjs.org";

/** Get the registry for the project */
export const getRegistry = async () => {
  const { publishConfig = {}, name } = await loadPackageJson();
  const lernaJson = isMonorepo() ? getLernaJson() : undefined;
  let registry;

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

/** Set the .npmrc only when in a continuos integration environment */
export default async function setTokenOnCI(logger: ILogger) {
  if (!isCi) {
    return;
  }

  const { private: isPrivate } = await loadPackageJson();

  if (isPrivate && !isMonorepo()) {
    logger.verbose.info("NPM token not set for private package.");
    return;
  }

  const rc = path.join(userHome, ".npmrc");
  let contents = "";

  try {
    contents = (await readFile(rc)).toString();
  } catch (error) {
    // No ~/.npmrc set up
  }

  const registry = await getRegistry();

  logger.verbose.note(`Using ${registry} registry for package`);

  const url = registry.replace(/^https?:/, ``);
  // eslint-disable-next-line no-template-curly-in-string
  const authTokenString = urlJoin(url, ":_authToken=${NPM_TOKEN}");

  logger.verbose.info(`Will set authentication token string in ${rc}`);

  if (contents.indexOf(authTokenString) !== -1) {
    logger.verbose.success(`npmrc file, ${rc}, is already setup correctly`);
    return;
  }

  logger.verbose.info(
    `Writing authentication token string, ${authTokenString}, to ${rc}`
  );

  await writeFile(rc, `${contents}\n${authTokenString}`.trim());

  logger.log.success(`Wrote authentication token string to ${rc}`);
}
