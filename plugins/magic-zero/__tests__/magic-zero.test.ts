import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { defaultLabels } from "@auto-it/core/dist/semver";

import MagicZero from "../src";

const setup = (version: string) => {
  const plugin = new MagicZero();
  const hooks = makeHooks();

  hooks.getPreviousVersion.tap("test", () => version);

  plugin.apply({
    hooks,
    git: { getLatestRelease: () => undefined },
  } as any);

  return hooks;
};

describe("Magic-Zero Plugin", () => {
  test("should downgrade major/minor => patch for 0.0.x", async () => {
    const hooks = setup("0.0.1");
    const config = await hooks.modifyConfig.promise({
      labels: [...defaultLabels],
    } as any);

    expect(config.labels).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "major",
          releaseType: "patch",
        }),
        expect.objectContaining({
          name: "minor",
          releaseType: "patch",
        }),
        expect.objectContaining({
          name: "graduate",
          releaseType: "minor",
        }),
      ])
    );
  });

  test("should downgrade major => minor for 0.x.y", async () => {
    const hooks = setup("0.1.0");
    const config = await hooks.modifyConfig.promise({
      labels: [...defaultLabels],
    } as any);

    expect(config.labels).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "major",
          releaseType: "minor",
        }),
        expect.objectContaining({
          name: "graduate",
          releaseType: "major",
        }),
      ])
    );
  });

  test("should downgrade minor => patch for 0.x.y", async () => {
    const hooks = setup("0.1.0");
    const config = await hooks.modifyConfig.promise({
      labels: [...defaultLabels],
    } as any);

    expect(config.labels).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "minor",
          releaseType: "patch",
        }),
        expect.objectContaining({
          name: "graduate",
          releaseType: "major",
        }),
      ])
    );
  });

  test("should do nothing for major/minor >= 1.0.0", async () => {
    const hooks = setup("1.0.0");
    const config = await hooks.modifyConfig.promise({
      labels: [...defaultLabels],
    } as any);

    expect(config.labels).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "minor",
          releaseType: "minor",
        }),
        expect.objectContaining({
          name: "major",
          releaseType: "major",
        }),
      ])
    );

    expect(config.labels).not.toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "graduate",
        }),
      ])
    );
  });
});
