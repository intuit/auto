class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.31.1/auto-macos.gz"
  version "v9.31.1"
  sha256 "b720200a6dd543dd8eb22250830c989569054ca0f615d7b33affdea8a82ee6eb"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end