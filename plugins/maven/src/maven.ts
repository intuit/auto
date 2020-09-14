import { Auto, execPromise } from "@auto-it/core";
import { IMavenPluginOptions } from "./index";

const mavenDefaults = {
  mavenCommand: "/usr/bin/mvn",
  mavenOptions: [],
  mavenReleaseGoals: ["deploy", "site-deploy"],
};

/** executes a maven command with all the options */
async function executeMaven(options: IMavenPluginOptions, goals: string[]) {
  const settingsParams = [
    options?.mavenSettings ? `-s=${options.mavenSettings}` : "",
    options?.mavenUsername ? `-Dusername=${options.mavenUsername}` : "",
    options?.mavenPassword ? `-Dpassword=${options.mavenPassword}` : "",
  ];

  return execPromise(options.mavenCommand || mavenDefaults.mavenCommand, [
    ...(options.mavenOptions || mavenDefaults.mavenOptions),
    ...goals,
    ...settingsParams,
  ]);
}

/** execute the built in release goals */
export async function executeReleaseGoals(options: IMavenPluginOptions) {
  return executeMaven(
    options,
    options.mavenReleaseGoals || mavenDefaults.mavenReleaseGoals
  );
}

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

  await executeMaven(options, [
    "versions:set",
    "-DgenerateBackupPoms=false",
    `-DnewVersion=${version}`,
  ]);

  await execPromise("git", ["commit", "-am", message, "--no-verify"]);
}
