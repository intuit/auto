class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.43.0/auto-macos.gz"
  version "v10.43.0"
  sha256 "66e9110c7ccdd98c998c537f40c9f3fc2e981d93142eeaab141a28efb92c531a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end