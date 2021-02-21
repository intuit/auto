class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.7/auto-macos.gz"
  version "v10.16.7"
  sha256 "553351a35e5f9accaa66cbe270c4a01e6b4dafef5bf5b0f077475de21369c1c5"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end