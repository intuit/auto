class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.39.0/auto-macos.gz"
  version "v10.39.0"
  sha256 "3784c0051e316d4e3fd0325c3375d5ab6734f87ff0dfc3d84d7ad87ddf4bdeb5"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end