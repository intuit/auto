class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.37.4/auto-macos.gz"
  version "v10.37.4"
  sha256 "7993f29f25e184923c0f76e525bf2ab2eeba232bad0f6db6fbc50ad7fb3b6196"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end