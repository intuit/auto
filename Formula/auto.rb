class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.3.0/auto-macos.gz"
  version "v11.3.0"
  sha256 "c7527afe74d8469b3c52fb2c753cec7dbed5d9a7618fa9231697af0d76c00a77"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end