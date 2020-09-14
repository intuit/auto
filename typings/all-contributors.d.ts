/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "all-contributors-cli/dist/contributors" {
  function addContributor(
    config: any,
    username: string,
    newContributions: string
  ): Promise<{
    /** The updated contributors */
    contributors: any;
  }>;

  export = addContributor;
}

declare module "all-contributors-cli/dist/generate" {
  function generateReadme(
    config: any,
    contributors: any,
    readMe: string
  ): Promise<string>;

  export = generateReadme;
}
