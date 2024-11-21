import { RestEndpointMethodTypes } from "@octokit/rest";
import { githubToSlack, url } from "@atomist/slack-messages";
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

/** Create some space in the message */
const createSpacerBlock = () => ({
  type: "section" as const,
  text: {
    type: "mrkdwn",
    text: " ",
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

const CHANGELOG_LINE = /^\s*•/;
type Messages = [Block[], ...Array<Block[] | FileUpload>];

/** Split a long string into chunks by character limit */
const splitCharacterLimitAtNewline = (line: string, charLimit: number) => {
  const splitLines = [];
  let buffer = line;

  while (buffer) {
    // get the \n closest to the char limit
    const newlineIndex = buffer.indexOf("\n", charLimit);
    const endOfLine = newlineIndex >= 0 ? newlineIndex : charLimit;
    splitLines.push(buffer.slice(0, endOfLine));
    buffer = buffer.slice(endOfLine);
  }

  return splitLines;
};

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
      currentMessage.push(createSpacerBlock());
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
      const authorLines: string[] = [];

      for (const authorLine of lineIterator) {
        if (authorLine) {
          authorLines.push(authorLine);
        }
      }

      currentMessage.push(createContextBlock(authorLines.join("\n")));
    } else if (line.match(CHANGELOG_LINE)) {
      const lines: string[] = [line];

      for (const changelogLine of lineIterator) {
        if (!changelogLine.match(CHANGELOG_LINE)) {
          break;
        }

        lines.push(changelogLine);
      }

      const fullSection = lines.join("\n");

      if (fullSection.length > 3000) {
        const splitLines = splitCharacterLimitAtNewline(fullSection, 3000);

        splitLines.forEach((splitLine) => {
          currentMessage.push(createSectionBlock(splitLine));
        });
      } else {
        currentMessage.push(createSectionBlock(fullSection));
      }

      currentMessage.push(createSpacerBlock());
    } else if (line.length > 3000) {
      const splitLines = splitCharacterLimitAtNewline(line, 3000);

      splitLines.forEach((splitLine) => {
        currentMessage.push(createSectionBlock(splitLine));
      });
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
  atTarget: t.union([t.string, t.boolean]),
  /** Allow users to opt into having prereleases posted to slack */
  publishPreRelease: t.boolean,
  /** Additional Title to add at the start of the slack message */
  title: t.string,
  /** Username to post the message as */
  username: t.string,
  /** Image url to use as the message's avatar */
  iconUrl: t.string,
  /** Emoji code to use as the message's avatar */
  iconEmoji: t.string,
});

const urlPluginOptions = t.intersection([
  t.partial({
    /** Channels to post */
    channel: t.string,
  }),
  basePluginOptions,
]);

const messageFilterOptions = t.partial({
  filter: t.partial({
    /** Only post when these packages are changed */
    packages: t.array(t.string),
    /** Only post when these strings are found */
    search: t.array(t.string),
  }),
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

const pluginOptions = t.intersection([
  t.union([urlPluginOptions, appPluginOptions]),
  messageFilterOptions,
]);

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
        atTarget: options.atTarget ?? "channel",
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

        const sanitizedNotes = sanitizeMarkdown(releaseNotes);

        if (
          this.options.filter?.packages &&
          !this.options.filter.packages.some((p) => releaseNotes.includes(p))
        ) {
          return;
        }

        // Only post if the search strings match the filter
        if (
          this.options.filter?.search &&
          !this.options.filter.search.some((p) => releaseNotes.includes(p))
        ) {
          return;
        }

        await this.createPost(auto, header, sanitizedNotes, releases, agent);
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
        `*${url(
          release.data.html_url,
          release.data.name || release.data.tag_name
        )}*`
    );
    const releaseUrl =
      urls.length > 1
        ? urls.join(", ")
        : `${url(releases[0].data.html_url, "View Release")}`;

    const atTargetTxt = this.options.atTarget
      ? `@${this.options.atTarget} ${releaseUrl}`
      : `${releaseUrl}`;

    // First add context to share link to release
    messages[0].unshift(createContextBlock(atTargetTxt));
    // At text only header
    messages[0].unshift(createHeaderBlock(header));

    // Add user context title
    if (this.options.title) {
      messages[0].unshift(createSectionBlock(this.options.title));
    }

    const userPostMessageOptions: Record<string, string> = {};

    if (this.options.username) {
      userPostMessageOptions.username = this.options.username;
    }

    if (this.options.iconUrl) {
      userPostMessageOptions.icon_url = this.options.iconUrl;
    } else if (this.options.iconEmoji) {
      userPostMessageOptions.icon_emoji = this.options.iconEmoji;
    }

    if ("auth" in this.options) {
      const channels = this.options.channels;

      await messages.reduce(async (last, message) => {
        await last;

        if (Array.isArray(message)) {
          await channels.reduce(async (lastMessage, channel, index) => {
            await lastMessage;
            await fetch("https://slack.com/api/chat.postMessage", {
              method: "POST",
              body: JSON.stringify({
                ...userPostMessageOptions,
                channel,
                text: index === 0 ? `${header} :tada:` : undefined,
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
          ...userPostMessageOptions,
          link_names: true,
          // If not in app auth only one message is constructed
          blocks: messages[0],
          channel: this.options.channel,
        }),
        headers: { "Content-Type": "application/json" },
        agent,
      });
    }

    auto.logger.verbose.info("Posted release notes to slack.");
  }
}
