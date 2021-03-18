class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.20.5/auto-macos.gz"
  version "v10.20.5"
  sha256 "004f632fa0bbc8cab7b0ccae96aad6ea3ee2437b42bdc934ca4e17c47cd78d95"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end