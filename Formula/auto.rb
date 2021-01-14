class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.9.1/auto-macos.gz"
  version "v10.9.1"
  sha256 "46f7ce62635165755faefbfd99ed6ba38c02e39883d3e31ac52dfb6d587dcf2c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end