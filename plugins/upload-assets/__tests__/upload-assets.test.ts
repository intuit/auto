import envCi from "env-ci";

jest.mock("env-ci");

const envSpy = envCi as jest.Mock;
envSpy.mockImplementation(() => ({
  isCi: false,
}));

import Auto, { SEMVER } from "@auto-it/core";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { RestEndpointMethodTypes } from "@octokit/rest";
import path from "path";

import { dummyLog } from "@auto-it/core/dist/utils/logger";
import UploadAssets from "../src";

const options = {
  owner: "test",
  repo: "repo",
};

jest.spyOn(console, "log").mockImplementation();

describe("Upload Assets Plugin", () => {
  test("should do nothing without a response", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/macos"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
    });

    expect(uploadReleaseAsset).not.toHaveBeenCalled();
  });

  test("should upload a single asset", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/macos"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
      response: {
        data: { id: "123" },
      } as any,
    });

    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          "content-length": 14044,
          "content-type": "application/octet-stream",
        },
        name: "macos",
        release_id: "123",
      })
    );
    expect(createRelease).not.toHaveBeenCalled();
  });

  test("should upload a single canary asset", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/macos"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest
      .fn()
      .mockImplementation(({ name }) =>
        Promise.resolve({ data: { id: 2, name } })
      );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        getFirstCommit: () => 'abc',
        options,
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.canary.promise({
      canaryIdentifier: "canary.123",
      bump: SEMVER.patch,
    });

    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "macos-canary.123",
        release_id: 1,
      })
    );
  });

  test("should use canary release if exists", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/macos"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest
      .fn()
      .mockImplementation(({ name }) =>
        Promise.resolve({ data: { id: 2, name } })
      );
    const getReleaseByTag = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, getReleaseByTag },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.canary.promise({
      canaryIdentifier: "canary.123",
      bump: SEMVER.patch,
    });

    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "macos-canary.123",
        release_id: 1,
      })
    );
  });

  test("should not upload a canary asset in dryRun", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/macos"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest
      .fn()
      .mockImplementation(({ name }) =>
        Promise.resolve({ data: { id: 2, name } })
      );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => 'abc',
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.canary.promise({
      canaryIdentifier: "canary.123",
      bump: SEMVER.patch,
      dryRun: true,
    });

    expect(uploadReleaseAsset).not.toHaveBeenCalled();
  });

  test("should upload a single canary asset with extension", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/test.txt"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest
      .fn()
      .mockImplementation(({ name }) =>
        Promise.resolve({ data: { id: 2, name } })
      );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => 'abc',
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.canary.promise({
      canaryIdentifier: "canary.123",
      bump: SEMVER.patch,
    });

    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "test-canary.123.txt",
        release_id: 1,
      })
    );
  });

  test("should upload to enterprise", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/macos"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options: { ...options, baseUrl: "https://github.my.com/api/v3" },
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
      response: {
        data: { id: "123" },
      } as any,
    });

    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          "content-length": 14044,
          "content-type": "application/octet-stream",
        },
        baseUrl: "https://github.my.com/api/uploads",
        name: "macos",
        release_id: "123",
      })
    );
  });

  test("should upload multiple assets", async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, "./test-assets/macos"),
        path.join(__dirname, "./test-assets/test.txt"),
      ],
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
      response: {
        data: { upload_url: "https://foo.com" },
      } as RestEndpointMethodTypes["repos"]["createRelease"]["response"],
    });

    expect(uploadReleaseAsset).toHaveBeenCalledTimes(2);
  });

  test("should upload multiple assets using a glob", async () => {
    const plugin = new UploadAssets({
      assets: [path.join(__dirname, "./test-assets/test*.txt")],
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, createRelease },
          paginate: jest.fn().mockResolvedValue([]),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
      response: {
        data: { upload_url: "https://foo.com" },
      } as RestEndpointMethodTypes["repos"]["createRelease"]["response"],
    });

    expect(uploadReleaseAsset).toHaveBeenCalledTimes(2);
    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({ name: "test-2.txt" })
    );
    expect(uploadReleaseAsset).toHaveBeenCalledWith(
      expect.objectContaining({ name: "test.txt" })
    );
  });

  test("should not delete maxAssets", async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, "./test-assets/macos"),
        path.join(__dirname, "./test-assets/test.txt"),
      ],
    });
    const hooks = makeHooks();
    const deleteReleaseAsset = jest.fn();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, createRelease, deleteReleaseAsset },
          paginate: jest.fn().mockResolvedValue(new Array(300).fill({})),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
      response: {
        data: { upload_url: "https://foo.com" },
      } as RestEndpointMethodTypes["repos"]["createRelease"]["response"],
    });

    expect(deleteReleaseAsset).not.toHaveBeenCalled();
  });

  test("should delete old canary assets", async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, "./test-assets/macos"),
        path.join(__dirname, "./test-assets/test.txt"),
      ],
    });
    const hooks = makeHooks();
    const deleteReleaseAsset = jest.fn();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const getReleaseByTag = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, getReleaseByTag, deleteReleaseAsset },
          paginate: jest.fn().mockResolvedValue(new Array(303).fill({})),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
      response: {
        data: { upload_url: "https://foo.com" },
      } as RestEndpointMethodTypes["repos"]["createRelease"]["response"],
    });

    expect(deleteReleaseAsset).toHaveBeenCalledTimes(3);
  });

  test("should ba able to configure max assets", async () => {
    const plugin = new UploadAssets({
      maxCanaryAssets: 100,
      assets: [
        path.join(__dirname, "./test-assets/macos"),
        path.join(__dirname, "./test-assets/test.txt"),
      ],
    });
    const hooks = makeHooks();
    const deleteReleaseAsset = jest.fn();
    const uploadReleaseAsset = jest.fn().mockResolvedValue({});
    const getReleaseByTag = jest.fn().mockResolvedValue({ data: { id: 1 } });

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        github: {
          repos: { uploadReleaseAsset, getReleaseByTag, deleteReleaseAsset },
          paginate: jest.fn().mockResolvedValue(new Array(300).fill({})),
        },
      },
    } as unknown) as Auto);

    await hooks.afterRelease.promise({
      newVersion: "1.0.0",
      lastRelease: "0.1.0",
      commits: [],
      releaseNotes: "",
      response: {
        data: { upload_url: "https://foo.com" },
      } as RestEndpointMethodTypes["repos"]["createRelease"]["response"],
    });

    expect(deleteReleaseAsset).toHaveBeenCalledTimes(200);
  });
});
