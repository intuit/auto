class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.3/auto-macos.gz"
  version "v10.16.3"
  sha256 "16201cd10bf5bf070edfe6b53731061cf033a5e35a54aa8ce6d5dacf0432b2c9"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end