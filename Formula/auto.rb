class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.47.1/auto-macos.gz"
  version "v9.47.1"
  sha256 "580dfe5a558fc0a78a4523c8a7f6152a9b4c674f40f327ea05e235151fe54f3f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end