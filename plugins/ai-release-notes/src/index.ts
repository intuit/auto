import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import * as t from "io-ts";
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt = [
  "Take the role of an experienced engineer with excellent ability to communicate technical concepts to a non-technical audience.",
  "Your job is to read the diffs, pull request descriptions, and commit descriptions I provide and produce a summary of the changes.",
  "The summary should be targeted at consumer of the changed code.",
  "Your summaries should be at max 6 sentences long and contain no references to coding.",
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

    auto.hooks.prCheck.tapPromise(this.name, async ({ pr }) => {
      const diff = await fetch(pr.patch_url).then((res) => res.text());
      const body = pr.body?.split("<!-- GITHUB_RELEASE PR BODY")[0];
      const response = await openai.createCompletion({
        model: "gpt-4-32k",
        prompt: [...prompt, body, diff],
        max_tokens: 7,
        temperature: 0,
      });

      console.log(response);
    });
  }
}
