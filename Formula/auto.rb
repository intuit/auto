class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.38.5/auto-macos.gz"
  version "v10.38.5"
  sha256 "dc26426b89ffdd8c4ad8885801c919aabf7d19418da9290cd8a07eb6c2039a9c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end