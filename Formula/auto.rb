class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.50.7/auto-macos.gz"
  version "v9.50.7"
  sha256 "f31cc2752437c25b3e7ec86e4879c8da7bc6bc6d7acd57de4c73cab7b37203aa"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end