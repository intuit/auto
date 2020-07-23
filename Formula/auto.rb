class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.48.0/auto-macos.gz"
  version "v9.48.0"
  sha256 "0a0dbb745a46c722b47dfac967b1e9cc5d6bbae136a0e1d2e0f72a1038578a0a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end