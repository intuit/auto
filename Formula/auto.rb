class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.7.0/auto-macos.gz"
  version "v10.7.0"
  sha256 "abd664bdfb0535df702a33c9a06f9908104da94bc44b59a66d2e79ba4b8c9d51"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end