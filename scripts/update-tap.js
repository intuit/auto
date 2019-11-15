const dedent = require('dedent');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const createFormula = (version, sha) => dedent`
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

const updateFormula = () => {
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

  const newFormula = createFormula(version, sha);

  fs.writeFileSync('./Formula/auto.rb', newFormula);

  execSync('git add ./Formula/auto.rb');
  execSync('git commit -m "Bump brew formula [skip ci]", --no-verify');
};

module.exports = class {
  constructor() {
    this.name = 'brew';
  }

  apply(auto) {
    auto.hooks.afterVersion.tap('Update brew', updateFormula);
  }
};
