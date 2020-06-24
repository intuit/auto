class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.40.1/auto-macos.gz"
  version "v9.40.1"
  sha256 "028992deecb5c30833e017f6681f9f2a59ad77c29d7718c1dccd9319f270c9cd"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end