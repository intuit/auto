class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.2.1/auto-macos.gz"
  version "v11.2.1"
  sha256 "e805161e018fffaa24cbb7fabcf77e6ab047706669492f893cbe82b24d7f0d35"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end