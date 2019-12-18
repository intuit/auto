const endent = require('endent');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const createFormula = (version, sha) => endent`
  class Auto < Formula
    desc "Generate releases based on semantic version labels on pull requests."
    homepage "https://intuit.github.io/auto/home.html"
    url "https://github.com/intuit/auto/releases/download/v${version}/auto-macos.gz"
    sha256 "${sha}"

    def install
      libexec.install Dir["*"]
      bin.install libexec/"auto-macos"
      mv bin/"auto-macos", bin/"auto"
    end

    test do
      system bin/"auto", "--version"
    end
  end
`;

module.exports = class {
  constructor() {
    this.name = 'brew';
  }

  /**
   * Setup the plugin
   * @param {import('@auto-it/core').default} auto
   */
  apply(auto) {
    auto.hooks.afterVersion.tap('Update brew', () => {
      try {
        const pathToExecutable = path.join(
          __dirname,
          '../packages/cli/binary/auto-macos.gz'
        );
        const sha = execSync(`shasum --algorithm 256 ${pathToExecutable}`, {
          encoding: 'utf8'
        }).split(' ')[0];
        const version = JSON.parse(
          fs.readFileSync(path.join(__dirname, '../lerna.json'))
        ).version;

        auto.logger.log.info(`Updating brew formula: v${version}#${sha}`);

        const newFormula = createFormula(version, sha);
        const output = './Formula/auto.rb';

        fs.writeFileSync(output, newFormula);
        auto.logger.verbose.info(`Wrote new formula to: ${output}`);

        execSync(`git add ${output}`);
        execSync('git commit -m "Bump brew formula [skip ci]" --no-verify');
        auto.logger.verbose.info('Committed new formula');
      } catch (error) {
        auto.logger.log.error(error);
      }
    });
  }
};
