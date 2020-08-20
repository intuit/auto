class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.51.0/auto-macos.gz"
  version "v9.51.0"
  sha256 "aa68b9bf0cb9f117ea4ba264f979e511ba8e5b326b48fcecbd4813c938823907"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end