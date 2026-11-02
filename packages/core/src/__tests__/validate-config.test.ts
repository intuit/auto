import {
  validateAutoRc,
  validatePlugins,
  type ValidatePluginHook,
  formatError,
  validatePluginConfiguration,
} from "../validate-config";
import { AsyncSeriesBailHook } from "tapable";
import { z } from "zod";
import createLog from "../utils/logger";

describe("formatError", () => {
  test.each([
    { path: "test", expectedType: "number", value: "123" },
    { path: "test", expectedType: "string", value: 123 },
    { path: "test", expectedType: "string", value: ["123", 2, true] },
    { path: "test", expectedType: "number", value: { foo: "bar" } },
  ])("should format errors %#", (configError) => {
    expect(formatError(configError)).toMatchSnapshot();
  });
});

describe("validateConfig", () => {
  test("should not return errors when there are none", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        email: "andrew@lisowski.com",
        owner: "bar",
        repo: "foo",
        comment: {
          delete: true,
          edit: true,
        },
        changelog: {
          message: "foo",
        },
        canary: {
          message: "foo",
        },
        next: {
          message: "foo",
        },
        release: {
          prerelease: true,
        },
        shipit: {
          onlyGraduateWithReleaseLabel: true,
        },
      })
    ).toStrictEqual([]);
  });

  test("should not return errors when there are none - more complex", async () => {
    expect(await validateAutoRc({ verbose: true })).toStrictEqual([]);
    expect(await validateAutoRc({ verbose: [true, true] })).toStrictEqual([]);
  });

  test("should not return errors when there are none - multiple type", async () => {
    expect(await validateAutoRc({ versionBranches: true })).toStrictEqual([]);
    expect(await validateAutoRc({ versionBranches: "foo-" })).toStrictEqual([]);
    expect(await validateAutoRc({ versionBranches: 123 })).toStrictEqual([
      {
        expectedType: '"boolean" or "string"',
        path: "versionBranches",
        value: 123,
      },
    ]);
  });

  test("should catch misconfigured options", async () => {
    expect(
      await validateAutoRc({
        name: 123,
        owner: 456,
      })
    ).toStrictEqual([
      {
        expectedType: '"string"',
        path: "owner",
        value: 456,
      },
      {
        expectedType: '"string"',
        path: "name",
        value: 123,
      },
    ]);
  });

  test("should catch unknown options", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        foo: 456,
      })
    ).toMatchSnapshot();
  });

  test("should validate labels", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        labels: [
          {
            name: "Version: Minor",
          },
          {
            name: "Version: Major",
            changelogTitle: "The API has changed:",
            description: "Add this label to a PR to create a major release",
            color: "blue",
            releaseType: "major",
          },
        ],
      })
    ).toStrictEqual([]);
  });

  test("should allow author as an object", async () => {
    expect(
      await validateAutoRc({
        author: {
          name: "Andrew",
          email: "test@email.com",
        },
      })
    ).toStrictEqual([]);
  });

  test("should catch errors in labels", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        labels: [
          {
            name: "Version: Minor",
          },
          {
            name: "Version: Major",
            changelogTitle: 123,
          },
        ],
      })
    ).toStrictEqual([
      {
        expectedType: '"string"',
        path: "labels.1.changelogTitle",
        value: 123,
      },
    ]);
  });

  test("should not fail w/plugin configuration", async () => {
    expect(
      await validateAutoRc({
        plugins: [
          [
            "npm",
            {
              canaryScope: "@auto-canary",
            },
          ],
        ],
        labels: [
          {
            name: "dependencies",
            changelogTitle: "🔩 Dependency Updates",
            releasepe: "none",
          },
          {
            name: "blog-post",
            changelogTitle: "📚 Blog Post",
            releaseType: "none",
          },
        ],
      })
    ).toMatchSnapshot();
  });

  test("should not go too deep", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        labelz: [
          {
            name: "Version: Minor",
          },
        ],
      })
    ).toMatchSnapshot();
  });

  test("should error on invalid plugin config", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        plugins: [123, true],
      })
    ).toStrictEqual([
      {
        expectedType: '"string" or "tuple"',
        path: "plugins.0",
        value: 123,
      },
      {
        expectedType: '"string" or "tuple"',
        path: "plugins.1",
        value: true,
      },
    ]);
  });

  test("should handle basic plugin config", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        plugins: ["npm", "release"],
      })
    ).toStrictEqual([]);
  });

  test("should warn about required props", async () => {
    expect(
      await validateAutoRc({
        name: "Andrew",
        labels: [{}],
      })
    ).toStrictEqual([
      {
        expectedType: '"string"',
        path: "labels.0.name",
        value: undefined,
      },
    ]);
  });

  test("should handle complex plugin config", async () => {
    // NOTE: since these plugins aren't loaded they do not get their
    // options validated
    expect(
      await validateAutoRc({
        name: "Andrew",
        plugins: [
          ["npm", { forcePublish: true }],
          [
            "released",
            {
              label: ":shipit:",
            },
          ],
        ],
      })
    ).toStrictEqual([]);
  });

  test("should validate plugin configuration", async () => {
    const hook: ValidatePluginHook = new AsyncSeriesBailHook([
      "name",
      "options",
    ]);

    hook.tap("test", (name, options) => {
      if (name === "test-plugin") {
        const errors: string[] = [];

        if (options.label && typeof options.label !== "string") {
          errors.push(
            formatError({
              path: "npm.label",
              expectedType: "string",
              value: options.label,
            })
          );
        }

        if (options.other && typeof options.other !== "number") {
          errors.push(
            formatError({
              path: "npm.other",
              expectedType: "number",
              value: options.other,
            })
          );
        }

        if (errors.length) {
          return errors;
        }
      }
    });

    expect(
      await validatePlugins(hook, {
        name: "Andrew",
        plugins: [
          [
            "test-plugin",
            {
              label: 123,
            },
          ],
        ],
      })
    ).toMatchSnapshot();

    expect(
      await validatePlugins(hook, {
        name: "Andrew",
        plugins: [
          [
            "test-plugin",
            {
              label: "foo",
              other: 123,
            },
          ],
        ],
      })
    ).toStrictEqual([]);
  });
});

describe("validatePlugin", () => {
  test("should validate plugin configuration - nested objects", async () => {
    const hook: ValidatePluginHook = new AsyncSeriesBailHook([
      "name",
      "options",
    ]);

    const pluginOptions = z
      .strictObject({
        types: z.strictObject({ docs: z.string() }).partial(),
      })
      .partial();

    hook.tapPromise("test", async (name, options) => {
      if (name === "test-plugin") {
        return validatePluginConfiguration(
          "test-plugin",
          pluginOptions,
          options
        );
      }
    });

    expect(
      await validatePlugins(hook, {
        plugins: [
          [
            "test-plugin",
            {
              types: {
                doc: "foo",
              },
            },
          ],
        ],
      })
    ).toMatchSnapshot();
  });

  test("should not include redundant errors", async () => {
    const hook: ValidatePluginHook = new AsyncSeriesBailHook([
      "name",
      "options",
    ]);

    const pluginOptions = z
      .strictObject({
        types: z.union([z.string(), z.array(z.string())]),
      })
      .partial();

    hook.tapPromise("test", async (name, options) => {
      if (name === "test-plugin") {
        return validatePluginConfiguration(
          "test-plugin",
          pluginOptions,
          options
        );
      }
    });

    expect(
      await validatePlugins(hook, {
        plugins: [
          [
            "test-plugin",
            {
              types: ["foo", "bar", true],
            },
          ],
        ],
      })
    ).toStrictEqual([
      {
        expectedType: '"string"',
        path: "test-plugin.types.2",
        value: true,
      },
    ]);
  });

  test("should validate plugin configuration - array of objects", async () => {
    const hook: ValidatePluginHook = new AsyncSeriesBailHook([
      "name",
      "options",
    ]);

    const pluginOptions = z
      .strictObject({
        exclude: z.array(z.strictObject({ name: z.string() }).partial()),
      })
      .partial();

    hook.tapPromise("test", async (name, options) => {
      if (name === "test-plugin") {
        return validatePluginConfiguration(
          "test-plugin",
          pluginOptions,
          options
        );
      }
    });

    expect(
      await validatePlugins(hook, {
        plugins: [
          [
            "test-plugin",
            {
              exclude: [{ name: "foo" }, { name: "bar", extra: true }],
            },
          ],
        ],
      })
    ).toMatchSnapshot();
  });

  test("should validate plugin configuration - union", async () => {
    const hook: ValidatePluginHook = new AsyncSeriesBailHook([
      "name",
      "options",
    ]);

    const basePluginOptions = z
      .strictObject({
        /** URL of the slack to post to */
        url: z.string(),
        /** Who to bother when posting to the channel */
        atTarget: z.string(),
        /** Allow users to opt into having prereleases posted to slack */
        publishPreRelease: z.boolean(),
        /** Additional Title to add at the start of the slack message */
        title: z.string(),
      })
      .partial();

    const appPluginOptions = basePluginOptions.extend({
      /** Marks we are gonna use app auth */
      auth: z.literal("app"),
      /** Channels to post */
      channels: z.array(z.string()),
    });

    const pluginOptions = z.union([basePluginOptions, appPluginOptions]);

    hook.tapPromise("test", async (name, options) => {
      if (name === "test-plugin") {
        return validatePluginConfiguration(
          "test-plugin",
          pluginOptions,
          options
        );
      }
    });

    expect(
      await validatePlugins(hook, {
        plugins: [["test-plugin", { url: "foo" }]],
      })
    ).toStrictEqual([]);
    expect(
      await validatePlugins(hook, {
        plugins: [["test-plugin", { auth: "app" }]],
      })
    ).toMatchSnapshot();
    // Check no validation issues with intersected options
    expect(
      await validatePlugins(hook, {
        plugins: [
          ["test-plugin", { auth: "app", channels: ["foo"], atTarget: "foo" }],
        ],
      })
    ).toStrictEqual([]);
  });

  test("should validate plugin configuration - array of configurations", async () => {
    const hook: ValidatePluginHook = new AsyncSeriesBailHook([
      "name",
      "options",
    ]);

    const config = z.strictObject({ name: z.string() }).partial();
    const pluginOptions = z.union([config, z.array(config)]);

    hook.tapPromise("test", async (name, options) => {
      if (name === "test-plugin") {
        return validatePluginConfiguration(
          "test-plugin",
          pluginOptions,
          options
        );
      }
    });

    expect(
      await validatePlugins(hook, {
        plugins: [["test-plugin", { named: "foo" }]],
      })
    ).toMatchSnapshot();

    expect(
      await validatePlugins(hook, {
        plugins: [["test-plugin", [{ named: "foo" }]]],
      })
    ).toMatchSnapshot();
  });

  test("should report the allowed values of an enum", async () => {
    expect(
      await validatePluginConfiguration(
        "test-plugin",
        z.strictObject({ level: z.enum(["low", "high"]) }),
        { level: "medium" }
      )
    ).toStrictEqual([
      {
        expectedType: '"low" or "high"',
        path: "test-plugin.level",
        value: "medium",
      },
    ]);
  });

  test("should report every unknown key together", async () => {
    expect(
      await validatePluginConfiguration(
        "test-plugin",
        z.strictObject({ name: z.string(), nested: z.strictObject({}) }),
        { name: "foo", extra: 1, nested: { deep: 2 } }
      )
    ).toMatchSnapshot();
  });

  test("should report the closest union member", async () => {
    expect(
      await validatePluginConfiguration(
        "test-plugin",
        z.union([
          z.strictObject({ kind: z.literal("a"), size: z.number() }),
          z.strictObject({ kind: z.literal("b"), name: z.string() }),
        ]),
        { kind: "b", name: 1 }
      )
    ).toStrictEqual([
      {
        expectedType: '"string"',
        path: "test-plugin.name",
        value: 1,
      },
    ]);
  });

  test("should validate options with any Standard Schema", async () => {
    const optionsSchema = {
      "~standard": {
        version: 1 as const,
        vendor: "test",
        validate: async (value: unknown) =>
          value === "ok"
            ? { value }
            : {
                issues: [
                  { message: "Must be ok", path: [{ key: "a" }, 0] },
                  { message: "Not ok at all" },
                ],
              },
      },
    };

    expect(
      await validatePluginConfiguration("test-plugin", optionsSchema, "ok")
    ).toStrictEqual([]);
    expect(
      await validatePluginConfiguration("test-plugin", optionsSchema, "no")
    ).toMatchSnapshot();
  });

  test("should warn and skip validation for io-ts options schemas", async () => {
    const warn = vi.spyOn(createLog().log, "warn").mockImplementation(() => {});
    // Shaped like an io-ts codec, which has no "~standard" property
    const optionsSchema = { _tag: "PartialType", decode: () => ({}) };

    expect(
      await validatePluginConfiguration("test-plugin", optionsSchema as any, {
        name: 123,
      })
    ).toStrictEqual([]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('The "test-plugin" plugin')
    );

    warn.mockRestore();
  });
});
