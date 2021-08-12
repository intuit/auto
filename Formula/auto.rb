class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.31.0/auto-macos.gz"
  version "v10.31.0"
  sha256 "6b4fd27b74a268d29a6ff61577239f1dd0ae0784ad9062784d6fe34e8933ab74"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end