class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.33.1/auto-macos.gz"
  version "v9.33.1"
  sha256 "1591fe26e80fcb2f865387077f114d87f28419ba8f0fbdca7ec7820a10b82b21"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end