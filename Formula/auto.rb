class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.36.1/auto-macos.gz"
  version "v10.36.1"
  sha256 "8878e56c27ae157896091eb969742ef42be8d502dcda4c669cd157b080b37dcb"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end