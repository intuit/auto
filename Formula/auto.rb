class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.20.3/auto-macos.gz"
  version "v10.20.3"
  sha256 "d7a804f818b139cd404c4327ac5e5433ad18d73fd784bbf36f63f185067d518e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end