class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.29.1/auto-macos.gz"
  version "v10.29.1"
  sha256 "a64dcea97a1c9f31b3dd4a718a68ab211d2496443361527dd08835a946486125"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end