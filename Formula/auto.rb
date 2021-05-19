class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.28.0/auto-macos.gz"
  version "v10.28.0"
  sha256 "f360e0f95b09d45f30d5d53649bc4684f4dd6192174b1bb37166123ed9627497"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end