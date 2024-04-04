class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.1.5/auto-macos.gz"
  version "v11.1.5"
  sha256 "afc9c20bc8d91c3dcf14201b4957e64e5f2cacbc9318b22b324017f43a82965a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end