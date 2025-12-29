class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.3.6/auto-macos.gz"
  version "v11.3.6"
  sha256 "28c394929f879361ff256e9fd3b105265f1ad56f6375ecc5802b6bf8dc5a3fcf"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end