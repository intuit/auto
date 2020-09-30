import { Auto, IPlugin } from "@auto-it/core";

/** Allow outside contributors to indicate what semver label should be applied to the Pull Request */
export default class PrBodyLabelsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "pr-body-labels";

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.prCheck.tapPromise(this.name, async ({ pr }) => {
      if (!auto.git || !auto.labels) {
        return;
      }

      await Promise.all(
        auto.labels.map(async (label) => {
          if (pr.body.includes(`- [x] \`${label.name}\``)) {
            await auto.git?.addLabelToPr(pr.number, label.name);
          }
        })
      );
    });
  }
}
