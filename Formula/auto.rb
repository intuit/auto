class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.55.0/auto-macos.gz"
  version "v9.55.0"
  sha256 "366808747703733ece16b61d3ed985f11f84962d2045c3528fe2cbb6e00d705b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end