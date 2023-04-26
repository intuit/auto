class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.45.1/auto-macos.gz"
  version "v10.45.1"
  sha256 "401ead5caa6c5e39f855e2b1226b154168ae2f2c683c4cd5adafe8daabbfad83"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end