class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.50.3/auto-macos.gz"
  version "v9.50.3"
  sha256 "32a4d6055688d1d5d0a44b2cccd675298fea87644619da8ffc0fe8f220bde5a7"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end