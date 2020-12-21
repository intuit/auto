class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.5.0/auto-macos.gz"
  version "v10.5.0"
  sha256 "14f254faed1652ae86198c1b93a167912251fbc9807c1c62c5d29bac511791ed"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end