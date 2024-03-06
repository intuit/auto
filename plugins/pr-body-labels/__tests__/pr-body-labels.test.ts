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
      pr: { body: "- [x] `unknown-label`", labels: [{ name: "patch" }] },
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
      pr: { body: "- [x] `patch`", number: 1, labels: [{ name: "patch" }] },
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
      pr: { body: "- [X] `patch`", number: 1, labels: [{ name: "patch" }] },
    } as any);
    expect(addLabelToPr).toHaveBeenCalledWith(1, "patch");
  });

  test("should remove labels if unchecked", async () => {
    const plugin = new PrBodyLabels();
    const hooks = makeHooks();
    const removeLabel = jest.fn();

    plugin.apply({
      hooks,
      labels: [{ name: "patch" }],
      git: { removeLabel },
    } as any);

    await hooks.prCheck.promise({
      pr: { body: "- [ ] `patch`", number: 1, labels: [{ name: "patch" }] },
    } as any);
    expect(removeLabel).toHaveBeenCalledWith(1, "patch");
  });

  test("should not remove labels if removeStaleLabels=false", async () => {
    const plugin = new PrBodyLabels({ removeStaleLabels: false });
    const hooks = makeHooks();
    const removeLabel = jest.fn();

    plugin.apply({
      hooks,
      labels: [{ name: "patch" }],
      git: { removeLabel },
    } as any);

    await hooks.prCheck.promise({
      pr: { body: "- [ ] `patch`", number: 1, labels: [{ name: "patch" }] },
    } as any);
    expect(removeLabel).not.toHaveBeenCalledWith(1, "patch");
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
      pr: { body: "- [x] `patch`", number: 1, labels: [{ name: "patch" }] },
    } as any);
    expect(addLabelToPr).not.toHaveBeenCalled();
  });
});
