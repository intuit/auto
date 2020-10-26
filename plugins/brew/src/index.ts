import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import { execSync } from "child_process";
import fs from "fs";
import * as t from "io-ts";

const requiredOptions = t.interface({
  /** The name of the formula to create */
  name: t.string,
  /** The executable to create a formula for */
  executable: t.string,
});

const optionalOptions = t.partial({
  /** A path to the formula template */
  formula: t.string,
});

const formulaConfiguration = t.intersection([requiredOptions, optionalOptions]);
export type FormulaConfiguration = t.TypeOf<typeof formulaConfiguration>;

const pluginOptions = t.union([
  formulaConfiguration,
  t.array(formulaConfiguration),
]);

export type IBrewPluginOptions = t.TypeOf<typeof pluginOptions>;

/** Automate the creation of Homebrew formulae. */
export default class BrewPlugin implements IPlugin {
  /** The name of the plugin */
  name = "brew";

  /** The options of the plugin */
  readonly formulas: FormulaConfiguration[];

  /** Initialize the plugin with it's options */
  constructor(options: IBrewPluginOptions) {
    this.formulas = Array.isArray(options) ? options : [options];
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.afterVersion.tapPromise("Update brew", async ({ dryRun }) => {
      if (!dryRun) {
        await Promise.all(
          this.formulas.map((formula) => this.createFormula(auto, formula))
        );
      }
    });
  }

  /** Read a template and generate a brew formula */
  private async createFormula(auto: Auto, config: FormulaConfiguration) {
    if (!auto.git) {
      return;
    }

    try {
      const { executable, name, formula = "formula-template.rb" } = config;
      const version = await auto.git.getLatestTagInBranch();
      const sha = execSync(`shasum --algorithm 256 ${executable}`, {
        encoding: "utf8",
      }).split(" ")[0];

      auto.logger.log.info(
        `Updating "${name}" brew formula: ${version}#${sha}`
      );

      const template = fs.readFileSync(formula, {
        encoding: "utf8",
      });
      const newFormula = template
        .replace(/\$VERSION/g, version)
        .replace(/\$SHA/g, sha);

      if (!fs.existsSync("./Formula")) {
        fs.mkdirSync("./Formula");
      }

      const output = `./Formula/${name}.rb`;

      fs.writeFileSync(output, newFormula);
      auto.logger.verbose.info(`Wrote new formula to: ${output}`);

      execSync(`git add ${output}`);
      execSync(
        `git commit -m "Bump "${name}" brew formula [skip ci]" --no-verify`
      );
      auto.logger.verbose.info("Committed new formula");
    } catch (error) {
      auto.logger.log.error(error);
      process.exit(1);
    }
  }
}
