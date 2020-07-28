import { Auto, execPromise } from "@auto-it/core";
import { IMavenPluginOptions } from "./index";

/** Update the pom with maven */
export async function updatePoms(
  version: string,
  options: IMavenPluginOptions,
  auto: Auto,
  message: string
) {
  auto.logger.verbose.info(
    `Using the versions-maven-plugin to set version = ${version}`
  );

  await execPromise("mvn", [
    "versions:set",
    "-DgenerateBackupPoms=false",
    `-DnewVersion=${version}`,
  ]);

  await execPromise("git", ["commit", "-am", message, "--no-verify"]);
}
