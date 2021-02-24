class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.8/auto-macos.gz"
  version "v10.16.8"
  sha256 "b00e35957eb8641a8e756ffd8f8ccb6b407841d26380b307703f41e2e8b28ba9"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end