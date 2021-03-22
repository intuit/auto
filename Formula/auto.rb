class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.22.0/auto-macos.gz"
  version "v10.22.0"
  sha256 "4631a0d6e4e73266dc13e2339e456389391242dfc3e6f14897a9a819a4d3ba6a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end