import { Auto, IPlugin } from '@auto-it/core';
import { Aws, Options } from 'aws-cli-js';

type File = [string, string];

export interface IUploadAssetsPluginOptions {
  /** S3 bucket to post the asset to */
  bucket: string;
  /** S3 Region to post the asset to */
  region: string;
  /** Whether this plugin should overwrite files on S3 */
  overwrite?: boolean;
  /** Paths to the files to upload to S3 */
  files: File[];
}

type ConfigOptions = IUploadAssetsPluginOptions | IUploadAssetsPluginOptions[];

/** Post your built artifacts to s3 during `auto release` */
export default class S3Plugin implements IPlugin {
  /** The name of the plugin */
  name = 'S3';

  /** The options of the plugin */
  private readonly options: IUploadAssetsPluginOptions[];

  /** A client to communicate with AWS */
  private readonly aws: Aws;

  /** Initialize the plugin with it's options */
  constructor(options: ConfigOptions) {
    this.options = Array.isArray(options) ? options : [options];

    const awsOptions = new Options(
      process.env.AWS_ACCESS_KEY,
      process.env.AWS_SECRET_KEY,
      process.env.AWS_SESSION_TOKEN
    );

    this.aws = new Aws(awsOptions);
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.beforeRun.tap(this.name, () => {
      auto.checkEnv(this.name, 'AWS_ACCESS_KEY');
      auto.checkEnv(this.name, 'AWS_SECRET_KEY');
      auto.checkEnv(this.name, 'AWS_SESSION_TOKEN');
    });

    auto.hooks.afterRelease.tapPromise(this.name, async ({ newVersion }) => {
      await Promise.all(
        this.options.map(option => this.processBucket(auto, newVersion, option))
      );
    });
  }

  /** Check if a path exists in an AWS bucket */
  private async exists(bucket: string, path: string): Promise<boolean> {
    return this.aws.command(`s3 ls s3://${bucket}/${path}`);
  }

  /** Upload files to a bucket */
  private async processBucket(
    auto: Auto,
    newVersion = '',
    options: IUploadAssetsPluginOptions
  ) {
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
        const url = `s3://${bucket}/${remote}`.replace(
          /\$VERSION/g,
          newVersion
        );

        if (!shouldWrite) {
          auto.logger.log.note(
            `${this.name}: ${local} not synced, already exists and "overwrite" is set to "false"`
          );
          return;
        }

        await this.aws.command(`s3 sync ${local} ${url} --region ${region}`);
        auto.logger.log.success(`${this.name}: Synced ${local} to "${url}"`);
      })
    );
  }
}
