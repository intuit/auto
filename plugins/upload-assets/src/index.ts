import { Auto, IPlugin } from '@intuit-auto/core';
import fileType from 'file-type';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

interface IUploadAssetsPluginOptions {
  assets: string[];
}

export default class UploadAssetsPlugin implements IPlugin {
  name = 'Upload Assets';

  readonly options: IUploadAssetsPluginOptions;

  constructor(options: IUploadAssetsPluginOptions | string[]) {
    this.options = Array.isArray(options) ? { assets: options } : options;
  }

  apply(auto: Auto) {
    auto.hooks.afterRelease.tapPromise(this.name, async ({ response }) => {
      await Promise.all(
        this.options.assets.map(async asset => {
          if (!auto.git || !response) {
            return;
          }

          const file = await readFile(asset);
          const stats = await stat(asset);
          const type = fileType(file);

          await auto.git.ghub.repos.uploadReleaseAsset({
            url: response.data.upload_url,
            file,
            name: path.basename(asset),
            headers: {
              'content-length': stats.size,
              'content-type': type ? type.mime : 'application/octet-stream'
            }
          });
        })
      );
    });
  }
}
