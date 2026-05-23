import envCi from "env-ci";

jest.mock("env-ci");

const envSpy = envCi as jest.Mock;
envSpy.mockImplementation(() => ({
  isCi: true,
  pr: 123,
}));

import Auto, { SEMVER } from "@auto-it/core";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import path from "path";

import { dummyLog } from "@auto-it/core/dist/utils/logger";
import UploadAssets from "../src";
import endent from "endent";

const options = {
  owner: "test",
  repo: "repo",
};

jest.spyOn(console, "log").mockImplementation();

describe("Upload Assets Plugin", () => {
  test("should add to pr body for pull requests", async () => {
    const plugin = new UploadAssets([
      path.join(__dirname, "./test-assets/macos"),
    ]);
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockImplementation(({ name }) =>
      Promise.resolve({
        data: { id: 2, name, browser_download_url: `http://${name}` },
      })
    );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const addToPrBody = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => "abc",
        addToPrBody,
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

    expect(addToPrBody).toHaveBeenCalledWith(
      endent`
        :baby_chick: Download canary assets:

        [macos-canary.123](http://macos-canary.123)
      `,
      123,
      "canary-assets"
    );
  });

  test("should add to pr body for pull requests with custom message", async () => {
    const plugin = new UploadAssets({
      assets: [path.join(__dirname, "./test-assets/macos.xml")],
      headerMessage: "🚀 Download links canary assets with custom message:",
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockImplementation(({ name }) =>
      Promise.resolve({
        data: { id: 2, name, browser_download_url: `http://${name}` },
      })
    );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const addToPrBody = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => "abc",
        addToPrBody,
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

    expect(addToPrBody).toHaveBeenCalledWith(
      endent`
        🚀 Download links canary assets with custom message:

        [macos-canary.123.xml](http://macos-canary.123.xml)
      `,
      123,
      "canary-assets"
    );
  });

  test("should add to pr body for pull requests with filter", async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, "./test-assets/color_test.xml"),
        path.join(__dirname, "./test-assets/typo_test.xml"),
        path.join(__dirname, "./test-assets/shadow_test.xml"),
        path.join(__dirname, "./test-assets/macos.xml"),
        path.join(__dirname, "./test-assets/macos"),
      ],
      filter: "(color|shadow|typo).*\\.xml",
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockImplementation(({ name }) =>
      Promise.resolve({
        data: { id: 2, name, browser_download_url: `http://${name}` },
      })
    );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const addToPrBody = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => "abc",
        addToPrBody,
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

    expect(addToPrBody).toHaveBeenCalledWith(
      endent`
        :baby_chick: Download canary assets:

        [color_test-canary.123.xml](http://color_test-canary.123.xml)
        [typo_test-canary.123.xml](http://typo_test-canary.123.xml)
        [shadow_test-canary.123.xml](http://shadow_test-canary.123.xml)
      `,
      123,
      "canary-assets"
    );
  });

  test("should not add to pr body for pull request", async () => {
    const plugin = new UploadAssets({
      assets: [path.join(__dirname, "./test-assets/color_test.xml")],
      includeBotPrs: false,
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockImplementation(({ name }) =>
      Promise.resolve({
        data: { id: 2, name, browser_download_url: `http://${name}` },
      })
    );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const addToPrBody = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => "abc",
        addToPrBody,
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

    expect(addToPrBody).not.toHaveBeenCalled();
  });

  test("should add to pr body for pull requests with group", async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, "./test-assets/color_test.xml"),
        path.join(__dirname, "./test-assets/shadow_test.xml"),
        path.join(__dirname, "./test-assets/color_test-3.xml"),
        path.join(__dirname, "./test-assets/typo_test-3.xml"),
        path.join(__dirname, "./test-assets/shadow_test-2.xml"),
        path.join(__dirname, "./test-assets/typo_test.xml"),
        path.join(__dirname, "./test-assets/color_test-2.xml"),
        path.join(__dirname, "./test-assets/typo_test-2.xml"),
      ],
      group: "(color|shadow|typo).*\\.xml",
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockImplementation(({ name }) =>
      Promise.resolve({
        data: { id: 2, name, browser_download_url: `http://${name}` },
      })
    );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const addToPrBody = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => "abc",
        addToPrBody,
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

    expect(addToPrBody).toHaveBeenCalledWith(
      endent`
        :baby_chick: Download canary assets:

        ### color
        [color_test-canary.123.xml](http://color_test-canary.123.xml)
        [color_test-3-canary.123.xml](http://color_test-3-canary.123.xml)
        [color_test-2-canary.123.xml](http://color_test-2-canary.123.xml)
        ### shadow
        [shadow_test-canary.123.xml](http://shadow_test-canary.123.xml)
        [shadow_test-2-canary.123.xml](http://shadow_test-2-canary.123.xml)
        ### typo
        [typo_test-3-canary.123.xml](http://typo_test-3-canary.123.xml)
        [typo_test-canary.123.xml](http://typo_test-canary.123.xml)
        [typo_test-2-canary.123.xml](http://typo_test-2-canary.123.xml)
      `,
      123,
      "canary-assets"
    );
  });

  test("should add to pr body for pull requests with compact message", async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, "./test-assets/color_test.xml"),
        path.join(__dirname, "./test-assets/shadow_test.xml"),
        path.join(__dirname, "./test-assets/color_test-3.xml"),
        path.join(__dirname, "./test-assets/typo_test-3.xml"),
        path.join(__dirname, "./test-assets/shadow_test-2.xml"),
        path.join(__dirname, "./test-assets/typo_test.xml"),
        path.join(__dirname, "./test-assets/color_test-2.xml"),
        path.join(__dirname, "./test-assets/typo_test-2.xml"),
      ],
      compact: true,
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockImplementation(({ name }) =>
      Promise.resolve({
        data: { id: 2, name, browser_download_url: `http://${name}` },
      })
    );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const addToPrBody = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => "abc",
        addToPrBody,
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

    expect(addToPrBody).toHaveBeenCalledWith(
      endent`
        <details>
          <summary>:baby_chick: Download canary assets:</summary>
          <blockquote>
            <a href='http://color_test-canary.123.xml'>color_test-canary.123.xml</a><br>
            <a href='http://shadow_test-canary.123.xml'>shadow_test-canary.123.xml</a><br>
            <a href='http://color_test-3-canary.123.xml'>color_test-3-canary.123.xml</a><br>
            <a href='http://typo_test-3-canary.123.xml'>typo_test-3-canary.123.xml</a><br>
            <a href='http://shadow_test-2-canary.123.xml'>shadow_test-2-canary.123.xml</a><br>
            <a href='http://typo_test-canary.123.xml'>typo_test-canary.123.xml</a><br>
            <a href='http://color_test-2-canary.123.xml'>color_test-2-canary.123.xml</a><br>
            <a href='http://typo_test-2-canary.123.xml'>typo_test-2-canary.123.xml</a><br>
          </blockquote>
        </details>
      `,
      123,
      "canary-assets"
    );
  });

  test("should add to pr body for pull requests with group and compact message", async () => {
    const plugin = new UploadAssets({
      assets: [
        path.join(__dirname, "./test-assets/color_test.xml"),
        path.join(__dirname, "./test-assets/shadow_test.xml"),
        path.join(__dirname, "./test-assets/color_test-3.xml"),
        path.join(__dirname, "./test-assets/typo_test-3.xml"),
        path.join(__dirname, "./test-assets/shadow_test-2.xml"),
        path.join(__dirname, "./test-assets/typo_test.xml"),
        path.join(__dirname, "./test-assets/color_test-2.xml"),
        path.join(__dirname, "./test-assets/typo_test-2.xml"),
      ],
      group: "(color|shadow|typo).*\\.xml",
      compact: true,
    });
    const hooks = makeHooks();
    const uploadReleaseAsset = jest.fn().mockImplementation(({ name }) =>
      Promise.resolve({
        data: { id: 2, name, browser_download_url: `http://${name}` },
      })
    );
    const createRelease = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const addToPrBody = jest.fn();

    plugin.apply(({
      hooks,
      logger: dummyLog(),
      prefixRelease: (v) => v,
      git: {
        options,
        getFirstCommit: () => "abc",
        addToPrBody,
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

    expect(addToPrBody).toHaveBeenCalledWith(
      endent`
        <details>
          <summary>:baby_chick: Download canary assets:</summary>
          <blockquote>
            <details>
              <summary>color</summary>
              <blockquote>
                <a href='http://color_test-canary.123.xml'>color_test-canary.123.xml</a><br>
                <a href='http://color_test-3-canary.123.xml'>color_test-3-canary.123.xml</a><br>
                <a href='http://color_test-2-canary.123.xml'>color_test-2-canary.123.xml</a><br>
              </blockquote>
            </details>
            <details>
              <summary>shadow</summary>
              <blockquote>
                <a href='http://shadow_test-canary.123.xml'>shadow_test-canary.123.xml</a><br>
                <a href='http://shadow_test-2-canary.123.xml'>shadow_test-2-canary.123.xml</a><br>
              </blockquote>
            </details>
            <details>
              <summary>typo</summary>
              <blockquote>
                <a href='http://typo_test-3-canary.123.xml'>typo_test-3-canary.123.xml</a><br>
                <a href='http://typo_test-canary.123.xml'>typo_test-canary.123.xml</a><br>
                <a href='http://typo_test-2-canary.123.xml'>typo_test-2-canary.123.xml</a><br>
              </blockquote>
            </details>
          </blockquote>
        </details>
      `,
      123,
      "canary-assets"
    );
  });
});
