class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.13.2/auto-macos.gz"
  version "v10.13.2"
  sha256 "207ab1e3ea8b4333b101c6d309d809fc9641c0dfc9b6c830c3613102e182763a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end