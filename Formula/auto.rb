class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.18.1/auto-macos.gz"
  version "v10.18.1"
  sha256 "0eb71b1a498f92b3900aff3ea9d4e69c2f7c6ad807c3a8139d3108ad1a645a73"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end