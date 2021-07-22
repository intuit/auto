class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.30.0/auto-macos.gz"
  version "v10.30.0"
  sha256 "b4097b8099c6a048923044e627c57f095f6e76727d666d9b13d8bb9e87542d26"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end