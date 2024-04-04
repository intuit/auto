class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.1.4/auto-macos.gz"
  version "v11.1.4"
  sha256 "2926fc501a7159eb78ae057b78d1df3d743873b4d4711abd70aa086c6350cd5e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end