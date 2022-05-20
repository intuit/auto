class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.37.0/auto-macos.gz"
  version "v10.37.0"
  sha256 "0995bb700ec886e58065bdc0ba258bc9534b22952eb4c5d2718e17072bd9cff0"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end