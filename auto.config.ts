import { AutoRc } from "./packages/core";

import { INpmConfig } from "./plugins/npm";
import { IBrewPluginOptions } from "./plugins/brew";
import { IGhPagesPluginOptions } from "./plugins/gh-pages";
import { IAllContributorsPluginOptions } from "./plugins/all-contributors";

/** Auto configuration */
export default function rc(): AutoRc {
  return {
    plugins: [
      [
        "upload-assets",
        [
          "./packages/cli/binary/auto-linux.gz",
          "./packages/cli/binary/auto-macos.gz",
          "./packages/cli/binary/auto-win.exe.gz",
        ],
      ],
      [
        "npm",
        {
          exact: true,
          canaryScope: "@auto-canary",
        } as INpmConfig,
      ],
      "released",
      "first-time-contributor",
      "pr-body-labels",
      "./scripts/auto-update-curl-version.js",
      [
        "all-contributors",
        {
          types: {
            plugin: "**/plugin/**/*",
            code: ["**/src/**/*", "**/package.json", "**/tsconfig.json"],
          },
        } as IAllContributorsPluginOptions,
      ],
      [
        "brew",
        {
          executable: "./packages/cli/binary/auto-macos.gz",
          name: "auto",
        } as IBrewPluginOptions,
      ],
      [
        "gh-pages",
        {
          buildCommand: "yarn docs:build",
          dir: "docs/out",
        } as IGhPagesPluginOptions,
      ],
    ],
    labels: [
      {
        name: "blog-post",
        changelogTitle: "📚 Blog Post",
        releaseType: "none",
      },
    ],
  };
}
