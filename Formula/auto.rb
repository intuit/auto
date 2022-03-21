class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.36.5/auto-macos.gz"
  version "v10.36.5"
  sha256 "3893607ed39b02e8fca30c2c2a64129e6fc2ae2f632ee3afc430f6cc73e424c7"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end