class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.49.1/auto-macos.gz"
  version "v9.49.1"
  sha256 "602fbc25f716bcac962524974ceb42749d213e3a6a6bdf63f5e8d53f27020a61"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end