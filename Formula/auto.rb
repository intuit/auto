class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.32.4/auto-macos.gz"
  version "v10.32.4"
  sha256 "30cb3f3403f4a406ff49daf52dbf2c24a5560d1fee44eab866889d5cd0dbd3aa"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end