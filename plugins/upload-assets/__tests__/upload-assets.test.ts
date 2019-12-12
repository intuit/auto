import Auto from '@auto-it/core';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import { ReposCreateReleaseResponse, Response } from '@octokit/rest';
import path from 'path';

import { dummyLog } from '@auto-it/core/dist/utils/logger';
import UploadAssets from '../src';

describe('Upload Assets Plugin', () => {
  test('should do nothing without a response', async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, './test-assets/macos')
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      git: { github: { repos: { uploadReleaseAsset } } }
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      lastRelease: '0.1.0',
      commits: [],
      releaseNotes: ''
    });

    expect(uploadReleaseAsset).not.toHaveBeenCalled();
  });

  test('should upload a single asset', async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, './test-assets/macos')
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      git: { github: { repos: { uploadReleaseAsset } } }
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      lastRelease: '0.1.0',
      commits: [],
      releaseNotes: '',
      response: {
        data: { upload_url: 'https://foo.com' }
      } as Response<ReposCreateReleaseResponse>
    });

    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          'content-length': 14044,
          'content-type': 'application/octet-stream'
        },
        name: 'macos',
        url: 'https://foo.com'
      })
    );
  });

  test('should upload multiple assets', async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, './test-assets/macos'),
        path.join(__dirname, './test-assets/test.txt')
      ]
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      git: { github: { repos: { uploadReleaseAsset } } }
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      lastRelease: '0.1.0',
      commits: [],
      releaseNotes: '',
      response: {
        data: { upload_url: 'https://foo.com' }
      } as Response<ReposCreateReleaseResponse>
    });

    expect(uploadReleaseAsset).toHaveBeenCalledTimes(2);
  });

  test('should upload multiple assets using a glob', async () => {
    const plugin = new UploadAssets({
      assets: [path.join(__dirname, './test-assets/test*.txt')]
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      git: { github: { repos: { uploadReleaseAsset } } }
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      lastRelease: '0.1.0',
      commits: [],
      releaseNotes: '',
      response: {
        data: { upload_url: 'https://foo.com' }
      } as Response<ReposCreateReleaseResponse>
    });

    expect(uploadReleaseAsset).toHaveBeenCalledTimes(2);
    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'test-2.txt' })
    );
    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'test.txt' })
    );
  });
});
