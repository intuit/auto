class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.33.0/auto-macos.gz"
  version "v9.33.0"
  sha256 "b7eb1f688d3909323e7f2f45f330597e3dceb550d264a3bc185bca4bb3337a73"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end