class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.5/auto-macos.gz"
  version "v10.16.5"
  sha256 "9f5e7c396e12cd9d36a544b124dfc57a1da16a778ad430cc22e9114129387ba6"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end