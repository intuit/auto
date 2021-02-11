class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.1/auto-macos.gz"
  version "v10.16.1"
  sha256 "4e24b39575eb4b1735cda0f2a7d3a6f76ece26998af8f11ec9dcbd6e85c065d3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end