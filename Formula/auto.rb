class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.31.2/auto-macos.gz"
  version "v9.31.2"
  sha256 "ad21dbce7682f86dead146e6b500dd8aa880ed8a0bb780e3c0ffb67cdb5c8a17"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end