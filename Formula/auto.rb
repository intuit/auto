class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.10.0/auto-macos.gz"
  version "v10.10.0"
  sha256 "736c0b3e842726524795425fda0a01d76e308fd4212af193fa25ed48f91b4bae"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end