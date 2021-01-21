class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.12.0/auto-macos.gz"
  version "v10.12.0"
  sha256 "f1a4befd664b1302ac89c0d2518d3b772082e6cc7b3d9efd9280bddb78d10085"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end