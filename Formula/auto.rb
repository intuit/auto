class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.54.5/auto-macos.gz"
  version "v9.54.5"
  sha256 "7deef47c8470357b422a914172ca9ecc1e16e4f316ad11421beb0d9e8f0a1bfb"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end