class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.38.4/auto-macos.gz"
  version "v10.38.4"
  sha256 "13380f6b942918e9ccafc0e18350497a3bdfbbf9b5b0ddc0a88d064f89b44970"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end