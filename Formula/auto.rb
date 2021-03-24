class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.22.1/auto-macos.gz"
  version "v10.22.1"
  sha256 "3c36ea71252261576b66f818c857d06564506e15bda35618cd2f8dd4fc558ff4"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end