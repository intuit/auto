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
  executable: "./packages/cli/binary/auto-macos-x64.gz",
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
          "./packages/cli/binary/auto-linux-x64.gz",
          "./packages/cli/binary/auto-macos-x64.gz",
          "./packages/cli/binary/auto-macos-arm64.gz",
          "./packages/cli/binary/auto-win-x64.exe.gz",
        ],
      ],
      ["npm", npmOptions],
      "released",
      "first-time-contributor",
      "pr-body-labels",
      "./scripts/auto-update-curl-version.js",
      ["all-contributors", allContributorsOptions],
      ["brew", brewOptions],
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
