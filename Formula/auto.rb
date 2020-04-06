class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.26.1/auto-macos.gz"
  version "v9.26.1"
  sha256 "d539374e8fbc5b31cac1d3209e2a0cc3ce21a24de2041da6c399a299f03f21b9"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end