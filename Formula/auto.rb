class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.36.3/auto-macos.gz"
  version "v9.36.3"
  sha256 "c35b322fd58ae51d38faaeedc9e3f4423e46539fedfb7c3ae0691a533d5c9d30"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end