class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.35.1/auto-macos.gz"
  version "v10.35.1"
  sha256 "9acac132ad2e27f90ecfa468ac51f21a84b2ca4a15e7023961d3c4ff699433da"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end