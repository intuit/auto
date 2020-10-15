class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.59.0/auto-macos.gz"
  version "v9.59.0"
  sha256 "7517aa53b9f23bd1274afafaf91dec3582d6ae5fb96cc7fa481c03c97484d063"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end