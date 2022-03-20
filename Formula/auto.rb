class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.35.0/auto-macos.gz"
  version "v10.35.0"
  sha256 "4dd48f69482c7169540ddf7a8de8c06ff80c8ed2a586495d41025fad9f6eec14"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end