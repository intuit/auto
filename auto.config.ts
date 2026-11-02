import type { AutoRc } from "./packages/core";

import type { INpmConfig } from "./plugins/npm";
import type { IBrewPluginOptions } from "./plugins/brew";
// import { IGhPagesPluginOptions } from "./plugins/gh-pages";
import type { IAllContributorsPluginOptions } from "./plugins/all-contributors";

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
    // Loaded by path so the root needs no workspace links to them. Canary
    // releases rename the packages, which breaks those links.
    plugins: [
      [
        "./plugins/protected-branch",
        {
          releaseTemporaryBranchPrefix: "protected-release-",
          requiredStatusChecks: ["WIP", "build", "test", "lint"],
        },
      ],
      [
        "./plugins/upload-assets",
        [
          "./packages/cli/binary/auto-linux.gz",
          "./packages/cli/binary/auto-macos.gz",
          "./packages/cli/binary/auto-win.exe.gz",
        ],
      ],
      ["./plugins/npm", npmOptions],
      "./plugins/released",
      "./plugins/first-time-contributor",
      "./plugins/pr-body-labels",
      "./scripts/auto-update-curl-version.js",
      ["./plugins/all-contributors", allContributorsOptions],
      ["./plugins/brew", brewOptions],
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
