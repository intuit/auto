class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.26.4/auto-macos.gz"
  version "v9.26.4"
  sha256 "4b9f977a0b93b2f66d0d260785ec15294aec479bea95593f0d5baf9fa94acc70"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end