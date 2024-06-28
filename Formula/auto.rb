class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.1.7/auto-macos.gz"
  version "v11.1.7"
  sha256 "57793c732c5fdbc0c332a3c60ec3875cc48b7d518158868a26d6c03d71f292b0"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end