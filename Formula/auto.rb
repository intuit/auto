class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.21.2/auto-macos.gz"
  version "v10.21.2"
  sha256 "7554e45e6d879e7cc8cd898e593d4a35b0f8c45dd061fd19480738c7502b786a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end