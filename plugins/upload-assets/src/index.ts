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

const requiredPluginOptions = t.interface({
  /** Paths to assets to upload */
  assets: t.array(t.string),
});

const optionalPluginOptions = t.partial({
  /** Max number of assets to keep in the canary release */
  maxCanaryAssets: t.number,
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
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
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

        if (!prNumber) {
          return;
        }

        const assetList = assets
          .map((asset) => `[${asset.name}](${asset.browser_download_url})  `)
          .join("\n");

        await auto.git?.addToPrBody(
          endent`
            :baby_chick: Download canary assets:

            ${assetList}
          `,
          prNumber,
          "canary-assets"
        );
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

  /** Upload the configured asset to a release */
  private async uploadAssets(
    auto: Auto,
    release: Release | Release[],
    dryRun = false,
    id?: string
  ) {
    const assets = await glob(this.options.assets);

    auto.logger.log.info(endent`
      ${dryRun ? "Would upload" : "Uploading"}:

      ${assets.map((asset) => `  - ${asset}`).join("\n")}
    `);
    console.log("");

    if (dryRun) {
      return [];
    }

    const responses = await Promise.all(
      assets.map(async (asset) => {
        if (!auto.git) {
          return;
        }

        const file = await readFile(asset);
        const stats = await stat(asset);
        const type = await FileType.fromBuffer(file);

        const DEFAULT_BASE_URL = "https://api.github.com";
        const baseUrl = auto.git.options.baseUrl || DEFAULT_BASE_URL;
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
          owner: auto.git.options.owner,
          repo: auto.git.options.repo,
          headers: {
            "content-length": stats.size,
            "content-type": type ? type.mime : "application/octet-stream",
          },
        };

        if (baseUrl !== DEFAULT_BASE_URL) {
          const { origin } = new URL(baseUrl);
          options.baseUrl = `${origin}/api/uploads`;
        }

        const assetResponses: AssetResponse[] = [];

        // Multiple releases were made
        if (Array.isArray(release)) {
          await Promise.all(
            release.map(async (r) => {
              const {
                data: releaseAsset,
              } = await auto.git!.github.repos.uploadReleaseAsset({
                ...options,
                release_id: r.data.id,
              });

              assetResponses.push(releaseAsset);
            })
          );
        } else {
          const {
            data: releaseAsset,
          } = await auto.git.github.repos.uploadReleaseAsset({
            ...options,
            release_id: release.data.id,
          });

          assetResponses.push(releaseAsset);
        }

        auto.logger.log.success(`Uploaded asset: ${asset}`);
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
        tag: "canary",
      });

      return canaryRelease.data;
    } catch (error) {
      if (!create) {
        return;
      }

      const canaryRelease = await auto.git!.github.repos.createRelease({
        repo: auto.git!.options.repo,
        owner: auto.git!.options.owner,
        tag_name: "canary",
        name: "Canary Assets",
        prerelease: true,
        body: `This release contains preview assets of Pull Requests.`,
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
