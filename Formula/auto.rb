class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.29.0/auto-macos.gz"
  version "v10.29.0"
  sha256 "2a105e2efb9c78ed92995b6277278b569fa33d6516c3e15c179edcfeb4b0aa51"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end