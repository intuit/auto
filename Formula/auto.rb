class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.50.1/auto-macos.gz"
  version "v9.50.1"
  sha256 "5f49dce29c3bfdf62d02eeea3dca8e331e04eb3e124837946f6fa491649ad19d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end