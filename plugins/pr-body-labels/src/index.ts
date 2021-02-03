import { Auto, IPlugin } from "@auto-it/core";
import * as t from "io-ts";

const pluginOptions = t.partial({
  /** Labels the user cannot apply through the PR */
  disabledLabels: t.array(t.string),
});

export type IPrBodyLabelsPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Allow outside contributors to indicate what semver label should be applied to the Pull Request */
export default class PrBodyLabelsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "pr-body-labels";

  /** The options of the plugin */
  private readonly options: Required<IPrBodyLabelsPluginOptions>;

  /** Initialize the plugin with it's options */
  constructor(options: IPrBodyLabelsPluginOptions = {}) {
    this.options = {
      disabledLabels: options.disabledLabels || [],
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.prCheck.tapPromise(this.name, async ({ pr }) => {
      if (!auto.git || !auto.labels) {
        return;
      }

      await Promise.all(
        auto.labels.map(async (label) => {
          if (
            pr.body?.includes(`- [x] \`${label.name}\``) &&
            !this.options.disabledLabels.includes(label.name)
          ) {
            await auto.git?.addLabelToPr(pr.number, label.name);
          }
        })
      );
    });
  }
}
