class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.30.2/auto-macos.gz"
  version "v9.30.2"
  sha256 "050da4147984b3e3884e5a41cc5afa158417cca54e1493b0b7cc85a152e61a2f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end