class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.14.0/auto-macos.gz"
  version "v10.14.0"
  sha256 "6bd895839f2a55f2ffa133a7985d99ae7a241e022fc7a82a84020e5260b211a1"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end