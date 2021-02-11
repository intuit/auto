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
});
