import { globalOptions } from "@auto-it/core/dist/types";
import { createCli, negatedName } from "../src/parse-args";

const { commands } = createCli();

/** The keys a command's .autorc section has */
const configKeys = (name: string) => {
  const option =
    globalOptions.shape[name as keyof typeof globalOptions.shape]?.unwrap();

  return Object.keys(option && "shape" in option ? option.shape : {});
};

test.each(commands.map((c) => [c.name, c] as const))(
  "%s has an option for every .autorc key",
  (name, command) => {
    const optionNames = command.options.flatMap((o) =>
      o.negated ? [negatedName(o.name)] : o.names
    );

    configKeys(name).forEach((key) => {
      expect(optionNames).toContain(key);
    });
  }
);

test("some commands have .autorc keys to check", () => {
  expect(
    commands.filter((c) => configKeys(c.name).length).length
  ).toBeGreaterThan(3);
});
