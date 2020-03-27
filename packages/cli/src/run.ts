#!/usr/bin/env node

import Auto, {
  ApiOptions,
  ICanaryOptions,
  IChangelogOptions,
  ICommentOptions,
  ICreateLabelsOptions,
  ILabelOptions,
  IPRBodyOptions,
  IPRCheckOptions,
  IPRStatusOptions,
  IReleaseOptions,
  IShipItOptions,
  IVersionOptions,
  INextOptions,
} from "@auto-it/core";
import endent from "endent";
import on from "await-to-js";
import link from "terminal-link";

/** Spin up the "auto" node API and provide it the parsed CLI args. */
export async function run(command: string, args: ApiOptions) {
  const auto = new Auto(args);

  try {
    if (command === "init") {
      await auto.init();
      return;
    }

    await auto.loadConfig();

    if (args.verbose || command === "info") {
      try {
        // We don't want auto.info throwing an error during another
        // command
        const { hasError } = await auto.info();

        if (command === "info") {
          // eslint-disable-next-line max-depth
          if (hasError) {
            process.exit(1);
          } else {
            return;
          }
        }
      } catch (error) {
        if (command === "info") {
          process.exit(1);
        }
      }
    }

    switch (command) {
      case "create-labels":
        await auto.createLabels(args as ICreateLabelsOptions);
        break;
      case "label":
        await auto.label(args as ILabelOptions);
        break;
      case "pr-check":
        await auto.prCheck(args as IPRCheckOptions);
        break;
      case "pr-status":
        await auto.prStatus(args as IPRStatusOptions);
        break;
      case "comment":
        await auto.comment(args as ICommentOptions);
        break;
      case "pr-body":
        await auto.prBody(args as IPRBodyOptions);
        break;
      case "version":
        await auto.version(args as IVersionOptions);
        break;
      case "changelog":
        await auto.changelog(args as IChangelogOptions);
        break;
      case "release":
        await auto.runRelease(args as IReleaseOptions);
        break;
      case "shipit":
        await auto.shipit(args as IShipItOptions);
        break;
      case "latest":
        await auto.latest(args as IShipItOptions);
        break;
      case "canary":
        await auto.canary(args as ICanaryOptions);
        break;
      case "next":
        await auto.next(args as INextOptions);
        break;
      default:
        throw new Error(`idk what i'm doing.`);
    }
  } catch (error) {
    if (error.status === 404) {
      const [, project] = await on(auto.git!.getProject());
      const repoLink = link(
        `${auto.git?.options.owner}/${auto.git?.options.repo}`,
        project?.html_url || ""
      );

      auto.logger.log.error(endent`
        Received 404!

        This usually because the GitHub token you're using doesn't have the correct permissions to the repo.
        
        The token used with auto must have at least "write" permission to your repo (${repoLink}) to create releases and labels.

        You can check the permission for you token by running "auto info".
      `);
      console.log("");
      auto.logger.verbose.error(error.request);
    } else {
      console.log(error);
    }

    process.exit(1);
  }
}

/** Run "auto" for a given command. */
export default async function main(command: string, args: ApiOptions) {
  await run(command, args);
}
