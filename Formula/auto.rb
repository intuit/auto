class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.23.0/auto-macos.gz"
  version "v10.23.0"
  sha256 "d2ce17391063e2a07c029c35d5f95ffdecab6a7d2093dab67e5cbc7fddb48e20"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end