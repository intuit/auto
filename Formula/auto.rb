class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.21.0/auto-macos.gz"
  version "v10.21.0"
  sha256 "fe134ba6428404d69921af7c94b867d3e994fe42ce498e29f5435b0ddf10d92f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end