class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.6/auto-macos.gz"
  version "v11.0.6"
  sha256 "9b00939dd3b30d2e7159c7d6ca21eff42367a05464a751c1d072c67a40fbb031"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end