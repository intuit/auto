class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.25.1/auto-macos.gz"
  version "v9.25.1"
  sha256 "dd50113a41c719433dd4ffbfc82fd9b17518df735f97033ff70d1f416a02dd12"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end