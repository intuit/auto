class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.0.2/auto-macos.gz"
  version "v10.0.2"
  sha256 "d5e137940042550e7a5e93541eb5afb79b92f4ef61663a09fe82ae2f6cd57a60"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end