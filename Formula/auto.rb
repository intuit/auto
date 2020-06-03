class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.38.1/auto-macos.gz"
  version "v9.38.1"
  sha256 "7e52a505526350a645c738e370c11c838a0fedb63ec8e1c6b3d331de15ff3c2d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end