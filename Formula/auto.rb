class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.6.1/auto-macos.gz"
  version "v10.6.1"
  sha256 "e2d2e0c157be92b5d66719afbddcf8a6fd19a2a49c8bb9f05c78e52c1d9f7535"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end