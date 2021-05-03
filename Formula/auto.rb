class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.26.1/auto-macos.gz"
  version "v10.26.1"
  sha256 "a5dadfdf2c93a970fc04ed23b63398df9e47f063c7fbf6f831c505c85176e651"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end