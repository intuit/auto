class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.32.3/auto-macos.gz"
  version "v9.32.3"
  sha256 "8714556672f9a1a5c44bd26e36d630b2253fae515e784cb8ee4aa2863e7092d6"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end