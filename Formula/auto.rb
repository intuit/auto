class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.18.8/auto-macos.gz"
  version "v10.18.8"
  sha256 "8992abef23b3f0d47f911c409ef59ffe612e390768b4a271d1a1817760f1ec30"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end