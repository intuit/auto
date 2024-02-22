class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.5/auto-macos.gz"
  version "v11.0.5"
  sha256 "5718b44cf896ef9b370c10e1109adb8f230e21a7e08ffa4a0becf48fb9f1f14b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end