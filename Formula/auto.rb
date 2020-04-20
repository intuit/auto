class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.28.2/auto-macos.gz"
  version "v9.28.2"
  sha256 "83b0b4b20fc84de357b965a2faf9779608cd556c1949cce6106401bd0c3fbd87"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end