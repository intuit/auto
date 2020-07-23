class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.48.1/auto-macos.gz"
  version "v9.48.1"
  sha256 "71e2c88861605dfdfa5ec4169f7837b73d34b1a2549ec409665ab4026468e685"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end