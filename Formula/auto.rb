class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.20.6/auto-macos.gz"
  version "v10.20.6"
  sha256 "da8b4f5d50b5f3cbde7eecaa9f87f6f3921726c0fb68665acc0c2218e4fed85b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end