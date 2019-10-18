import { Auto, IPlugin } from '@auto-it/core';
import { Aws, Options } from 'aws-cli-js';

type File = [string, string];

export interface IUploadAssetsPluginOptions {
  bucket: string;
  region: string;
  overwrite?: boolean;
  files: File[];
}

type ConfigOptions = IUploadAssetsPluginOptions | IUploadAssetsPluginOptions[];

export default class S3Plugin implements IPlugin {
  name = 'S3';

  private readonly options: IUploadAssetsPluginOptions[];

  private readonly aws: Aws;

  constructor(options: ConfigOptions) {
    this.options = Array.isArray(options) ? options : [options];

    const awsOptions = new Options(
      process.env.AWS_ACCESS_KEY,
      process.env.AWS_SECRET_KEY,
      process.env.AWS_SESSION_TOKEN
    );

    this.aws = new Aws(awsOptions);
  }

  apply(auto: Auto) {
    auto.hooks.beforeRun.tap(this.name, () => {
      auto.checkEnv(this.name, 'AWS_ACCESS_KEY');
      auto.checkEnv(this.name, 'AWS_SECRET_KEY');
      auto.checkEnv(this.name, 'AWS_SESSION_TOKEN');
    });

    auto.hooks.afterRelease.tapPromise(this.name, async () => {
      await Promise.all(
        this.options.map(option => this.processBucket(auto, option))
      );
    });
  }

  private async exists(bucket: string, path: string): Promise<boolean> {
    return this.aws.command(`s3 ls s3://${bucket}/${path}`);
  }

  private async processBucket(auto: Auto, options: IUploadAssetsPluginOptions) {
    const { bucket, region, files, overwrite = true } = options;

    auto.logger.log.pending(
      `${this.name}: Syncing ${bucket} with:\n\n${JSON.stringify(
        files,
        undefined,
        2
      )}`
    );

    await Promise.all(
      options.files.map(async ([local, remote]) => {
        const shouldWrite = overwrite || !(await this.exists(bucket, remote));
        const url = `s3://${bucket}/${remote}`;

        if (!shouldWrite) {
          auto.logger.log.note(
            `${
              this.name
            }: ${local} not synced, already exists and "overwrite" is set to "false"`
          );
          return;
        }

        await this.aws.command(`s3 sync ${local} ${url} --region ${region}`);
        auto.logger.log.success(`${this.name}: Synced ${local} to "${url}"`);
      })
    );
  }
}
