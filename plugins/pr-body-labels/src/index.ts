import { Auto, IPlugin } from "@auto-it/core";
import * as t from "io-ts";

const pluginOptions = t.partial({
  /** Labels the user cannot apply through the PR */
  disabledLabels: t.array(t.string),
  /** Remove labels that are no longer checked from the PR. */
  removeStaleLabels: t.boolean,
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
      removeStaleLabels: options.removeStaleLabels ?? true,
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
          const hasUnchecked = pr.body?.includes(`- [ ] \`${label.name}\``);
          const hasCheckedLabel =
            pr.body?.includes(`- [x] \`${label.name}\``) ||
            pr.body?.includes(`- [X] \`${label.name}\``);

          if (
            hasCheckedLabel &&
            !this.options.disabledLabels.includes(label.name)
          ) {
            await auto.git?.addLabelToPr(pr.number, label.name);
          }

          if (hasUnchecked && this.options.removeStaleLabels) {
            await auto.git?.removeLabel(pr.number, label.name);
          }
        })
      );
    });
  }
}
