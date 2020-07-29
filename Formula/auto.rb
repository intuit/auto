class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.48.2/auto-macos.gz"
  version "v9.48.2"
  sha256 "e619566a4c9b1735d083af72cfa55024b39683b85d1ce3d3791307551cdc2bdf"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end