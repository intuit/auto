class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.40.0/auto-macos.gz"
  version "v10.40.0"
  sha256 "6d6b01f5b3cf09b4d97653be6a2ae2c7a260a99f5d2501058e61bd9ac2bc6362"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end