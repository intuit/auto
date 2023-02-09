class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.41.0/auto-macos.gz"
  version "v10.41.0"
  sha256 "fd83a479ada3c4fa6ae2e8143af4d85f4aaccb5b382fab7d02ae36c09085cb1c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end