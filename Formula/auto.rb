class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.1/auto-macos.gz"
  version "v11.0.1"
  sha256 "f5f372c8587431ca9a7d723094c53fe47f62e64a6e7aea6b6aba9679caf9a9e1"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end