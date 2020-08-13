class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.50.4/auto-macos.gz"
  version "v9.50.4"
  sha256 "5ffd1313d9d0aa6f4606d80212de6f4663738abd75b84c63275086c9a247f09c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end