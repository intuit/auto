class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.14.2/auto-macos.gz"
  version "v10.14.2"
  sha256 "47831a80be58d87da840ce6f6a659d7c155f5aa7ee73bb3cfd73460ff0687092"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end