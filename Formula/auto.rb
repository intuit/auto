class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.27.1/auto-macos.gz"
  version "v10.27.1"
  sha256 "88ebbb6a91e89111c5b5a601883b5784aefa92ab15ba0d1d50d2fa4a055822e3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end