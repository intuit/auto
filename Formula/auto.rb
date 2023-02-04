class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.38.4/auto-macos.gz"
  version "v10.38.4"
  sha256 "352172c45018ae1ae19814b1b888f2aaa7baa8ca1aeaebd47708e1ff2cdef4cf"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end