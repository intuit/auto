import { globalOptions } from "@auto-it/core/dist/types";
import { camelCase } from "change-case";
import { commands } from "../src/parse-args";

test.each(commands.map((c) => [c.name, c] as const))(
  "%s has correct config options",
  (name, command) => {
    const configOptions = globalOptions.props[name]?.props || {};

    expect.assertions(command.options?.filter((o) => o.config).length ?? 0);

    Object.keys(configOptions).forEach((option) => {
      expect(command.options.some((o) => camelCase(o.name) === option)).toBe(
        true
      );
    });
  }
);
