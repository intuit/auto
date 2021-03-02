import { RestEndpointMethodTypes } from "@octokit/rest";
import { githubToSlack } from "@atomist/slack-messages";
import createHttpsProxyAgent, { HttpsProxyAgent } from "https-proxy-agent";

import {
  Auto,
  IPlugin,
  getCurrentBranch,
  InteractiveInit,
  validatePluginConfiguration,
} from "@auto-it/core";
import fetch from "node-fetch";
import * as t from "io-ts";

type ReleaseResponse = RestEndpointMethodTypes["repos"]["createRelease"]["response"];

/** Transform markdown into slack friendly text */
export const sanitizeMarkdown = (markdown: string) =>
  githubToSlack(markdown)
    .split("\n")
    .map((line) => {
      // Give extra padding to nested lists
      if (line.match(/^\s+•/)) {
        return line.replace(/^\s+•/, "   •");
      }

      return line;
    })
    .join("\n");

/** Create slack context block */
const createContextBlock = (text: string) => ({
  type: "context" as const,
  elements: [
    {
      type: "mrkdwn",
      text,
    },
  ],
});

/** Create slack section block */
const createSectionBlock = (text: string) => ({
  type: "section" as const,
  text: {
    type: "mrkdwn",
    text,
  },
});

/** Create slack header block */
const createHeaderBlock = (text: string) => ({
  type: "header" as const,
  text: {
    type: "plain_text",
    text,
    emoji: true,
  },
});

/** Create slack divider block */
const createDividerBlock = () => ({
  type: "divider" as const,
});

interface FileUpload {
  /** special identifier to upload file */
  type: "file";
  /** the language the file is */
  language: string;
  /** the code in the file */
  code: string;
}

interface Block {
  /** Type of slack block */
  type: "header" | "divider" | "section" | "context";
  /** Blocks config */
  [params: string]: unknown;
}

type Messages = [Block[], ...Array<Block[] | FileUpload>];

/** Convert the sanitized markdown to slack blocks */
export function convertToBlocks(
  slackMarkdown: string,
  withFiles = false
): Messages {
  let currentMessage: Block[] = [];
  const messages: Messages = [currentMessage];

  const lineIterator = slackMarkdown.split("\n")[Symbol.iterator]();

  for (const line of lineIterator) {
    if (line.startsWith("#")) {
      currentMessage.push(createSectionBlock(`*${line.replace(/^[#]+/, "")}*`));
    } else if (line === "---") {
      currentMessage.push(createDividerBlock());
    } else if (line.startsWith("```")) {
      const [, language] = line.match(/```(\S+)/) || ["", "detect"];
      const lines: string[] = [];

      for (const codeBlockLine of lineIterator) {
        if (codeBlockLine.startsWith("```")) {
          break;
        }

        lines.push(codeBlockLine);
      }

      if (withFiles) {
        messages.push({
          type: "file",
          language,
          code: lines.join("\n"),
        });
        currentMessage = [];
        messages.push(currentMessage);
      } else {
        currentMessage.push(createSectionBlock(`\`${language}\`:\n\n`));
        currentMessage.push(
          createSectionBlock(`\`\`\`\n${lines.join("\n")}\n\`\`\``)
        );
      }
    } else if (line.startsWith("*Authors:")) {
      currentMessage.push(createDividerBlock());
      currentMessage.push(createContextBlock(line));

      for (const authorLine of lineIterator) {
        if (authorLine) {
          currentMessage.push(createContextBlock(authorLine));
        }
      }
    } else if (line) {
      currentMessage.push(createSectionBlock(line));
    }
  }

  return messages.filter(
    (m) => (Array.isArray(m) && m.length !== 0) || true
  ) as [Block[], ...Array<Block[] | FileUpload>];
}

const basePluginOptions = t.partial({
  /** URL of the slack to post to */
  url: t.string,
  /** Who to bother when posting to the channel */
  atTarget: t.string,
  /** Allow users to opt into having prereleases posted to slack */
  publishPreRelease: t.boolean,
  /** Additional Title to add at the start of the slack message */
  title: t.string,
});

const appPluginOptions = t.intersection([
  t.interface({
    /** Marks we are gonna use app auth */
    auth: t.literal("app"),
    /** Channels to post */
    channels: t.array(t.string),
  }),
  basePluginOptions,
]);

const pluginOptions = t.union([basePluginOptions, appPluginOptions]);

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
        ...options,
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

        if (!("auth" in this.options) && !this.options.url) {
          throw new Error(
            `${this.name} url must be set to post a message to ${this.name}.`
          );
        }

        const releases =
          (Array.isArray(response) && response) ||
          (response && [response]) ||
          [];
        const header = `New Release${
          releases.length > 1 ? "s" : ""
        }: ${releases.map((r) => r.data.tag_name).join(", ")}`;
        const proxyUrl = process.env.https_proxy || process.env.http_proxy;
        const agent = proxyUrl ? createHttpsProxyAgent(proxyUrl) : undefined;

        await this.createPost(
          auto,
          header,
          sanitizeMarkdown(releaseNotes),
          releases,
          agent
        );
      }
    );
  }

  /** Post the release notes to slack */
  // eslint-disable-next-line max-params
  async createPost(
    auto: Auto,
    header: string,
    releaseNotes: string,
    releases: ReleaseResponse[],
    agent: HttpsProxyAgent | undefined
  ) {
    if (!auto.git) {
      return;
    }

    auto.logger.verbose.info("Posting release notes to slack.");

    const token = process.env.SLACK_TOKEN;

    if (!token) {
      auto.logger.verbose.warn("Slack may need a token to send a message");
    }

    const messages = convertToBlocks(
      releaseNotes,
      "auth" in this.options && this.options.auth === "app"
    );
    const urls = releases.map(
      (release) =>
        `*<${release.data.html_url}|${
          release.data.name || release.data.tag_name
        }>*`
    );
    const releaseUrl =
      urls.length > 1
        ? urls.join(", ")
        : `<${releases[0].data.html_url}|View Release>`;

    // First add context to share link to release
    messages[0].unshift(
      createContextBlock(`@${this.options.atTarget} ${releaseUrl}`)
    );
    // At text only header
    messages[0].unshift(createHeaderBlock(header));

    // Add user context title
    if (this.options.title) {
      messages[0].unshift(createSectionBlock(this.options.title));
    }

    if ("auth" in this.options) {
      const channels = this.options.channels;

      await messages.reduce(async (last, message) => {
        await last;

        if (Array.isArray(message)) {
          await channels.reduce(async (lastMessage, channel) => {
            await lastMessage;
            await fetch("https://slack.com/api/chat.postMessage", {
              method: "POST",
              body: JSON.stringify({
                channel,
                blocks: message,
                link_names: true,
              }),
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${token}`,
              },
              agent,
            });
          }, Promise.resolve());
        } else {
          const languageMap: Record<string, string> = { md: "markdown" };

          await fetch("https://slack.com/api/files.upload", {
            method: "POST",
            body: new URLSearchParams({
              channels: channels.join(","),
              content: message.code,
              title: languageMap[message.language] || message.language,
              filetype: languageMap[message.language] || message.language,
            }) as any,
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=utf-8",
              Authorization: `Bearer ${token}`,
            },
            agent,
          });
        }
      }, Promise.resolve());
    } else {
      await fetch(`${this.options.url}${token ? `?token=${token}` : ""}`, {
        method: "POST",
        body: JSON.stringify({
          link_names: true,
          // If not in app auth only one message is constructed
          blocks: messages[0],
        }),
        headers: { "Content-Type": "application/json" },
        agent,
      });
    }

    auto.logger.verbose.info("Posted release notes to slack.");
  }
}
