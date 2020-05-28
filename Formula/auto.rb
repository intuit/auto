class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.36.4/auto-macos.gz"
  version "v9.36.4"
  sha256 "5f5114f35707e89e06a50068c2aa24038e0d9a600bd813ff56afdb47d5c0f36b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end