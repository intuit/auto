class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.1.0/auto-macos.gz"
  version "v11.1.0"
  sha256 "e698b5704f95f87296e5fe1b4eccf161190365fe811eb3ce5f03cc3eacfc98c4"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end