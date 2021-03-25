import { jsesc } from "jsesc";
import createHttpsProxyAgent, { HttpsProxyAgent } from "https-proxy-agent";

import {
  Auto,
  InteractiveInit,
  validatePluginConfiguration,
  getCurrentBranch,
} from "@auto-it/core";
import fetch from "node-fetch";
import * as t from "io-ts";

/** Microsoft Teams accepts markdown, as long as the content was escaped/serialized to a JSON string first  */
export const sanitizeMarkdown = (markdown: string) => jsesc(markdown);

const pluginOptions = t.partial({
  /** URL of the mircosoft teams to post to */
  url: t.string,
  /** Who to bother when posting to the channel */
  atTarget: t.string,
  /** Allow users to opt into having prereleases posted to mircosoft teams */
  publishPreRelease: t.boolean,
  /** Additional Title to add at the start of the mircosoft teams message */
  title: t.string,
});

export type IMicrosoftTeamsPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Post your release notes to Slack during `auto release` */
export default class MicrosoftTeamsPlugin {
  /** The name of the plugin */
  name = "microsoft-teams";

  /** The options of the plugin */
  readonly options: IMicrosoftTeamsPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IMicrosoftTeamsPluginOptions | string = {}) {
    if (typeof options === "string") {
      this.options = { url: options, atTarget: "channel" };
    } else {
      this.options = {
        ...options,
        url: process.env.MICROSOFT_TEAMS_WEBHOOK_URL || options.url || "",
        atTarget: options.atTarget,
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
        variable: "MICROSOFT_TEAMS_WEBHOOK_URL",
        message: "What is the root url of your microsoft teams hook? ()",
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
          throw new Error(
            `${this.name} url must be set to post a message to ${this.name}.`
          );
        }

        const releases =
          (Array.isArray(response) && response) ||
          (response && [response]) ||
          [];
        const urls = releases.map(
          (release) =>
            `*<${release.data.html_url}|${
              release.data.name || release.data.tag_name
            }>*`
        );
        const releaseUrl = urls.length ? urls.join(", ") : newVersion;
        const proxyUrl = process.env.https_proxy || process.env.http_proxy;
        const agent = proxyUrl ? createHttpsProxyAgent(proxyUrl) : undefined;

        await this.createPost(
          auto,
          sanitizeMarkdown(releaseNotes),
          releaseUrl,
          agent
        );
      }
    );
  }

  /** Post the release notes to slack */
  async createPost(
    auto: Auto,
    releaseNotes: string,
    releaseUrl: string,
    agent: HttpsProxyAgent | undefined
  ) {
    if (!auto.git) {
      return;
    }

    auto.logger.verbose.info("Posting release notes to microsoft teams.");

    // @mentions don't work in teams - yet
    // https://microsoftteams.uservoice.com/forums/555103-public/suggestions/17153099-webhook-needs-to-support-forced-notification-a-la
    // const atTarget = this.options.atTarget ? `@${this.options.atTarget}: ` : "";

    await fetch(`${this.options.url}`, {
      method: "POST",
      body: JSON.stringify({
        "@context": "http://schema.org/extensions",
        "@type": "MessageCard",
        text: releaseNotes,
        potentialAction: [
          {
            "@type": "OpenUri",
            name: "Learn More",
            targets: [
              {
                os: "default",
                uri: releaseUrl,
              },
            ],
          },
        ],
      }),
      headers: { "Content-Type": "application/json" },
      agent,
    });

    auto.logger.verbose.info("Posted release notes to microsoft teams.");
  }
}
