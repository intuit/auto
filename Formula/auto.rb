class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.36.2/auto-macos.gz"
  version "v10.36.2"
  sha256 "0d444a1c8e5496879ee99a78dd74a14b17eface973c443675ff7f7437c0f615c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end