import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import * as t from "io-ts";
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";
import endent from "endent";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt = [
  "Take the role of an experienced engineer with excellent ability to communicate technical concepts to a non-technical audience.",
  "Your job is to read the diffs, pull request descriptions, and commit descriptions I provide and produce a summary of the changes.",
  "Your summaries should be at max 6 sentences long and contain no references to coding.",
  "Try to also sell the feature like a marketer.",
  "Reply only with the summaries.",
];

const pluginOptions = t.partial({});

export type IAiReleaseNotesPluginOptions = t.TypeOf<typeof pluginOptions>;

/**  */
export default class AiReleaseNotesPlugin implements IPlugin {
  /** The name of the plugin */
  name = "ai-release-notes";

  /** The options of the plugin */
  readonly options: IAiReleaseNotesPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IAiReleaseNotesPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      // If it's a string thats valid config
      if (name === this.name && typeof options !== "string") {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.prCheck.tapPromise(this.name, async ({ pr, dryRun }) => {
      try {
        const diff = await fetch(pr.diff_url).then((res) => res.text());
        const body = pr.body?.split("<!-- GITHUB_RELEASE PR BODY")[0] || "";
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [...prompt, body, diff].map((content) => ({
            role: "user",
            content,
          })),
          temperature: 0,
          top_p: 1.0,
          n: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ["#", ";"],
        });
        const message = endent`
          ## Release Notes

          ${response.data.choices[0].message?.content}
        `;

        if (dryRun) {
          auto.logger.log.info("Would have posted the following comment:");
          auto.logger.log.info(message);
        } else {
          await auto.prBody({
            pr: pr.number,
            context: this.name,
            message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
}
