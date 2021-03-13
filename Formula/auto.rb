class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.19.0/auto-macos.gz"
  version "v10.19.0"
  sha256 "ad684d23dbd9b2b41ae10304587da7f33b95e4fa1c98e5b34b58ee72c2335524"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end