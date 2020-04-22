class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.30.1/auto-macos.gz"
  version "v9.30.1"
  sha256 "d8a226d28070a9152cccc3a206547f0ccb270f895c16dece1993d02c7385b0cd"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end