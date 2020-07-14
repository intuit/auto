class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.46.0/auto-macos.gz"
  version "v9.46.0"
  sha256 "37a2f48473aea1e16c3074f59f1196d0dece6e21e8f407f148cc921fdb82ed7e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end