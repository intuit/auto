class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.39.0/auto-macos.gz"
  version "v10.39.0"
  sha256 "58081ff12f481effe85c0c9a279ac14d7aa5a55d5ac9eed9bb336c6df0cfc4a7"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end