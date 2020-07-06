class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.41.1/auto-macos.gz"
  version "v9.41.1"
  sha256 "c22d6538770d495cd7dd9e337d3b10c970a4b635f99868db60a4ffd8c41acb68"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end