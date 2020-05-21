class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.35.0/auto-macos.gz"
  version "v9.35.0"
  sha256 "86d9876d20fba9611d00c6d6ccaf01bc92a15f3d082ece7361f8368c062f3ffd"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end