class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.45.2/auto-macos.gz"
  version "v10.45.2"
  sha256 "8418139f25f82a066eb4a48b058e16ca151c6edefd0c131c61b330321a4e27f9"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end