import { HttpsProxyAgent } from "https-proxy-agent";

import { Auto, InteractiveInit } from "@auto-it/core";
import SlackPlugin, { ISlackPluginOptions } from "@auto-it/slack";
import fetch from "node-fetch";

/** Post your release notes to Slack during `auto release` */
export default class MicrosoftTeamsPlugin extends SlackPlugin {
  /** The name of the plugin */
  name = "microsoft-teams";

  /** Initialize the plugin with it's options */
  constructor(options: ISlackPluginOptions | string = {}) {
    super(
      typeof options === "string"
        ? options
        : {
            ...options,
            url: process.env.MICROSOFT_TEAMS_WEBHOOK_URL || options.url || "",
          }
    );
  }

  /** Custom initialization for this plugin */
  init(initializer: InteractiveInit) {
    initializer.hooks.createEnv.tapPromise(this.name, async (vars) => [
      ...vars,
      {
        variable: "MICROSOFT_TEAMS_WEBHOOK_URL",
        message: "What is the root url of your slack hook? ()",
      },
    ]);
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

    const atTarget = this.options.atTarget ? `@${this.options.atTarget}: ` : "";

    await fetch(`${this.options.url}`, {
      method: "POST",
      body: JSON.stringify({
        "@context": "http://schema.org/extensions",
        "@type": "MessageCard",
        text: [`${atTarget}New release ${releaseUrl}`, releaseNotes].join("\n"),
      }),
      headers: { "Content-Type": "application/json" },
      agent,
    });

    auto.logger.verbose.info("Posted release notes to microsoft teams.");
  }
}
