class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.32.0/auto-macos.gz"
  version "v9.32.0"
  sha256 "c5dd50e9d3cb1d37663d747a178bfb221f0ec520f59bb2ced5fe485ff5672c91"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end