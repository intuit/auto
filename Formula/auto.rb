class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.18.2/auto-macos.gz"
  version "v10.18.2"
  sha256 "68d45941dcdfa29b401b45d0742624a33848d8ba7b13c9b2749370009ff01bb4"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end