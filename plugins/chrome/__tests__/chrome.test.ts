import Plugin from "../src";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import { dummyLog } from "@auto-it/core/dist/utils/logger";

describe("unknown options", () => {
  test("should reject options the plugin doesn't have", async () => {
    const hooks = makeHooks();
    const plugin = new Plugin({});

    plugin.apply({ hooks, logger: dummyLog() } as any);

    expect(
      await hooks.validateConfig.promise(plugin.name, { notAnOption: true })
    ).toStrictEqual([expect.stringContaining("notAnOption")]);
  });
});
