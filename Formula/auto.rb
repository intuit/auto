class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.7/auto-macos.gz"
  version "v11.0.7"
  sha256 "fabb52bd40161181a92fd7902d863a581d94b8046af694201694a0dd0a0f4e59"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end