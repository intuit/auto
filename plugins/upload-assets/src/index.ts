import { Auto, IPlugin } from '@auto-it/core';
import endent from 'endent';
import FileType from 'file-type';
import fs from 'fs';
import glob from 'fast-glob';
import path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

interface IUploadAssetsPluginOptions {
  /** Paths to assets to upload */
  assets: string[];
}

/** Attach extra assets to a GitHub Release */
export default class UploadAssetsPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Upload Assets';

  /** The options of the plugin */
  readonly options: IUploadAssetsPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IUploadAssetsPluginOptions | string[]) {
    this.options = Array.isArray(options) ? { assets: options } : options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.afterRelease.tapPromise(this.name, async ({ response }) => {
      const assets = await glob(this.options.assets);

      auto.logger.log.info(endent`
        Uploading:

        ${assets.map(asset => `\t- ${asset}`).join('\n')}

      `);

      await Promise.all(
        assets.map(async asset => {
          if (!auto.git || !response) {
            return;
          }

          const file = await readFile(asset);
          const stats = await stat(asset);
          const type = await FileType.fromBuffer(file);

          await auto.git.github.repos.uploadReleaseAsset({
            url: response.data.upload_url,
            file,
            name: path.basename(asset),
            headers: {
              'content-length': stats.size,
              'content-type': type ? type.mime : 'application/octet-stream'
            }
          });
          auto.logger.log.success(`Uploaded asset: ${asset}`);
        })
      );
    });
  }
}
