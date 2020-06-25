class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.40.4/auto-macos.gz"
  version "v9.40.4"
  sha256 "51b40f0bf4977d6d20a675f6d460a7c9cac5cc10a6ccb5e109939700c3c4669b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end