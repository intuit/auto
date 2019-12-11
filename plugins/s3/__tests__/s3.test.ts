import Auto from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';

import S3, { IUploadAssetsPluginOptions } from '../src';

jest.mock('aws-cli-js');

describe('S3 Plugin', () => {
  test('should warn about keys', () => {
    const options: IUploadAssetsPluginOptions = {
      bucket: 'BUCKET_NAME',
      region: 'us-west-2',
      files: [['test-files', 'andrew-test']]
    };
    const plugin = new S3(options);
    const hooks = makeHooks();
    const checkEnv = jest.fn();

    plugin.apply({ checkEnv, hooks } as any);
    hooks.beforeRun.call({} as any);

    expect(checkEnv).toHaveBeenCalledTimes(3);
  });

  test('should accept a options object', () => {
    const options: IUploadAssetsPluginOptions = {
      bucket: 'BUCKET_NAME',
      region: 'us-west-2',
      files: [['test-files', 'andrew-test']]
    };
    const plugin = new S3(options);

    // @ts-ignore
    expect(plugin.options).toStrictEqual([options]);
  });

  test('should accept an array options objects', () => {
    const options: IUploadAssetsPluginOptions[] = [
      {
        bucket: 'BUCKET_NAME',
        region: 'us-west-2',
        files: [['test-files', 'andrew-test']]
      },
      {
        bucket: 'BUCKET_NAME',
        region: 'us-west-2',
        files: [[__dirname, 'andrew-test']]
      }
    ];
    const plugin = new S3(options);

    // @ts-ignore
    expect(plugin.options).toStrictEqual(options);
  });

  test('should try to write a file to s3 using aws CLI', async () => {
    process.env.AWS_ACCESS_KEY = 'AWS_ACCESS_KEY';
    process.env.AWS_SECRET_KEY = 'AWS_SECRET_KEY';
    process.env.AWS_SESSION_TOKEN = 'AWS_SESSION_TOKEN';

    const hooks = makeHooks();
    const plugin = new S3({
      bucket: 'BUCKET_NAME',
      region: 'REGION_NAME',
      files: [['test-files', 'andrew-test']]
    });

    plugin.apply({
      hooks,
      logger: dummyLog()
    } as Auto);

    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      lastRelease: '0.1.0',
      commits: [],
      releaseNotes: ''
    });

    // @ts-ignore
    expect(plugin.aws.command).toHaveBeenCalled();
  });

  test('should replace version', async () => {
    process.env.AWS_ACCESS_KEY = 'AWS_ACCESS_KEY';
    process.env.AWS_SECRET_KEY = 'AWS_SECRET_KEY';
    process.env.AWS_SESSION_TOKEN = 'AWS_SESSION_TOKEN';

    const hooks = makeHooks();
    const plugin = new S3({
      bucket: 'BUCKET_NAME',
      region: 'REGION_NAME',
      files: [['test-files', '$VERSION/andrew-test']]
    });

    plugin.apply({
      hooks,
      logger: dummyLog()
    } as Auto);

    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      lastRelease: '0.1.0',
      commits: [],
      releaseNotes: ''
    });

    // @ts-ignore
    expect(plugin.aws.command).toHaveBeenCalledWith(
      's3 sync test-files s3://BUCKET_NAME/1.0.0/andrew-test --region REGION_NAME'
    );
  });

  test('should not overwrite when "overwrite" is set to false', async () => {
    process.env.AWS_ACCESS_KEY = 'AWS_ACCESS_KEY';
    process.env.AWS_SECRET_KEY = 'AWS_SECRET_KEY';
    process.env.AWS_SESSION_TOKEN = 'AWS_SESSION_TOKEN';

    const hooks = makeHooks();
    const plugin = new S3({
      bucket: 'BUCKET_NAME',
      region: 'REGION_NAME',
      overwrite: false,
      files: [['test-files', 'andrew-test']]
    });

    plugin.apply({
      hooks,
      logger: dummyLog()
    } as Auto);

    // @ts-ignore
    plugin.aws.command.mockReturnValueOnce(true);

    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      lastRelease: '0.1.0',
      commits: [],
      releaseNotes: ''
    });

    // @ts-ignore
    expect(plugin.aws.command).toHaveBeenCalledTimes(1);
  });
});
