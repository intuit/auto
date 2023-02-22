class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.42.2/auto-macos.gz"
  version "v10.42.2"
  sha256 "57a2faacc65ed48d03502350628e949ea2f99272a0a156ddb4e0cc35e75ee00a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end