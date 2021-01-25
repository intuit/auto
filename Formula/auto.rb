class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.13.0/auto-macos.gz"
  version "v10.13.0"
  sha256 "9c01794c7a472f71ba05f51e3e044c2fdd9a1c0b1a5505659e9c1a7b08d004dc"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end