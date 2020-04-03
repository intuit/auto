class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.24.0/auto-macos.gz"
  version "v9.24.0"
  sha256 "f3210ff5d0335dd953d5361f07132f0676efbb92bfb74f6d765876fc20f77a10"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end