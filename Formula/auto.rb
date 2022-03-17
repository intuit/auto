class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.34.2/auto-macos.gz"
  version "v10.34.2"
  sha256 "9b001574ebd906074c3b98ff86b329db21b794999b827f29e3f070b3c00d7e3d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end