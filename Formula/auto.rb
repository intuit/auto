class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.36.6/auto-macos.gz"
  version "v10.36.6"
  sha256 "217e882ab279417298ebc1077b76c42d27f7220959c4d8edd1ab476f80ad9f73"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end