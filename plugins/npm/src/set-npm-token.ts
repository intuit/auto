import { ILogger } from "@auto-it/core";
import envCi from "env-ci";
import path from "path";
import registryUrl from "registry-url";
import urlJoin from "url-join";
import userHome from "user-home";

import { loadPackageJson, readFile, writeFile } from "./utils";

const { isCi } = envCi();

/** Set the .npmrc only when in a continuos integration environment */
export default async function setTokenOnCI(logger: ILogger) {
  if (!isCi) {
    return;
  }

  const { publishConfig = {}, name } = await loadPackageJson();
  const rc = path.join(userHome, ".npmrc");
  let contents = "";

  try {
    contents = (await readFile(rc)).toString();
  } catch (error) {
    // No ~/.npmrc set up
  }

  let registry;

  if (publishConfig.registry) {
    registry = publishConfig.registry;
  } else if (name?.startsWith("@")) {
    const scope = name.split(`/`)[0];
    registry = registryUrl(scope);
  } else {
    registry = registryUrl();
  }

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
