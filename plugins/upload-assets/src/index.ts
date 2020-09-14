import { RestEndpointMethodTypes } from "@octokit/rest";
import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import endent from "endent";
import * as FileType from "file-type";
import fs from "fs";
import glob from "fast-glob";
import path from "path";
import { promisify } from "util";
import * as t from "io-ts";

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

const pluginOptions = t.interface({
  /** Paths to assets to upload */
  assets: t.array(t.string),
});

/** Convert shorthand options to noraml shape */
const normalizeOptions = (options: IUploadAssetsPluginOptions | string[]) =>
  Array.isArray(options) ? { assets: options } : options;

export type IUploadAssetsPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Attach extra assets to a GitHub Release */
export default class UploadAssetsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "upload-assets";

  /** The options of the plugin */
  readonly options: IUploadAssetsPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IUploadAssetsPluginOptions | string[]) {
    this.options = normalizeOptions(options);
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

    auto.hooks.afterRelease.tapPromise(this.name, async ({ response }) => {
      const assets = await glob(this.options.assets);

      auto.logger.log.info(endent`
        Uploading:

        ${assets.map((asset) => `\t- ${asset}`).join("\n")}

      `);

      await Promise.all(
        assets.map(async (asset) => {
          if (!auto.git || !response) {
            return;
          }

          const file = await readFile(asset);
          const stats = await stat(asset);
          const type = await FileType.fromBuffer(file);

          const DEFAULT_BASE_URL = "https://api.github.com";
          const baseUrl = auto.git.options.baseUrl || DEFAULT_BASE_URL;
          const options: RestEndpointMethodTypes['repos']['uploadReleaseAsset']['parameters'] = {
            // placeholder to appease typescript
            release_id: -1,
            data: (file as unknown) as string,
            name: path.basename(asset),
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

          // Multiple releases were made
          if (Array.isArray(response)) {
            await Promise.all(
              response.map((r) =>
                auto.git!.github.repos.uploadReleaseAsset({
                  ...options,
                  release_id: r.data.id,
                })
              )
            );
          } else {
            await auto.git.github.repos.uploadReleaseAsset({
              ...options,
              release_id: response.data.id,
            });
          }

          auto.logger.log.success(`Uploaded asset: ${asset}`);
        })
      );
    });
  }
}
