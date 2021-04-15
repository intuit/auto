class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.25.1/auto-macos.gz"
  version "v10.25.1"
  sha256 "6243caa43073d5faafbda2cca047d7f3d73b1275578bbccc041de12453608ef8"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end