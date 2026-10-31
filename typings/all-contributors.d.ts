/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "all-contributors-cli/dist/contributors" {
  export function addContributor(
    config: any,
    username: string,
    newContributions: string
  ): Promise<{
    /** The updated contributors */
    contributors: any;
  }>;
}

declare module "all-contributors-cli/dist/generate" {
  export function generate(
    config: any,
    contributors: any,
    readMe: string
  ): string;
}
