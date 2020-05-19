class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.34.1/auto-macos.gz"
  version "v9.34.1"
  sha256 "d55d3e24ab8feff573e0ba6a8340451c54aa2b699549961648906c12ef95aaae"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end