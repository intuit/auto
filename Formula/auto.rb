class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.20.0/auto-macos.gz"
  version "v10.20.0"
  sha256 "6e3579daaf4f1df23a3079520288507ae940945a3dfaa7c4989774424fcf816b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end