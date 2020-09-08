class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.53.1/auto-macos.gz"
  version "v9.53.1"
  sha256 "2750c57cceb39cef0d5862394377c2d810f9c67f91687a3a696bffbe3185f7ad"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end