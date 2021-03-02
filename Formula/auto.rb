class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.17.1/auto-macos.gz"
  version "v10.17.1"
  sha256 "5d5e8846239fe80b2aeb3b2fd7fb58a0af38ac975cd49ea3d54cce0dd98a3ff4"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end