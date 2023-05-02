import { AutoRc } from "./packages/core";

import { INpmConfig } from "./plugins/npm";
import { IBrewPluginOptions } from "./plugins/brew";
// import { IGhPagesPluginOptions } from "./plugins/gh-pages";
import { IAllContributorsPluginOptions } from "./plugins/all-contributors";

const npmOptions: INpmConfig = {
  exact: true,
  canaryScope: "@auto-canary",
};

const allContributorsOptions: IAllContributorsPluginOptions = {
  types: {
    plugin: "**/plugin/**/*",
    code: ["**/src/**/*", "**/package.json", "**/tsconfig.json"],
  },
};

const brewOptions: IBrewPluginOptions = {
  executable: "./packages/cli/binary/auto-macos.gz",
  name: "auto",
};

/** Auto configuration */
export default function rc(): AutoRc {
  return {
    plugins: [
      [
        "protected-branch",
        {
          releaseTemporaryBranchPrefix: "protected-release-",
          requiredStatusChecks: ["WIP", "build", "test", "lint"],
        },
      ],
      [
        "upload-assets",
        [
          "./packages/cli/binary/auto-linux.gz",
          "./packages/cli/binary/auto-macos.gz",
          "./packages/cli/binary/auto-win.exe.gz",
        ],
      ],
      ["npm", npmOptions],
      "released",
      "first-time-contributor",
      "pr-body-labels",
      "./scripts/auto-update-curl-version.js",
      ["all-contributors", allContributorsOptions],
      ["brew", brewOptions],
      "ai-release-notes",
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
