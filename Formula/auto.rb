class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.23.0/auto-macos.gz"
  version "v9.23.0"
  sha256 "a8c6eb898cbcbf30cd230d09c35369bf4ae2f2f2efb736dd5829aec70e70d90c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end