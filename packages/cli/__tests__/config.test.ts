import { globalOptions } from "@auto-it/core/dist/types";
import { camelCase } from "change-case";
import { commands } from "../src/parse-args";

test.each(commands.map((c) => [c.name, c] as const))(
  "%s has correct config options",
  (name, command) => {
    const option =
      globalOptions.shape[name as keyof typeof globalOptions.shape]?.unwrap();
    const configOptions = option && "shape" in option ? option.shape : {};

    expect.assertions(command.options?.filter((o) => o.config).length ?? 0);

    Object.keys(configOptions).forEach((option) => {
      expect(command.options.some((o) => camelCase(o.name) === option)).toBe(
        true
      );
    });
  }
);
