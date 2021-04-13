class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.25.0/auto-macos.gz"
  version "v10.25.0"
  sha256 "aa58ff442c460e7030387c7df2d29d6af0af100ab3f7645547bacfd8370594ce"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end