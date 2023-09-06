class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.2/auto-macos.gz"
  version "v11.0.2"
  sha256 "895eaa333b233cd749bde393bb8a140d8fd1eeb0de3542cc4cd825bf6ab41c3e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end