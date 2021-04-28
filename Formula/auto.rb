class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.25.2/auto-macos.gz"
  version "v10.25.2"
  sha256 "7a738caf32c939aba4a56f022ca0de03a80c2abf6bb55c071135ef397c698286"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end