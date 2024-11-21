import { RestEndpointMethodTypes } from "@octokit/rest";
import {
  Auto,
  getPrNumberFromEnv,
  IPlugin,
  validatePluginConfiguration,
} from "@auto-it/core";
import endent from "endent";
import * as FileType from "file-type";
import fs from "fs";
import glob from "fast-glob";
import path from "path";
import { promisify } from "util";
import link from "terminal-link";
import * as t from "io-ts";

type AssetResponse = RestEndpointMethodTypes["repos"]["uploadReleaseAsset"]["response"]["data"];
type GitHubRelease = RestEndpointMethodTypes["repos"]["getReleaseByTag"]["response"]["data"];

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const canaryTag = "0.0.0-canary";

const requiredPluginOptions = t.type({
  /** Paths to assets to upload */
  assets: t.array(t.string),
});

const optionalPluginOptions = t.partial({
  /** Max number of assets to keep in the canary release */
  maxCanaryAssets: t.number,
  /** Custom message for header in PR */
  headerMessage: t.string,
  /** Filter assets by regular expression */
  filter: t.string,
  /** Whether to comment on PRs made by bots */
  includeBotPrs: t.boolean,
  /** Group assets by regular expression */
  group: t.string,
  /** Compact view for PRs comment */
  compact: t.boolean,
});

const pluginOptions = t.intersection([
  requiredPluginOptions,
  optionalPluginOptions,
]);

/** Convert shorthand options to noraml shape */
const normalizeOptions = (options: IUploadAssetsPluginOptions | string[]) =>
  Array.isArray(options) ? { assets: options } : options;

export type IUploadAssetsPluginOptions = t.TypeOf<typeof pluginOptions>;

interface Release {
  /** The response data */
  data: {
    /** the release id */
    id: number;
  };
}

/** Attach extra assets to a GitHub Release */
export default class UploadAssetsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "upload-assets";

  /** The options of the plugin */
  readonly options: Required<IUploadAssetsPluginOptions>;

  /** Initialize the plugin with it's options */
  constructor(options: IUploadAssetsPluginOptions | string[]) {
    const normalizedOptions = normalizeOptions(options);
    this.options = {
      ...normalizedOptions,
      maxCanaryAssets: normalizedOptions.maxCanaryAssets || 300,
      headerMessage:
        normalizedOptions.headerMessage || ":baby_chick: Download canary assets:",
      filter: normalizedOptions.filter || "",
      includeBotPrs:
        normalizedOptions.includeBotPrs === undefined
          ? true
          : normalizedOptions.includeBotPrs,
      group: normalizedOptions.group || "",
      compact: normalizedOptions.compact || false,
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const headerMessage = this.options.headerMessage;
    const filter = this.options.filter;
    const includeBotPrs = this.options.includeBotPrs;
    const group = this.options.group;
    const compact = this.options.compact;

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(
          this.name,
          pluginOptions,
          normalizeOptions(options)
        );
      }
    });

    auto.hooks.canary.tapPromise(
      this.name,
      async ({ canaryIdentifier, dryRun }) => {
        const canaryRelease = await this.getCanaryGitHubRelease(auto, true);

        auto.logger.log.info(endent`${
          dryRun ? "Would update" : "Updating"
        } Canary Release:

          ${canaryRelease.html_url}
        `);

        const assets = await this.uploadAssets(
          auto,
          { data: canaryRelease },
          dryRun,
          canaryIdentifier
        );

        if (!assets.length) {
          return;
        }

        auto.logger.log.success(endent`
          Download canary assets:
          
          ${assets
            .map((asset) => link(asset.name, asset.browser_download_url))
            .join("  \n")}
        `);

        const prNumber = getPrNumberFromEnv();

        if (!prNumber || !includeBotPrs) {
          return;
        }

        const assetList = this.getFilteredList(assets, filter);
        const groupList = this.getGroupedList(assets, group);

        const message = compact
          ? this.getCompactPullRequestMessage(headerMessage, assetList, groupList)
          : this.getPullRequestMessage(headerMessage, assetList, groupList);

        await auto.git?.addToPrBody(message, prNumber, "canary-assets");
      }
    );

    auto.hooks.afterRelease.tapPromise(this.name, async ({ response }) => {
      if (!response) {
        return;
      }

      await this.uploadAssets(auto, response);
      await this.cleanupCanaryAssets(auto);
    });
  }

  // prettier-ignore
  /** Get link list by type */
  private getLinkList(assets: AssetResponse[], type: "html" | "markdown"): string {
    /**  Get Markdown link  */
    const getMarkdownLink = (asset: AssetResponse) =>
      `[${asset.name}](${asset.browser_download_url})`;

    /** Get HTML link */
    const getHTMLLink = (asset: AssetResponse) =>
      `<a href='${asset.browser_download_url}'>${asset.name}</a><br>`;

    return assets
      .map(type === "html" ? getHTMLLink : getMarkdownLink)
      .join("\n");
  }

  // prettier-ignore
  /** Get asset list by filter */
  private getFilteredList(assets: AssetResponse[], filter: string): AssetResponse[] {
    if (!filter) {
      return assets;
    }
    
    const regexp = new RegExp(filter, "mi");
    return assets.filter(({ name }) => regexp.test(name));
  }

  // prettier-ignore
  /** Get asset list by group */
  private getGroupedList(assets: AssetResponse[], group: string): Record<string, AssetResponse[]> | undefined {
    if (!group) {
      return;
    }

    const regexp = new RegExp(group, "mi");

    return assets.reduce(
      (groupList: Record<string, AssetResponse[]>, asset) => {
        const name = (regexp.exec(asset.name) || [])[1];

        if (groupList[name]) {
          groupList[name].push(asset);
        } else {
          groupList[name] = [asset];
        }

        return groupList;
      },
      {}
    );
  }

  /** Get pull request message */
  private getPullRequestMessage(
    message: string,
    assetList: AssetResponse[],
    groupList?: Record<string, AssetResponse[]>
  ): string {
    /** Get grouped link list */
    const getGroupedLinkList = (groupList: Record<string, AssetResponse[]>) =>
      Object.entries(groupList)
        .map(
          ([group, assets]) =>
            endent`
                ### ${group}
                ${this.getLinkList(assets, "markdown")}`
        )
        .join("\n");

    return endent`
        ${message}
  
        ${
          groupList
            ? getGroupedLinkList(groupList)
            : this.getLinkList(assetList, "markdown")
        }
      `;
  }

  /** Get compact pull request message */
  private getCompactPullRequestMessage(
    message: string,
    assetList: AssetResponse[],
    groupList?: Record<string, AssetResponse[]>
  ): string {
    /** Get grouped link list */
    const getGroupedLinkList = (groupList: Record<string, AssetResponse[]>) =>
      Object.entries(groupList)
        .map(
          ([group, assets]) => endent`
          <details>
            <summary>${group}</summary>
            <blockquote>
              ${this.getLinkList(assets, "html")}
            </blockquote>
          </details>`
        )
        .join("\n");

    return endent`
      <details>
        <summary>${message}</summary>
        <blockquote>
          ${
            groupList
              ? getGroupedLinkList(groupList)
              : this.getLinkList(assetList, "html")
          }
        </blockquote>
      </details>
    `;
  }

  /** Upload the configured asset to a release */
  private async uploadAssets(
    auto: Auto,
    release: Release | Release[],
    dryRun = false,
    id?: string
  ) {
    const releases = Array.isArray(release) ? release : [release];
    const assets = await glob(this.options.assets);

    auto.logger.log.info(endent`
      ${dryRun ? "Would upload" : "Uploading"}:

      ${assets.map((asset) => `  - ${asset}`).join("\n")}
    `);
    console.log("");

    if (dryRun) {
      return [];
    }

    const assetUploadRequests = await Promise.all(
      assets.map(async (asset) => {
        const file = await readFile(asset);
        const stats = await stat(asset);
        const type = await FileType.fromBuffer(file);

        const DEFAULT_BASE_URL = "https://api.github.com";
        const baseUrl = auto.git!.options.baseUrl || DEFAULT_BASE_URL;
        const fileName = path.basename(asset);
        const extension = path.extname(fileName);
        const options: RestEndpointMethodTypes["repos"]["uploadReleaseAsset"]["parameters"] = {
          // placeholder to appease typescript
          release_id: -1,
          data: (file as unknown) as string,
          name: id
            ? extension
              ? fileName.replace(extension, `-${id}${extension}`)
              : `${fileName}-${id}`
            : fileName,
          owner: auto.git!.options.owner,
          repo: auto.git!.options.repo,
          headers: {
            "content-length": stats.size,
            "content-type": type ? type.mime : "application/octet-stream",
          },
        };

        if (baseUrl !== DEFAULT_BASE_URL) {
          const { origin } = new URL(baseUrl);
          options.baseUrl = `${origin}/api/uploads`;
        }

        return options;
      })
    );

    const assetNames = assetUploadRequests.map((o) => o.name);
    await Promise.all(
      releases.map(async (release) => {
        const assetsInRelease = await auto.git!.github.paginate(
          auto.git!.github.repos.listReleaseAssets,
          {
            owner: auto.git!.options.owner,
            repo: auto.git!.options.repo,
            release_id: release.data.id,
          }
        );

        for (const asset of assetsInRelease) {
          if (assetNames.includes(asset.name)) {
            // eslint-disable-next-line no-await-in-loop
            await auto.git!.github.repos.deleteReleaseAsset({
              owner: auto.git!.options.owner,
              repo: auto.git!.options.repo,
              asset_id: asset.id,
            });
          }
        }
      })
    );

    const responses = await Promise.all(
      assetUploadRequests.map(async (options) => {
        const assetResponses: AssetResponse[] = [];

        await Promise.all(
          releases.map(async (r) => {
            const {
              data: releaseAsset,
            } = await auto.git!.github.repos.uploadReleaseAsset({
              ...options,
              release_id: r.data.id,
            });

            assetResponses.push(releaseAsset);
          })
        );

        auto.logger.log.success(`Uploaded asset: ${options.name}`);
        return assetResponses;
      })
    );

    return responses
      .filter((r): r is AssetResponse[] => Boolean(r))
      .reduce((acc, item) => [...acc, ...item], []);
  }

  // prettier-ignore
  private async getCanaryGitHubRelease(auto: Auto): Promise<GitHubRelease | undefined>
  // prettier-ignore
  private async getCanaryGitHubRelease(auto: Auto, create: true): Promise<GitHubRelease>
  // prettier-ignore
  /** Get the release all the canaries are stored in */
  private async getCanaryGitHubRelease(auto: Auto, create = false): Promise<GitHubRelease | undefined> {
    try {
      const canaryRelease = await auto.git!.github.repos.getReleaseByTag({
        repo: auto.git!.options.repo,
        owner: auto.git!.options.owner,
        tag: auto.prefixRelease(canaryTag),
      });

      return canaryRelease.data;
    } catch (error) {
      if (!create) {
        return;
      }

      const canaryRelease = await auto.git!.github.repos.createRelease({
        repo: auto.git!.options.repo,
        owner: auto.git!.options.owner,
        tag_name:  auto.prefixRelease(canaryTag),
        name: "Canary Assets",
        prerelease: true,
        body: `This release contains preview assets of Pull Requests.`,
        target_commitish: await auto.git?.getFirstCommit()
      });

      return canaryRelease.data;
    }
  }

  /** Delete old canary asset */
  private async cleanupCanaryAssets(auto: Auto) {
    const canaryRelease = await this.getCanaryGitHubRelease(auto);

    if (!canaryRelease) {
      return;
    }

    const canaryReleaseAssets = await auto.git!.github.paginate(
      auto.git!.github.repos.listReleaseAssets,
      {
        repo: auto.git!.options.repo,
        owner: auto.git!.options.owner,
        release_id: canaryRelease.id,
      }
    );
    const assetsToDelete = canaryReleaseAssets
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .slice(0, canaryReleaseAssets.length - this.options.maxCanaryAssets);

    if (!assetsToDelete.length) {
      return;
    }

    auto.logger.log.info(endent`
      Deleting old canary assets:

      ${assetsToDelete.map((asset) => `  - ${asset}`).join("\n")}
    `);

    await Promise.all(
      assetsToDelete.map(async (assetToDelete) => {
        await auto.git!.github.repos.deleteReleaseAsset({
          repo: auto.git!.options.repo,
          owner: auto.git!.options.owner,
          release_id: canaryRelease.id,
          asset_id: assetToDelete.id,
        });
      })
    );
  }
}
