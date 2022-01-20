class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.32.6/auto-macos.gz"
  version "v10.32.6"
  sha256 "ab2849cfc29add5aa86fdc8ba329dc2a1d8ebe7f5cc5a138583d69d44df1a0e5"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end