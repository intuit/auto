class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.60.0/auto-macos.gz"
  version "v9.60.0"
  sha256 "9bfdd0aa3d28632d1379aaff4ddad1b565a3823b952429aaabe91fd49cf2654b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end