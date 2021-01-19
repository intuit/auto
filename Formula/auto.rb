class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.10.1/auto-macos.gz"
  version "v10.10.1"
  sha256 "9f83db0e5c1de8056e607ac7efa721e825e112cf6ac553c319ebfa3e89bc6cd8"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end