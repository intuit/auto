class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.6.2/auto-macos.gz"
  version "v10.6.2"
  sha256 "d51dc6214cfa5f1d517428b00f7a78f78fc550b84e217798242727d13cf69171"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end