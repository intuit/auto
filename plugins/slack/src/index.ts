import { githubToSlack } from "@atomist/slack-messages";
import { Octokit } from "@octokit/rest";

import {
  Auto,
  IPlugin,
  getCurrentBranch,
  InteractiveInit,
  validatePluginConfiguration,
} from "@auto-it/core";
import fetch from "node-fetch";
import * as t from "io-ts";

/** Transform markdown into slack friendly text */
const sanitizeMarkdown = (markdown: string) =>
  githubToSlack(markdown)
    .split("\n")
    .map((line) => {
      // Strip out the ### prefix and replace it with *<word>* to make it bold
      if (line.startsWith("#")) {
        return `*${line.replace(/^[#]+/, "")}*`;
      }

      return line;
    })
    .join("\n");

const pluginOptions = t.partial({
  /** URL of the slack to post to */
  url: t.string,
  /** Who to bother when posting to the channel */
  atTarget: t.string,
  /** Allow users to opt into having prereleases posted to slack */
  publishPreRelease: t.boolean,
});

export type ISlackPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Post your release notes to Slack during `auto release` */
export default class SlackPlugin implements IPlugin {
  /** The name of the plugin */
  name = "slack";

  /** The options of the plugin */
  readonly options: ISlackPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: ISlackPluginOptions | string = {}) {
    if (typeof options === "string") {
      this.options = { url: options, atTarget: "channel" };
    } else {
      this.options = {
        url: process.env.SLACK_WEBHOOK_URL || options.url || "",
        atTarget: options.atTarget ? options.atTarget : "channel",
        publishPreRelease: options.publishPreRelease
          ? options.publishPreRelease
          : false,
      };
    }
  }

  /** Custom initialization for this plugin */
  init(initializer: InteractiveInit) {
    initializer.hooks.createEnv.tapPromise(this.name, async (vars) => [
      ...vars,
      {
        variable: "SLACK_WEBHOOK_URL",
        message: "What is the root url of your slack hook? ()",
      },
    ]);
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.afterRelease.tapPromise(
      this.name,
      async ({ newVersion, commits, releaseNotes, response }) => {
        // Avoid publishing on prerelease branches by default, but allow folks to opt in if they care to
        const currentBranch = getCurrentBranch();
        if (
          currentBranch &&
          auto.config?.prereleaseBranches?.includes(currentBranch) &&
          !this.options.publishPreRelease
        ) {
          return;
        }

        if (!newVersion) {
          return;
        }

        const head = commits[0];

        if (!head) {
          return;
        }

        const skipReleaseLabels = (
          auto.config?.labels.filter((l) => l.releaseType === "skip") || []
        ).map((l) => l.name);
        const isSkipped = head.labels.find((label) =>
          skipReleaseLabels.includes(label)
        );

        if (isSkipped) {
          return;
        }

        if (!this.options.url) {
          throw new Error("Slack url must be set to post a message to slack.");
        }

        await this.postToSlack(
          auto,
          newVersion,
          releaseNotes,
          (Array.isArray(response) && response) ||
            (response && [response]) ||
            []
        );
      }
    );
  }

  /** Post the release notes to slack */
  async postToSlack(
    auto: Auto,
    newVersion: string,
    releaseNotes: string,
    releases: Array<Octokit.Response<Octokit.ReposCreateReleaseResponse>>
  ) {
    if (!auto.git) {
      return;
    }

    auto.logger.verbose.info("Posting release notes to slack.");

    const body = sanitizeMarkdown(releaseNotes);
    const token = process.env.SLACK_TOKEN;
    const atTarget = this.options.atTarget;
    const urls = releases.map(
      (release) => `*<${release.data.html_url}|${release.data.name}>*`
    );
    const releaseUrl = urls.length ? urls.join(", ") : newVersion;

    if (!token) {
      auto.logger.verbose.warn("Slack may need a token to send a message");
    }

    await fetch(`${this.options.url}${token ? `?token=${token}` : ""}`, {
      method: "POST",
      body: JSON.stringify({
        text: [`@${atTarget}: New release ${releaseUrl}`, body].join("\n"),
        link_names: 1,
      }),
      headers: { "Content-Type": "application/json" },
    });

    auto.logger.verbose.info("Posted release notes to slack.");
  }
}
