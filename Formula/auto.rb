class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.18.4/auto-macos.gz"
  version "v10.18.4"
  sha256 "316fb02296195f24c36ca4955322a16b3dc58218b8d391eb8f7b1b3e5c8dd7c1"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end