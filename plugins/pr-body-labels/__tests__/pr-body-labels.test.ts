import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";

import PrBodyLabels from "../src";

describe("Pr-Body-Labels Plugin", () => {
  test("not add labels not present in project", async () => {
    const plugin = new PrBodyLabels();
    const hooks = makeHooks();
    const addLabelToPr = jest.fn();

    plugin.apply({
      hooks,
      labels: [],
      git: { addLabelToPr },
    } as any);

    await hooks.prCheck.promise({
      pr: { body: "- [x] `unknown-label`" },
    } as any);
    expect(addLabelToPr).not.toHaveBeenCalled();
  });

  test("add labels present in project", async () => {
    const plugin = new PrBodyLabels();
    const hooks = makeHooks();
    const addLabelToPr = jest.fn();

    plugin.apply({
      hooks,
      labels: [{ name: "patch" }],
      git: { addLabelToPr },
    } as any);

    await hooks.prCheck.promise({
      pr: { body: "- [x] `patch`", number: 1 },
    } as any);
    expect(addLabelToPr).toHaveBeenCalledWith(1, "patch");
  });

  test("add labels present in project capital X", async () => {
    const plugin = new PrBodyLabels();
    const hooks = makeHooks();
    const addLabelToPr = jest.fn();

    plugin.apply({
      hooks,
      labels: [{ name: "patch" }],
      git: { addLabelToPr },
    } as any);

    await hooks.prCheck.promise({
      pr: { body: "- [X] `patch`", number: 1 },
    } as any);
    expect(addLabelToPr).toHaveBeenCalledWith(1, "patch");
  });

  test("not add labels in disabledLabels list", async () => {
    const plugin = new PrBodyLabels({ disabledLabels: ["patch"] });
    const hooks = makeHooks();
    const addLabelToPr = jest.fn();

    plugin.apply({
      hooks,
      labels: [{ name: "patch" }],
      git: { addLabelToPr },
    } as any);

    await hooks.prCheck.promise({
      pr: { body: "- [x] `patch`", number: 1 },
    } as any);
    expect(addLabelToPr).not.toHaveBeenCalled();
  });
});
