class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.36.4/auto-macos.gz"
  version "v10.36.4"
  sha256 "9dc6972e6a945c9d9dfa5b8cc0bb633d1ae412dfb453e5ca90ff2d18d220750d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end